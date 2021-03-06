import React, { useState } from "react";
import "../../Styling/Discussion/EditDis.css";
import addCircle from "../../Exports/add_circle.svg";
import clear from "../../Exports/clear.svg";
import { editDisc } from "../../redux/Discussion/disSlice";
import { useDispatch } from "react-redux";
import CalendarTemp from "../EditDisc/CalendarTemp";
import PostInsp from "../EditDisc/PostInsp";
import StarterPrompt from "../EditDisc/StarterPrompt";
import PostAs from "../EditDisc/PostAs";
import Scores from "../EditDisc/Scores";
import Calendar from "../EditDisc/Calendar";
import { useEffect } from "react";
import axios from "axios";

function EditDisModal({ discussions, showEditModal }) {
  const dispatch = useDispatch();
  const [allCheckedIDs, setallCheckedIDs] = useState([]);
  const [saveState, setSaveState] = useState(false);
  const [previousValue, setPreviousVal] = useState([]);
  // STARTER PROMPT
  const [starterPrompt, setstarterPrompt] = useState(false);
  const [starterPromptMode, setstarterPromptMode] = useState(false);
  const [starterPromptValue, setstarterPromptValue] = useState("");
  // POST INSPIRATION
  const [postInsp, setPostInsp] = useState(false);
  const [postInspMode, setPostInspMode] = useState(false);
  const [posting, setPosting] = useState(true);
  const [responding, setResponding] = useState(false);
  const [synthesizing, setSynthesizing] = useState(false);
  const [allPostInsp, setAllPostInsp] = useState([
    "Identify course concepts that relate to and/or support your ideas about this topic.",
    "Ask questions and/or create a poll to generate more discussion and help you and your peers think more deeply about the topic.",
    "Share ideas about this topic from the perspective of someone who would likely think differently about the topic than you..",
    "Describe the types of strategies you use to remember important concepts about this topic (for example, attaching note or graphic organizers you have created; share an acrostic, a story, or a rhyme you created to to aid your memory, etc.",
    "Share a link to a web-based resource that supports your ideas about the topic, explaining the value of that resource for supporting your perspective",
  ]);
  const [RespInsp, setRespInsp] = useState([
    "Identify similarities and differences between the way you and your peer approached this topic.",
    "Clarify any misunderstandings or inaccuracies you identified in your peer's post.",
    "Ask follow-up questions and/or create a poll to generate more discussion and help you and your peers think more deeply about this topic.",
    "Connect ideas shared by you and your peer with specific course concepts.",
    "Share a link to a web-based resource that would help expand on the ideas shared by your classmate, explaining the value of the resources for understanding the concepts shared by your peer.",
  ]);
  const [SynInsp, setSynInsp] = useState([
    "Explore the discussion charts to identify frequently used tags that are interesting to you. Identify the tags and explain why you believe those tags were important to the discussion of this topic.",
    "Explore the discussion charts to identify connections between tags that are interesting to you. Describe the connections you found and explain how those connections might inform how we think about this topic.",
    "Explore the discussion charts to identify the three most popular threads. Identify common themes and/or tags present in each. Explain how those themes and/or tags might inform how we think about this topic.",
    "Filter the discussion by tags that interest you and review all the posts containing those tags. Describe common themes from the posts using those tags.",
    "Filter the discussion by upvotes to identify the three most important posts. Summarize the main points made in each of those posts and explain how those ideas can help the class think better about this topic.",
    "Explain how lessons learned from this discussion can apply to other related or unrelated topics or situations.",
  ]);
  // POST IN
  const [postAs, setpostAs] = useState(false);
  const [postAsMode, setpostAsMode] = useState(false);
  const [allPostAs, setAllPostAs] = useState([
    "questions",
    "resources",
    "synthesis",
  ]);

  // SCORES
  const [scores, setscores] = useState(false);
  const [scoresMode, setScoresMode] = useState(false);
  const [scoresValue, setScoresValue] = useState(5);
  const [reactionsValue, setReactionsValue] = useState(5);
  const [upvoteValue, setUpvoteValue] = useState(5);
  const [totalValue, setTotalValue] = useState(100);
  const [allrubric, setAllRubric] = useState([" "]);
  const [rubMaxScore, setRubMaxScore] = useState(100);
  let midscore = rubMaxScore / allrubric.length;
  midscore = midscore.toFixed(0);
  // CALENDAR
  const [calendar, setCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState(false);
  const [automatic, setautomatic] = useState(true);
  const [applyAll, setApplyAll] = useState(false);
  const [showCalDate, setShowCalDate] = useState(false);

  const today = new Date();
  let tommorrow = new Date();
  tommorrow.setDate(today.getDate() + 1);
  console.log(tommorrow);

  const [date, setDate] = useState([today, tommorrow]);

  //   HANDLE CHECKED
  const handleChecked = (e) => {
    setApplyAll(!applyAll);
    if (e.target.checked) {
      let newar = discussions.filter((dis) => dis.discussionId);
      newar = newar.discussionId;
      console.log(newar);
    } else {
      setallCheckedIDs([""]);
    }

    // dis
  };
  //HANDLE SAVE EDITS
  const saveEdit = () => {
    console.log(upvoteValue);
    var firstEvent = date[0];

    let dateOne = JSON.stringify(firstEvent);
    dateOne = dateOne.slice(1, 11);

    var secondEvent = date[1];

    let dateTwo = JSON.stringify(secondEvent);
    dateTwo = dateTwo.slice(1, 11);

    const payload = {
      set_id: `${discussions[0].setId || discussions[0].setID}`,
      updateDiscussions: [
        ...allCheckedIDs.map((ids) => ({
          discussion_id: `${ids}`,
          starterPrompt: `${starterPromptValue}`,
          postInspirations: [
            {
              type: "Posting",
              comments: [...allPostInsp],
            },
            {
              type: "Responding",
              comments: [...RespInsp],
            },
            {
              type: "Synthesizing",
              comments: [...SynInsp],
            },
          ],

          postAs: [...allPostAs],
          scores: {
            type: `${automatic ? "Automatic" : "Rubric"}`,
            actions: [
              {
                type: "Scores",
                score: scoresValue,
              },
              {
                type: "Reactions",
                score: reactionsValue,
              },
              {
                type: "Upvotes",
                score: upvoteValue,
              },
            ],
            // actions: [
            //   {
            //     type: "Scores",
            //     score: scoresValue,
            //   },
            //   {
            //     type: "Reactions",
            //     score: reactionsValue,
            //   },
            //   {
            //     type: "Upvotes",
            //     score: upvoteValue,
            //   },
            // ],

            totalScore: automatic ? totalValue : rubMaxScore,
          },

          startDate: dateOne,
          closeDate: dateTwo,
        })),
      ],
    };
    //hhhjxjjxn
    console.log(JSON.stringify(payload, undefined, 2));

    // dispatch(editDisc(payload));
    // setApplyAll(false);
    // showEditModal();
  };
  //HANDLE ChECkBOX
  const checkBox = async (e) => {
    console.log(e.target.id);
    setallCheckedIDs([...allCheckedIDs, e.target.id]);
    setSaveState(true);
    const currentData = await getPreviousData(e.target.id);
    setstarterPromptValue(currentData.updateDiscussion.starterPrompt);
    // setAllPostInsp(currentData.updateDiscussion.postInspirations[0].comments);
    // setRespInsp(currentData.updateDiscussion.postInspirations[1].comments);
    // setSynInsp(currentData.updateDiscussion.postInspirations[2].comments);

    setAllPostAs(currentData.updateDiscussion.postAs);
  };
  let id;

  const getPreviousData = async (code) => {
    var apiBaseUrl = `http://localhost:8080/api/auth/discussion?discussionId=${code}`;

    axios.defaults.headers.get["Content-Type"] =
      "application/json;charset=utf-8";
    axios.defaults.headers.get["Access-Control-Allow-Origin"] = "*";
    axios.defaults.headers.get["Access-Control-Allow-Methods"] = "GET";
    try {
      const res = await axios.get(apiBaseUrl);
      const data = res.data;
      console.log(data);
      return data;
    } catch (error) {
      console.log({ ...error });
      // return DiscussionCont;
    }
  };
  useEffect(() => {
    const fetchDiscussions = async () => {
      const previousData = await getPreviousData(discussions[0].code);
      console.log(previousData);
      // setPreviousVal(previousData);
      setstarterPromptValue(previousData.updateDiscussion.starterPrompt);
      // setAllPostInsp(
      //   previousData.updateDiscussion.postInspirations[0].comments
      // );
      // setRespInsp(previousData.updateDiscussion.postInspirations[1].comments);
      // setSynInsp(previousData.updateDiscussion.postInspirations[2].comments);
      setAllPostAs(previousData.updateDiscussion.postAs);

      if (discussions.length === 1) {
        id = discussions[0].code;
        setallCheckedIDs([id]);
      }
    };
    fetchDiscussions();
  }, []);

  console.log(allCheckedIDs);
  console.log(discussions);

  // HANDLE DELETE
  const DelPostInsp = (value) => {
    value = +value;
    const items = allPostInsp.filter((item, index) => index !== value);
    setAllPostInsp(items);
  };
  const DelResInsp = (value) => {
    value = +value;
    const items = RespInsp.filter((item, index) => index !== value);
    setRespInsp(items);
  };
  const DelSynInsp = (value) => {
    value = +value;
    const items = SynInsp.filter((item, index) => index !== value);
    setSynInsp(items);
  };
  const DelPostAs = (value) => {
    value = +value;
    const items = allPostAs.filter((item, index) => index !== value);
    setAllPostAs(items);
  };
  const DelRubric = (value) => {
    value = +value;
    const items = allrubric.filter((item, index) => index !== value);
    setAllRubric(items);
  };
  return (
    <div className="editModal">
      <div className="EditDiscont  z-40">
        <div className="EditDisTop">
          <button
            className={`saveSettingBtn ${
              saveState ? "bg-primary" : "bg-saveBtn"
            } 
                ${saveState ? "text-white" : "text-desc"}
            `}
            onClick={saveEdit}
          >
            Save
          </button>
          <img className="canbtn" src={clear} onClick={showEditModal} alt="" />
        </div>
        <h2 className="EditHeading">Discussions</h2>
        <div className="allCheckDisc " id={discussions[0].setId}>
          {discussions.length === 1 ? (
            <div className="formControl">
              <input
                type="checkbox"
                name="disc"
                checked
                id={discussions[0].discussionId}
                onChange={checkBox}
                onLoad={() => {
                  setallCheckedIDs(discussions[0].discussionId);
                  console.log(allCheckedIDs);
                }}
                on
              />
              <label htmlFor="">{discussions[0].title}</label>
            </div>
          ) : (
            discussions.map((dis, index) => (
              <div className="formControl " key={index}>
                {applyAll ? (
                  <input
                    type="checkbox"
                    name="disc"
                    checked
                    id={dis.discussionId}
                    onChange={checkBox}
                  />
                ) : (
                  <input
                    type="checkbox"
                    name="disc"
                    id={dis.discussionId}
                    onChange={checkBox}
                  />
                )}
                <label htmlFor="">{dis.description || dis.title}</label>
                {/* <label htmlFor="">{dis}</label> */}
              </div>
            ))
          )}
        </div>
        {/*  BENEATH BOX */}
        <div className="px-5">
          <hr />
        </div>
        <div className="EditDisBottom">
          <div className="EditDisTop">
            <h2 className="SettingsHeading">Settings</h2>
            {discussions.length !== 1 && (
              <div className="applyAll">
                <label htmlFor="">Apply to all discussions</label>
                <input type="checkbox" name="" id="" onChange={handleChecked} />
              </div>
            )}
          </div>

          <div className="allSettings">
            {/* STARTER PROMPT */}
            <StarterPrompt
              starterPrompt={starterPrompt}
              starterPromptMode={starterPromptMode}
              setstarterPromptMode={setstarterPromptMode}
              starterPromptValue={starterPromptValue}
              setSaveState={setSaveState}
              setstarterPromptValue={setstarterPromptValue}
              //general
              setstarterPrompt={setstarterPrompt}
              setPostInsp={setPostInsp}
              setpostAs={setpostAs}
              setscores={setscores}
              setCalendar={setCalendar}
            />

            {/*POST INSPIRATION */}
            <PostInsp
              setPostInspMode={setPostInspMode}
              postInspMode={postInspMode}
              setSaveState={setSaveState}
              postInsp={postInsp}
              allPostInsp={allPostInsp}
              setAllPostInsp={setAllPostInsp}
              RespInsp={RespInsp}
              setRespInsp={setRespInsp}
              SynInsp={SynInsp}
              setSynInsp={setSynInsp}
              posting={posting}
              setPosting={setPosting}
              responding={responding}
              setResponding={setResponding}
              synthesizing={synthesizing}
              setSynthesizing={setSynthesizing}
              addCircle={addCircle}
              // general
              setstarterPrompt={setstarterPrompt}
              setPostInsp={setPostInsp}
              setpostAs={setpostAs}
              setscores={setscores}
              setCalendar={setCalendar}
              // DELETE
              DelPostInsp={DelPostInsp}
              DelResInsp={DelResInsp}
              DelSynInsp={DelSynInsp}
            />

            {/*POST IN */}
            <PostAs
              postAs={postAs}
              setpostAsMode={setpostAsMode}
              postAsMode={postAsMode}
              allPostAs={allPostAs}
              setAllPostAs={setAllPostAs}
              addCircle={addCircle}
              // general
              setSaveState={setSaveState}
              setstarterPrompt={setstarterPrompt}
              setPostInsp={setPostInsp}
              setpostAs={setpostAs}
              setscores={setscores}
              setCalendar={setCalendar}
              DelPostAs={DelPostAs}
            />

            {/*SCORES */}
            <Scores
              setScoresMode={setScoresMode}
              scoresMode={scoresMode}
              scores={scores}
              automatic={automatic}
              setautomatic={setautomatic}
              scoresValue={scoresValue}
              reactionsValue={reactionsValue}
              upvoteValue={upvoteValue}
              setReactionsValue={setReactionsValue}
              setUpvoteValue={setUpvoteValue}
              totalValue={totalValue}
              setTotalValue={setTotalValue}
              rubMaxScore={rubMaxScore}
              midscore={midscore}
              allrubric={allrubric}
              setAllRubric={setAllRubric}
              setScoresValue={setScoresValue}
              addCircle={addCircle}
              // general
              setSaveState={setSaveState}
              setstarterPrompt={setstarterPrompt}
              setPostInsp={setPostInsp}
              setpostAs={setpostAs}
              setscores={setscores}
              setCalendar={setCalendar}
              DelRubric={DelRubric}
            />

            {/*CALENDAR */}
            <Calendar
              calendarMode={calendarMode}
              setCalendarMode={setCalendarMode}
              calendar={calendar}
              setShowCalDate={setShowCalDate}
              date={date}
              // general
              setSaveState={setSaveState}
              setstarterPrompt={setstarterPrompt}
              setPostInsp={setPostInsp}
              setpostAs={setpostAs}
              setscores={setscores}
              setCalendar={setCalendar}
            />
          </div>
        </div>
        {showCalDate && (
          <CalendarTemp
            date={date}
            setDate={setDate}
            setShowCalDate={setShowCalDate}
          />
        )}
      </div>
    </div>
  );
}

export default EditDisModal;

// POST --> http://localhost:8080/api/auth/edit/discussions
// payload :

// {
//     "set_id":"m876",
//     "updateDiscussions":[{
//     "discussion_id":"discussion1",
//     "starterPrompt":"Kantheti",
//     "postInspirations":[
//     {
//     "type":"posting",
//         "comments":["posting1","posting2","posting3"]
//     }, {
//     "type":"Responding",
//         "comments":["Responding1","Responding2","Responding3"]
//     },{
//     "type":"Synthesizing",
//         "comments":["Synthesizing1","Synthesizing2","Synthesizing3"]
//     }
//     ],
//     "postAs":["lorem","1234"],
//     "scores":{
//     "type":"score",
//     "actions":[
//         {"type":"Scores","score":20},
//         {"type":"Reactions","score":30},
//         {"type":"Upvotes","score":50},
//         {"score":25,"criteria":["Rubric1"]},
//         {"score":55,"criteria":["Rubric2"]},
//         {"score":75,"criteria":["Rubric3"]}
//        ],
//     "totalScore":100
//     },
//     "startDate":"2022-01-15",
//     "closeDate":"2022-01-19"
//     }
//     ]
// }
