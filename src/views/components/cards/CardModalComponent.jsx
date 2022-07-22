import React, { useState } from "react";
import {
  addCheckList,
  removeCheckList,
  updateDescription,
  updateTitle,
  useCheckList,
} from "../../../controller/CardController";
import { CheckListComponent } from "./CheckListComponent";

export const CardModalComponent = ({
  card,
  boardId,
  kanbanId,
  cardUpdater,
  setCardUpdater,
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
        <input
          type="text"
          className="form-control"
          id="description"
          defaultValue={card.description}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              // console.log(e.target.value)
              updateDescription(e.target.value, card.uid, boardId).then(() => {
                setCardUpdater(cardUpdater + 1);
              });
            }
          }}
        />
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
    </div>
  );
};
