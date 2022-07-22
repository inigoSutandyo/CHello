import React, { useEffect, useState } from "react";
import { KanbanCardComponent } from "../cards/KanbanCardComponent";
import { VscAdd } from "react-icons/vsc";
import { updateTitleList } from "../../../controller/KanbanController";

export const KanbanListComponent = ({
  kanbans,
  board,
  addNewList,
  addNewCard,
  setIsModal,
  setCard,
  setKanban,
  listUpdater,
  setListUpdater,
  cardUpdater,
  setCardUpdater,
}) => {
  return (
    <div className="overflow">
      <form
        className="row g-2 mx-2 mt-5 p-1"
        onSubmit={(e) => {
          addNewList(e).then(() => {
            setListUpdater(listUpdater + 1);
          });
        }}
      >
        <input type="hidden" name="boardId" id="boardId" value={board.uid} />
        {/* <input type="hidden" name="userId" id="userId" value={sessionUser}/> */}
        <div className="col-auto">
          <input
            required
            type="text"
            className="form-control"
            name="listTitle"
            id="listTitle"
            placeholder="Add New List"
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-primary mb-3 px-2 py-1">
            <VscAdd />
          </button>
        </div>
      </form>
      <div className="d-flex">
        {kanbans == null || kanbans.length === 0 ? (
          <h5 className="fs-2 fw-bold">
            No Lists created yet. Why don't you go ahead and create one?
          </h5>
        ) : (
          kanbans.map((k) => (
            <div
              className="card card-border-primary mx-3"
              style={{ flex: "0 0 20rem" }}
              key={k.uid}
            >
              <div className="card-header">
                <input
                  type="text"
                  className="card-title p-2"
                  style={{ border: "none", borderBottom: "1px solid black" }}
                  defaultValue={k.title}
                  onKeyDown = {(e) => {
                    if (e.key == "Enter") {
                      updateTitleList(e.target.value.trim(), k.uid, board.uid)
                    }
                  }}
                />
              </div>
              <div className="card-body p-3">
                <KanbanCardComponent
                  kanban={k}
                  board={board}
                  setIsModal={setIsModal}
                  setCard={setCard}
                  setKanban={setKanban}
                  cardUpdater={cardUpdater}
                />
              </div>
              <form
                className="row g-2 mx-2 mt-5 p-1"
                onSubmit={(e) =>
                  addNewCard(e).then(() => {
                    setListUpdater(listUpdater + 1);
                    // setCardUpdater(cardUpdater + 1)
                  })
                }
              >
                <input
                  type="hidden"
                  name="boardId"
                  id="boardId"
                  value={board.uid}
                />
                <input type="hidden" name="listId" id="listId" value={k.uid} />
                <div className="col-auto">
                  <input
                    required
                    type="text"
                    className="form-control"
                    name="cardTitle"
                    id="cardTitle"
                    placeholder="Add Card"
                  />
                </div>
                <div className="col-auto">
                  <button type="submit" className="btn btn-info mb-3 px-2 py-1">
                    <VscAdd />
                  </button>
                </div>
              </form>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
