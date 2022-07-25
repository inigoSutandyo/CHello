import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { VscAdd } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import { useBoardById } from "../../../controller/BoardController";
import { addNewCard } from "../../../controller/CardController";
import {
  addNewList,
  getKanban,
  useKanban,
} from "../../../controller/KanbanController";
import { CardModalComponent } from "../../components/cards/CardModalComponent";
import { CommentModalComponent } from "../../components/cards/CommentModalComponent";
import { KanbanListComponent } from "../../components/lists/KanbanListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";

export const KanbanPage = ({ userId }) => {
  const { boardId } = useParams();

  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("")
  const [card, setCard] = useState({});
  const [kanban, setKanban] = useState({});
  const [listUpdater, setListUpdater] = useState(0);
  const [cardUpdater, setCardUpdater] = useState(0);

  const board = useBoardById(boardId);
  const kanbans = useKanban(board, listUpdater);

  useEffect(() => {
    setCardUpdater(cardUpdater + 1);
  }, [kanbans]);

  useEffect(() => {
    setListUpdater(listUpdater + 1);
  }, [board]);



  const onDragEnd = (result) => {
    console.log(result)
  }

  return (
    <div id="kanban-page">
      {kanbans == null || board == null ? (
        <LoadingComponent />
      ) : (
        <div className="m-3">
          <h3>Board {board.title}</h3>
          <ModalComponent
            isModal={isModal}
            setIsModal={setIsModal}
            text={modalTitle}
            appELement={"#kanban-page"}
          >
            {modalTitle == "Card" ? 
              <CardModalComponent
                card={card}
                kanbanId={kanban.uid}
                boardId={boardId}
                cardUpdater={cardUpdater}
                setCardUpdater={setCardUpdater}
                userId = {userId}
                setModalTitle = {setModalTitle}
              />
              : modalTitle == "Comments" ?
              <CommentModalComponent card={card} boardId={boardId} setModalTitle={setModalTitle}/>
              : <div></div>
            }
          </ModalComponent>

          <div>
            <form
              className="row g-2 mx-2 mt-5 p-1"
              onSubmit={(e) => {
                addNewList(e).then(() => {
                  setListUpdater(listUpdater + 1);
                });
              }}
            >
              <input type="hidden" name="boardId" id="boardId" value={board.uid} />

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
              {kanbans.length === 0 ?  
                <h5 className="fs-2 fw-bold">
                  No Lists created yet. Why don't you go ahead and create one?
                </h5> : (
                  
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId='allCols' type='column' direction='horizontal'>
                        {provided=>
                          <div {...provided.droppableProps} ref={provided.innerRef} className="overflow d-flex">
                            {kanbans.map((k, i) => 
                              <KanbanListComponent
                                key={k.uid}
                                kanban={k}
                                board={board}
                                addNewCard={addNewCard}
                                setIsModal={setIsModal}
                                setModalTitle={setModalTitle}
                                setCard={setCard}
                                setKanban={setKanban}
                                listUpdater={listUpdater}
                                setListUpdater={setListUpdater}
                                cardUpdater={cardUpdater}
                                setCardUpdater={setCardUpdater}
                                index={i}
                              />
                            )}
                            {provided.placeholder}
                          </div>
                        }
                      </Droppable>
                    </DragDropContext>
                  
                )
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
