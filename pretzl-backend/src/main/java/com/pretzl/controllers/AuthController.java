package com.pretzl.controllers;

import com.pretzl.models.Discussion;
import com.pretzl.models.*;
import com.pretzl.payload.request.*;
import com.pretzl.payload.response.GetDiscussionsResponse;
import com.pretzl.payload.response.JwtResponse;
import com.pretzl.payload.response.MessageResponse;
import com.pretzl.repository.DiscussionDetailsRepository;
import com.pretzl.repository.DiscussionRepository;
import com.pretzl.repository.RoleRepository;
import com.pretzl.repository.UserRepository;
import com.pretzl.security.jwt.JwtUtils;
import com.pretzl.security.services.UserDetailsImpl;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    DiscussionRepository discussionRepository;

    @Autowired
    DiscussionDetailsRepository discussionDetailsRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getFirstName(),
                userDetails.getLastName(),
                roles, String.format("%s_%s", userDetails.getUsername(), userDetails.getId())));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
        }
        String userName = String.format("%s.%s", signUpRequest.getFirstName(), signUpRequest.getLastName());
        int i = 1;
        while (userRepository.existsByUsername(userName)) {
            userName = userName.replaceAll("\\d+$", "") + i++;
        }

        // Create new user's account
        User user = new User(userName,
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());

        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName(ERole.USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        User userDetails = userRepository.save(user);

        return ResponseEntity.ok(userDetails);
    }

    @PostMapping("/guestLogin")
    public ResponseEntity<?> guestLoginUser(@Valid @RequestBody GuestLoginRequest guestLoginRequest) {

        if (userRepository.existsByEmail(guestLoginRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
        }
        String userName = String.format("%s.%s", guestLoginRequest.getFirstName(), guestLoginRequest.getLastName());
        int i = 1;
        while (userRepository.existsByUsername(userName)) {
            userName = userName.replaceAll("\\d+$", "") + i++;
        }

        // Create new user's account
        User user = new User(userName,
                guestLoginRequest.getEmail(),
                encoder.encode(""));

        Set<Role> roles = new HashSet<>();

        Role userRole = roleRepository.findByName(ERole.USER)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);

        user.setRoles(roles);
        User userDetails = userRepository.save(user);

        userDetails.setFirstName(guestLoginRequest.getFirstName());
        userDetails.setLastName(guestLoginRequest.getLastName());
        return ResponseEntity.ok(userDetails);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> registerUser(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getUserPostCount(username));
    }

    @GetMapping("/discussion/posts/count")
    public ResponseEntity<ICounts> userPostCount(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getUserPostCount(username));
    }

    @GetMapping("/discussion/users/count")
    public ResponseEntity<ICounts> getUserDiscussionCount(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getDiscussionUserCount(username));
    }

    @GetMapping("/discussion/sets/count")
    public ResponseEntity<ICounts> getUserDiscussionSetCount(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getUserDiscussionSetsCount(username));
    }

    @GetMapping("/discussion/discussions/count")
    public ResponseEntity<ICounts> getUserDiscussionsCount(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getUserDiscussionCount(username));
    }

    @GetMapping("/discussion/postreactions/count")
    public ResponseEntity<List<IReactions>> userPosts(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getReactions(username));
    }

    @GetMapping("/discussion/postreactions")
    public ResponseEntity<List<IReactions>> postreactions(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getReactions(username));
    }

    @GetMapping("/discussion/sets")
    public ResponseEntity<List<IDiscussionSet>> getUserDiscussionSet(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getUserDiscussionSets(username));
    }

    @GetMapping("/discussion/discussions")
    public ResponseEntity<List<IDiscussions>> getUserDiscussions(@RequestParam String username) {
//        return ResponseEntity.ok(discussionRepository.getUserDiscussions(username));
        return ResponseEntity.ok(discussionRepository.getUserDiscussionsByUserName(username));
    }

    @GetMapping("/discussion/post/details")
    public ResponseEntity<List<IDiscussions>> getDiscussionPostDetails(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getDiscussionPostDetails(username));
    }

    @GetMapping("/discussion/all")
    public ResponseEntity<List<Discussion>> getAllDiscussion(@RequestParam String username) {
        List<Discussion> discussionList = discussionRepository.getAllDiscussions(username);
//        discussionList.stream().collect(Collectors.groupingBy(Discussion::getSet_id));
        return ResponseEntity.ok(discussionList);
    }

    @GetMapping("/threads/all")
    public ResponseEntity<List<IThreads>> getAllThreads(@RequestParam String username) {
        List<IThreads> allThreads = discussionRepository.getAllThreads(username);
        return ResponseEntity.ok(allThreads);
    }

    @PostMapping("/create/discussions")
    public ResponseEntity<?> createDiscussions(@Valid @RequestBody DiscussionsRequest discussionsRequest) {
        Map<String, List<com.pretzl.payload.request.Discussion>> discMap = discussionsRequest.getDiscussions().stream().collect(Collectors.groupingBy(com.pretzl.payload.request.Discussion::getSetDescription));
        List<Discussion> discussionList = new ArrayList<>();
        discMap.forEach((setDescription, discussions) -> {
            String finalSet_id = RandomStringUtils.randomAlphanumeric(7);
            Discussion discSetModel = new Discussion();
            discSetModel.setDate(LocalDate.now().toString());
            discSetModel.setDescription(setDescription);
            discSetModel.setUsername(discussionsRequest.getUsername());
            discSetModel.setSet_id(finalSet_id);
            discSetModel.setAction_type("S");

            discussionRepository.save(discSetModel);

            discussions.forEach(discussion -> {
                Discussion discModel = new Discussion();
                discModel.setDate(LocalDate.now().toString());
                discModel.setDescription(discussion.getDescription());
                discModel.setUsername(discussionsRequest.getUsername());
                discModel.setSet_id(finalSet_id);
                discModel.setAction_type("D");
                discModel.setId(RandomStringUtils.randomAlphanumeric(7));
                discussionList.add(discussionRepository.save(discModel));
            });
        });

        return ResponseEntity
                .ok()
                .body(discussionList);
    }

    @PostMapping("/edit/discussions")
    public ResponseEntity<List<DiscussionDetail>> editDiscussions(@Valid @RequestBody UpdateDiscussionsRequest updateDiscussionsRequest) {
        String set_id = updateDiscussionsRequest.getSet_id();
        List<DiscussionDetail> discussionDetails = new ArrayList<>();
        updateDiscussionsRequest.getUpdateDiscussions().forEach(updateDiscussion -> {
                    discussionDetails.addAll(updateDiscussion.getScores().getActions().stream()
                            .map(actions -> updateDiscussion.getDiscussionDetail(set_id, actions))
                            .collect(Collectors.toList()));
                    updateDiscussion.getPostAs().forEach(postAs -> discussionDetails.add(updateDiscussion.getDiscussionDetailPostAs(set_id, postAs)));
            updateDiscussion.getPostInspirations().forEach(postInspiration -> discussionDetails.add(updateDiscussion.getDiscussionDetailPostInspiration(set_id,postInspiration)));
                }

        );
//        discussionDetails.forEach(discussionDetail -> discussionDetailsRepository.deleteUserDiscussionsById(discussionDetail.getDiscussion_id()));
        List<DiscussionDetail> discussionDetails1 = discussionDetailsRepository.saveAll(discussionDetails);
        discussionDetails1.forEach(discussionDetail1 -> System.out.println("Successfully updated for :" + discussionDetail1.getType() + " " + discussionDetail1.getScore()));
        return ResponseEntity
                .ok()
                .body(discussionDetails1);
    }

    @PostMapping("/update/discussions")
    public ResponseEntity<List<DiscussionDetail>> updateDiscussions(@Valid @RequestBody UpdateDiscussionsRequest updateDiscussionsRequest) {
        String set_id = updateDiscussionsRequest.getSet_id();
        List<DiscussionDetail> discussionDetails = new ArrayList<>();
        updateDiscussionsRequest.getUpdateDiscussions().forEach(updateDiscussion -> {
                    discussionDetails.addAll(updateDiscussion.getScores().getActions().stream()
                            .map(actions -> updateDiscussion.getDiscussionDetail(set_id, actions))
                            .collect(Collectors.toList()));
                    updateDiscussion.getPostAs().forEach(postAs -> discussionDetails.add(updateDiscussion.getDiscussionDetailPostAs(set_id, postAs)));
                }

        );

        List<DiscussionDetail> discussionDetails1 = discussionDetailsRepository.saveAll(discussionDetails);
        discussionDetails1.forEach(discussionDetail1 -> System.out.println("Successfully updated for :" + discussionDetail1.getType() + " " + discussionDetail1.getScore()));
        return ResponseEntity
                .ok()
                .body(discussionDetails1);
    }

    @GetMapping("/discussion")
    public ResponseEntity<GetDiscussionsResponse> getUserDiscussionById(@RequestParam String discussionId) {
//        return ResponseEntity.ok(discussionRepository.getUserDiscussions(username));
        List<Discussion> userDiscussionsById = discussionRepository.getUserDiscussionsById(discussionId);
        List<DiscussionDetail> userDiscussions = discussionDetailsRepository.getUserDiscussionsById(discussionId);
        GetDiscussionsResponse getDiscussionsResponse = new GetDiscussionsResponse();
        UpdateDiscussion updateDiscussion = new UpdateDiscussion();
        updateDiscussion.setDiscussion_id(discussionId);
        DiscussionDetail discussionDetail = userDiscussions.stream().findAny().orElse(new DiscussionDetail());
        updateDiscussion.setCloseDate(discussionDetail.getClose_date());
        updateDiscussion.setStartDate(discussionDetail.getStart_date());
        updateDiscussion.setStarterPrompt(discussionDetail.getStarter_prompt());
       /* if (discussionDetail.getPost_inspiration() != null) {
            Arrays.stream(discussionDetail.getPost_inspiration())
            ArrayList<PostInspiration> postInspirations = new ArrayList<>(Arrays.stream(discussionDetail.getPost_inspiration())
                    .filter(StringUtils::isNotEmpty).map(post -> {
                        PostInspiration postInspiration = new PostInspiration();
                        postInspiration.setType(post.get);
                        List<String> arrayList = new ArrayList<>();
                        arrayList.add(post);
                        postInspiration.setComments(arrayList);
                        return postInspiration;
                    }).collect(Collectors.toList()));
            updateDiscussion.setPostInspirations(postInspirations);
        }*/
        List<String> postAs = new ArrayList<>();
        List<Actions> actionsList = new ArrayList<>();
        AtomicInteger counter = new AtomicInteger(0);
        List<PostInspiration> postInspirations = new ArrayList<>();
        userDiscussions.forEach(discussion -> {
            if(discussion.getPost_inspiration()!=null && discussion.getPost_inspiration().length>0){
                List<String> arrayList = new ArrayList<>(Arrays.asList(discussion.getPost_inspiration()));
                PostInspiration postInspiration = new PostInspiration();
                postInspiration.setComments(arrayList);
                postInspiration.setType(discussion.getType());
                postInspirations.add(postInspiration);
            }
            if (StringUtils.isNotEmpty(discussion.getPost_as())) {
                postAs.add(discussion.getPost_as());
            }
            Actions actions = new Actions();
            actions.setScore(discussion.getScore());
            counter.addAndGet(discussion.getScore());
            if (discussion.getType().equalsIgnoreCase("Rubric")) {
                actions.setCriteria(Arrays.stream(discussion.getCriteria()).collect(Collectors.toList()));
                actions.setType("Rubric");
                actionsList.add(actions);
            } else {
                if (discussion.getType().equalsIgnoreCase("SS")) {
                    actions.setType("Scores");
                    actionsList.add(actions);
                } else if (discussion.getType().equalsIgnoreCase("SR")) {
                    actions.setType("Reactions");
                    actionsList.add(actions);
                } else if(discussion.getType().equalsIgnoreCase("SU")){
                    actions.setType("Upvotes");
                    actionsList.add(actions);
                }
            }

        });
        Score score = new Score();
        score.setType("score");
        score.setActions(actionsList);
        score.setTotalScore(userDiscussions.stream().filter(discussionDetail1 -> discussionDetail1.getTotal_score() > 0)
                        .findAny().orElse(new DiscussionDetail()).getTotal_score());
        updateDiscussion.setScores(score);
        updateDiscussion.setPostAs(postAs);
        updateDiscussion.setPostInspirations(postInspirations);
//        getDiscussionsResponse.setUpdateDiscussions();
        getDiscussionsResponse.setUpdateDiscussion(updateDiscussion);
        getDiscussionsResponse.setUserDiscussionsById(userDiscussionsById);
        return ResponseEntity.ok(getDiscussionsResponse);
    }
}
