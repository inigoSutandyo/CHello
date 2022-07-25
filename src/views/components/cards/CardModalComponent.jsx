import React, { Fragment, useState } from "react";
import {
  addCardComment,
  addCheckList,
  removeCheckList,
  updateDescription,
  updateTitle,
  useCardComment,
  useCheckList,
} from "../../../controller/CardController";
import { CheckListComponent } from "./CheckListComponent";
import {IoSend} from "react-icons/io5"
import parse from "html-react-parser";

export const CardModalComponent = ({
  card,
  boardId,
  kanbanId,
  cardUpdater,
  setCardUpdater,
  userId,
  setModalTitle
}) => {
  const checklist = useCheckList(card, boardId);

  const checkListHandler = (e) => {
    if (e.key == "Enter") {
      // console.log(e.target.value)
      addCheckList(card.uid, boardId, e.target.value).then(() => {
        setCardUpdater(cardUpdater + 1);
      });
    }
  };

  const removeCheckHandler = (cardId, boardId, listId) => {
    removeCheckList(cardId, boardId, listId).then(() => {
      setCardUpdater(cardUpdater + 1);
    });
  };

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
            console.log(innerHtml)
            updateDescription(innerHtml, card.uid, boardId).then(() => {
              setCardUpdater(cardUpdater + 1);
            });
          }}
          suppressContentEditableWarning={true}
        >
          {parse(card.description)}
        </div>
        {/* <input
          type="text"
          className="form-control"
          id="description"
          defaultValue={card.description}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              updateDescription(e.target.value, card.uid, boardId).then(() => {
                setCardUpdater(cardUpdater + 1);
              });
            }
          }}
        /> */}
        <label htmlFor="floatingPassword">Description</label>
      </div>

      <div className="mb-3">
        <label>Check List</label>
        <CheckListComponent
          checklist={checklist}
          checkListHandler={checkListHandler}
          cardId={card.uid}
          boardId={boardId}
          removeCheckHandler = {removeCheckHandler}
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

      <div className="mb-3">
        <label>Card Comment</label>
        
        <div className="input-group mb-3">
          <input type="text" className="form-control" id="comment" placeholder="Comment" aria-label="Add Comment" aria-describedby="btn-comment"/>
          <button className="btn btn-outline-secondary" type="button" id="btn-comment" onClick={() => {
            const content = document.getElementById('comment').value.trim()
            addCardComment(card.uid, boardId, userId, content)
            document.getElementById('comment').value = ""
          }}>
            <IoSend/>
          </button>
        </div>
          <input type="button" className="btn btn-outline-secondary" value="View All Comments" onClick={() => {
            setModalTitle("Comments")
          }}/>
        <div>

        </div>
      </div>
    </div>
  );
};
