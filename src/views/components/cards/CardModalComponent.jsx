import React, { Fragment, useEffect, useState } from "react";
import {
  addCardComment,
  addCheckList,
  addDueDate,
  addReminderDate,
  changeChecked,
  changeLabel,
  detachLabel,
  removeCheckList,
  updateDescription,
  updateTitle,
  useCardComment,
  useCardLabel,
  useCheckList,
  useLabels,
} from "../../../controller/CardController";
import { CheckListComponent } from "./checklist/CheckListComponent";
import parse from "html-react-parser";
import { LabelOptionComponent } from "./label/LabelOptionComponent";
import ProgressBar from "@ramonak/react-progress-bar";
import { useMentions } from "../../../controller/UserController";
import CommentComponent from "./comment/CommentComponent";
import { convertToLocalDateTime } from "../../../util/DateTime";


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
  const label = useCardLabel(labels, card, boardId)
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


  // console.log(card.reminder)
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
        <input type="button" className="btn btn-outline-dark mb-3 me-2" value="Create New Label" onClick={() => {
          setModalTitle("Label")
        }}/>
        <input type="button" className="btn btn-outline-dark mb-3" value="Detach Current Label" onClick={() => {
          detachLabel(card, boardId)
        }}/>
        {card.label ?  (
          label ? (
            <select className="form-select" id="label-select" aria-label="Choose Label" defaultValue={
              label ? label.uid : "-1"
            } onChange={() => {
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

      <div className="mb-4 row g-3">
        <div className="col-auto">
          <label htmlFor="duedate">Due Date</label>
          <input type="datetime-local" className="form-control" id="duedate" defaultValue={convertToLocalDateTime(card.due)}/>
        </div>
        <div className="col-auto">
          <label htmlFor="duedate">Reminder</label>
          <input type="datetime-local" className="form-control" id="reminder" defaultValue={convertToLocalDateTime(card.reminder)}/>
        </div>
        <div className="">
          <button className="btn btn-secondary" onClick={() => {
            const reminder = new Date(document.getElementById('reminder').value)
            const duedate = new Date(document.getElementById('duedate').value)
            if (Math.floor((duedate - reminder) / (1000*60*60*24)) >= 1) {
              addDueDate(card.uid, boardId, duedate)
              addReminderDate(card.uid, boardId, reminder)
            }
            // addDueDate(card.uid, boardId, duedate)
            // addReminderDate(card.uid, boardId, reminder)
          }}>Save Date</button>
        </div>
      </div>
      
      <div className="mb-3 d-flex justify-content-center">
        <input type="button" className="btn btn-outline-secondary" value="Attachments" onClick={() => {
          setModalTitle("Attachments")
        }}/>
      </div>

      {users ? (
        <div className="mb-3">
          <label>Card Comment</label>
          <div className="input-group mb-3 form-floating">
            {/* <input type="text" className="form-control" id="comment" placeholder="Comment" aria-label="Add Comment" aria-describedby="btn-comment"/> */}
            {/* <textarea className="form-control" placeholder="Leave a comment here" id="comment"></textarea> */}
            <CommentComponent users={users} card = {card} userId={userId} boardId={boardId}/>
            
          </div>
          <div className="d-flex justify-content-center">
            <input type="button" className="btn btn-outline-secondary" value="View All Comments" onClick={() => {
              setModalTitle("Comments")
            }}/>
          </div>
        </div>
      ) : <></>}
    </div>
  );
};
