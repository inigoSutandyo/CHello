import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FaArrowLeft } from "react-icons/fa";
import { VscAdd } from "react-icons/vsc";
import { useNavigate, useParams } from "react-router-dom";
import {
  changeMembershipBoard,
  changeVisibilityBoard,
  joinBoard,
  removeBoardUser,
  useBoardById,
} from "../../../controller/BoardController";
import { addNewCard } from "../../../controller/CardController";
import {
  addNewList,
  getKanban,
  useKanban,
} from "../../../controller/KanbanController";
import { BoardMembershipComponent } from "../../components/boards/BoardMembershipComponent";
import { ButtonGroup } from "../../components/ButtonGroup";
import { AttachmentModalComponent } from "../../components/cards/attachment/AttachmentModalComponent";
import { CardModalComponent } from "../../components/cards/CardModalComponent";
import { CommentModalComponent } from "../../components/cards/comment/CommentModalComponent";
import { LabelManagementComponent } from "../../components/cards/label/LabelManagementComponent";
import { LabelModalComponent } from "../../components/cards/label/LabelModalComponent";
import WatcherModalComponent from "../../components/cards/watchers/WatcherModalComponent";
import { KanbanListComponent } from "../../components/lists/KanbanListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";

export const KanbanPage = ({ userId }) => {
  const { boardId } = useParams();

  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [card, setCard] = useState({});
  const [kanban, setKanban] = useState({});
  const [listUpdater, setListUpdater] = useState(0);
  const [cardUpdater, setCardUpdater] = useState(0);
  const [boardUpdater, setBoardUpdater] = useState(0);

  const board = useBoardById(boardId, userId, boardUpdater);
  const kanbans = useKanban(board, listUpdater);

  useEffect(() => {
    setCardUpdater(cardUpdater + 1);
  }, [kanbans]);

  useEffect(() => {
    setListUpdater(listUpdater + 1);
  }, [board]);

  const onDragEnd = (result) => {
    console.log(result);
  };
  const navigate = useNavigate();

  const handleMembershipChange = (userId) => {
    changeMembershipBoard(boardId, userId).then(() => {
      console.log(userId);
      setBoardUpdater(boardUpdater + 1);
    });
  };

  const handleUserRemoval = (userId) => {
    removeBoardUser(boardId, userId).then(() => {
      console.log(userId);
      setBoardUpdater(boardUpdater + 1);
    });
  };

  const handleVisibility = (visibility) => {
    changeVisibilityBoard(boardId, visibility).then(
      setBoardUpdater(boardUpdater + 1)
    );
  }

  return (
    <div id="kanban-page">
      {kanbans == null || board == null ? (
        <LoadingComponent />
      ) : (
        <div className="m-3">
          <h3 className="fw-3">Board {board.title}</h3>
          <div className="d-flex justify-content-start">
            <div
              className="m-2"
              onClick={() => {
                navigate(-1);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <FaArrowLeft />
            </div>
          </div>
          {board.curr_membership !== "none" ? (
            <>
              <ButtonGroup
                board={board}
                currentUserId={userId}
                handleUserRemoval={handleUserRemoval}
                handleVisibility={handleVisibility}
                navigate={navigate}
                setIsModal={setIsModal}
                setModalTitle={setModalTitle}
              />
              {board.curr_membership === "admin" ? (
                <div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => {
                      setIsModal(true);
                      setModalTitle("Label Management");
                    }}
                  >
                    Manage Labels
                  </button>
                </div>
              ) : <></>}
            </>
          ) : (
            <div>
              <button
                  className="btn btn-primary"
                  onClick={() => {
                    joinBoard(boardId, userId).then(() => setBoardUpdater(boardUpdater + 1))
                  }}
                  >
                    Join Board
              </button>
            </div>
          )}

          <ModalComponent
            isModal={isModal}
            setIsModal={setIsModal}
            text={modalTitle}
            appELement={"#kanban-page"}
          >
            {modalTitle == "Card" ? (
              <CardModalComponent
                card={card}
                kanbanId={kanban.uid}
                boardId={boardId}
                cardUpdater={cardUpdater}
                setCardUpdater={setCardUpdater}
                userId={userId}
                setModalTitle={setModalTitle}
                listUpdater={listUpdater}
                setListUpdater={setListUpdater}
              />
            ) : modalTitle == "Comments" ? (
              <CommentModalComponent
                card={card}
                boardId={boardId}
                setModalTitle={setModalTitle}
              />
            ) : modalTitle == "Label" ? (
              <LabelModalComponent
                card={card}
                boardId={boardId}
                setModalTitle={setModalTitle}
              />
            ) : modalTitle == "Attachments" ? (
              <AttachmentModalComponent
                card={card}
                boardId={boardId}
                setModalTitle={setModalTitle}
                cardUpdater={cardUpdater}
                setCardUpdater={setCardUpdater}
              />
            ) : modalTitle === "Label Management" ? (
              <div>
                <LabelManagementComponent
                  card={card}
                  boardId={boardId}
                  setModalTitle={setModalTitle}
                  cardUpdater={cardUpdater}
                />
              </div>
            ) : modalTitle === "Watchers" ? (
              <WatcherModalComponent card={card} boardId={boardId} />
            ) : modalTitle === "Board Members" ? (
              <BoardMembershipComponent
                board={board}
                handleMembershipChange={handleMembershipChange}
                handleUserRemoval={handleUserRemoval}
                membership={board.curr_membership}
                userId={userId}
              />
            ) : (
              <></>
            )}
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
              <input
                type="hidden"
                name="boardId"
                id="boardId"
                value={board.uid}
              />

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
                <button
                  type="submit"
                  className="btn btn-primary mb-3 px-2 py-1"
                >
                  <VscAdd />
                </button>
              </div>
            </form>

            <div className="d-flex">
              {kanbans.length === 0 ? (
                <h5 className="fs-2 fw-bold">
                  No Lists created yet. Why don't you go ahead and create one?
                </h5>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId="allCols"
                    type="column"
                    direction="horizontal"
                  >
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="overflow d-flex"
                      >
                        {kanbans.map((k, i) => (
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
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
