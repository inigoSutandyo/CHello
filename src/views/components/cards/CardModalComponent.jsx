import React, { Fragment, useEffect, useState } from "react";
import {
  addCardComment,
  addCheckList,
  changeChecked,
  changeLabel,
  removeCheckList,
  updateDescription,
  updateTitle,
  useCardComment,
  useCardLabel,
  useCheckList,
  useLabels,
} from "../../../controller/CardController";
import { CheckListComponent } from "./CheckListComponent";
import {IoSend} from "react-icons/io5"
import parse from "html-react-parser";
import { LabelOptionComponent } from "./LabelOptionComponent";
import ProgressBar from "@ramonak/react-progress-bar";
import { MentionsInput, Mention } from 'react-mentions'
import { useMentions } from "../../../controller/UserController";
import CommentComponent from "./CommentComponent";


export const CardModalComponent = ({
  card,
  boardId,
  kanbanId,
  cardUpdater,
  setCardUpdater,
  userId,
  setModalTitle,
  listUpdater,
  setListUpdater,
}) => {
  
  const [checkUpdater, setCheckUpdater] = useState(0)

  const {checklist, progress} = useCheckList(card, boardId, checkUpdater);
  const labels = useLabels(boardId, cardUpdater)
  const label = useCardLabel(labels, card)
  const users = useMentions(userId)
  // console.log(users)
  const checkListHandler = (e) => {
    if (e.key == "Enter") {
      // console.log(e.target.value)
      addCheckList(card.uid, boardId, e.target.value).then(() => {
        console.log("checklist added")
        setCardUpdater(cardUpdater + 1);
        setCheckUpdater(checkUpdater+1)
      });
    }
  };

  const removeCheckHandler = (checkId) => {
    removeCheckList(card.uid, boardId, checkId).then(() => {
      setCardUpdater(cardUpdater + 1);
      setCheckUpdater(checkUpdater+1)
    });
  };

  const handleCheckListChange = (checkId, checked) => {
    // console.log(checked)
    changeChecked(card.uid, boardId, checkId, checked).then(() => {
      setCheckUpdater(checkUpdater+1)
    })
  }

  const handleLabelChange = (selected) => {
    if (selected == "-1") {
      return
    } else {
      changeLabel(card.uid, selected, boardId).then(() => {
        console.log("updated label")
        setListUpdater(listUpdater+1);
        // setCardUpdater(cardUpdater+1)
      })
    }
  }



  return (
    <div className="m-3">
      <div className="form-floating mb-3">
        <input
          type="text"
          className="form-control"
          id="title"
          defaultValue={card.title}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              // console.log(e.target.value)
              updateTitle(e.target.value, card.uid, boardId).then(() => {
                setCardUpdater(cardUpdater + 1);
              });
            }
          }}
        />
        <label htmlFor="floatingInput">Title</label>
      </div>

      <div className="form-floating mb-3">
        <div 
          contentEditable 
          className="form-control h-100"
          id="desc-div"
          onBlur={() => {
            const innerHtml = document.getElementById("desc-div").innerHTML
            // console.log(innerHtml)
            updateDescription(innerHtml, card.uid, boardId).then(() => {
              setCardUpdater(cardUpdater + 1);
            });
          }}
          suppressContentEditableWarning={true}
        >
          {parse(card.description)}
        </div>
        <label htmlFor="desc-div">Description</label>
      </div>

      <div className="mb-5">
        <input type="button" className="btn btn-outline-dark mb-3" value="Create New Label" onClick={() => {
          setModalTitle("Label")
        }}/>
        {card.label ?  (
          label ? (
            <select className="form-select" id="label-select" aria-label="Choose Label" defaultValue={label.uid} onChange={() => {
              const selected = document.getElementById('label-select').value
              handleLabelChange(selected)            
            }}>
              <option value="-1">-- Choose Label --</option>
              {labels?.map(l => 
                <LabelOptionComponent label={l} key={l.uid}/>
              )}
            </select>
          ) : <div>Fetching Labels...</div>
        ) : (
          <select className="form-select" id="label-select" aria-label="Choose Label" defaultValue={"-1"} onChange={() => {
            const selected = document.getElementById('label-select').value
            handleLabelChange(selected) 
          }}>
            <option value="-1">-- Choose Label --</option>
            {labels?.map(l => 
              <LabelOptionComponent label={l} key={l.uid}/>
            )}
          </select>
        )}
      </div>
      <div className="mb-3">
        <label className="mb-1">Check List</label>
        {checklist && checklist.length !== 0 ? (
          <>
            <ProgressBar completed={progress/checklist.length * 100} className="mb-1"/>
          </>
        ) : <></>}
        <CheckListComponent
          checklist={checklist}
          checkListHandler={checkListHandler}
          removeCheckHandler = {removeCheckHandler}
          handleChange = {handleCheckListChange}
        />
      </div>

      <div className="mb-3">
        <label>Due Date</label>
        <input type="datetime-local" className="form-control" />
      </div>

      <div className="mb-3">
        <label>Reminder Date</label>
        <input type="datetime-local" className="form-control" />
      </div>
      
      {users ? (
        <div className="mb-3">
          <label>Card Comment</label>
          <div className="input-group mb-3 form-floating">
            {/* <input type="text" className="form-control" id="comment" placeholder="Comment" aria-label="Add Comment" aria-describedby="btn-comment"/> */}
            {/* <textarea className="form-control" placeholder="Leave a comment here" id="comment"></textarea> */}
            <CommentComponent users={users} card = {card} userId={userId} boardId={boardId}/>
            
          </div>
            <input type="button" className="btn btn-outline-secondary" value="View All Comments" onClick={() => {
              setModalTitle("Comments")
            }}/>
          <div>

          </div>
        </div>
      ) : <></>}
    </div>
  );
};
