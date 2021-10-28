package com.pretzl.controllers;

import com.pretzl.models.ERole;
import com.pretzl.models.Role;
import com.pretzl.models.User;
import com.pretzl.payload.request.LoginRequest;
import com.pretzl.payload.request.SignupRequest;
import com.pretzl.payload.response.JwtResponse;
import com.pretzl.payload.response.MessageResponse;
import com.pretzl.repository.DiscussionRepository;
import com.pretzl.repository.RoleRepository;
import com.pretzl.repository.UserRepository;
import com.pretzl.security.jwt.JwtUtils;
import com.pretzl.security.services.UserDetailsImpl;
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
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
                roles, String.format("%s_%s", userDetails.getUsername(), userDetails.getId())));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUserName())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUserName(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setAlternativeEmail(signUpRequest.getAlternativeEmail());
        user.setOccupation(signUpRequest.getOccupation());
        user.setPrimarilyUse(signUpRequest.getPrimarilyUse());
        user.setPhoneNumber(signUpRequest.getPhoneNumber());
        user.setReceiveInsoUpdates(signUpRequest.isReceiveInsoUpdates());


        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "guest":
                        Role modRole = roleRepository.findByName(ERole.GUEST)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> registerUser(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getAllPosts(username));
    }

    @GetMapping("/discussion/users")
    public ResponseEntity<?> getUserDiscussionUser(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getDiscussionUsers(username));
    }

    @GetMapping("/discussion/set")
    public ResponseEntity<?> getUserDiscussionSet(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getUserDiscussionSets(username));
    }

    @GetMapping("/discussion/discussions")
    public ResponseEntity<?> getUserDiscussions(@RequestParam String username) {
        return ResponseEntity.ok(discussionRepository.getUserDiscussions(username));
    }
}
