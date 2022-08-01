import React, { useEffect, useState } from "react";
import { KanbanCardComponent } from "../cards/KanbanCardComponent";
import { VscAdd } from "react-icons/vsc";
import { deleteList, updateTitleList } from "../../../controller/KanbanController";
import { Draggable } from "react-beautiful-dnd";
import { IconContext } from "react-icons/lib";
import { FaWindowClose } from "react-icons/fa";

export const KanbanListComponent = ({
  kanban,
  board,
  addNewCard,
  setIsModal,
  setModalTitle,
  setCard,
  setKanban,
  listUpdater,
  setListUpdater,
  cardUpdater,
  index,
  searchCard,
  labels,
  filter
}) => {
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : 'white',

    ...draggableStyle,
  });
  return (
    <div>
     
      {kanban == null ? (
        <div></div>
      ) : (
        <Draggable draggableId={kanban.uid} index={index} key={kanban.uid}>
          {(provided, snapshot) => 
            <div
              {...provided.draggableProps} 
              ref={provided.innerRef}
              className="card card-border-primary mx-3"
              style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
            >
              <div {...provided.dragHandleProps}>
                <div className="card-header d-flex justify-content-between">
                  <input
                    type="text"
                    className="card-title p-2"
                    style={{ border: "none", borderBottom: "1px solid black" }}
                    defaultValue={kanban.title}
                    onKeyDown = {(e) => {
                      if (e.key == "Enter") {
                        updateTitleList(e.target.value.trim(), kanban.uid, board.uid)
                      }
                    }}
                  />
                  <IconContext.Provider value={{
                    color: "red",
                    size: "20px"
                  }}>
                    <FaWindowClose style={{cursor: "pointer"}} onClick = {() => {
                      deleteList(kanban.uid, board.uid).then(setListUpdater(listUpdater + 1))
                    }}/>
                  </IconContext.Provider>
                </div>
                <div className="card-body p-3">
                  <KanbanCardComponent
                    kanban={kanban}
                    board={board}
                    setIsModal={setIsModal}
                    setCard={setCard}
                    setKanban={setKanban}
                    cardUpdater={cardUpdater}
                    setModalTitle={setModalTitle}
                    searchCard={searchCard}
                    labels={labels}
                    filter={filter}
                  />
                </div>
                <form
                  className="row g-2 mx-2 mt-5 p-1"
                  onSubmit={(e) =>
                    addNewCard(e).then(() => {
                      setListUpdater(listUpdater + 1);
                    })
                  }
                >
                  <input
                    type="hidden"
                    name="boardId"
                    id="boardId"
                    value={board.uid}
                  />
                  <input type="hidden" name="listId" id="listId" value={kanban.uid} />
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
            </div>
          }
        </Draggable>
      )}
    </div>
  );
};
