import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { VscAdd } from "react-icons/vsc";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  changeMembershipBoard,
  changeVisibilityBoard,
  joinBoard,
  removeBoardUser,
  useBoardById,
} from "../../../controller/BoardController";
import { addNewCard, useLabels } from "../../../controller/CardController";
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
import { Filter } from "../../components/Filter";
import { KanbanListComponent } from "../../components/lists/KanbanListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";
import { SearchBar } from "../../components/SearchBar";

export const KanbanPage = ({ userId }) => {
  const { boardId } = useParams();

  const [isModal, setIsModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [card, setCard] = useState({});
  const [kanban, setKanban] = useState({});
  const [listUpdater, setListUpdater] = useState(0);
  const [cardUpdater, setCardUpdater] = useState(0);
  const [boardUpdater, setBoardUpdater] = useState(0);
  const [labelUpdater, setLabelUpdater] = useState(0)
  const [position, setPosition] = useState({destination: 0, source:0})

  const [searchList, setSearchList] = useState("")
  const [searchCard, setSearchCard] = useState("")
  const [filterLabel, setFilterLabel] = useState([])

  const board = useBoardById(boardId, userId, boardUpdater);
  const kanbans = useKanban(board, listUpdater, searchList, position);
  const labels = useLabels(boardId, labelUpdater)

  useEffect(() => {
    setCardUpdater(cardUpdater + 1);
  }, [kanbans]);

  useEffect(() => {
    setListUpdater(listUpdater + 1);
  }, [board]);

  const onDragEnd = (result) => {
    const {destination, source, draggableId} = result
    // console.log(destination, source, result.type)
    if(!destination) return
    if (result.type === "list") {
      if (destination.index === source.index) return
      setPosition({
        destination: destination.index,
        source: source.index
      })
      // const newColumnOrder = Array.from(initialData.columnOrder)
      // newColumnOrder.splice(source.index, 1)
      // newColumnOrder.splice(destination.index, 0, draggableId)
      // setInitialData({...initialData, columnOrder: newColumnOrder})
      // db.collection(`users/${userId}/boards/${boardId}/columns`)
      //     .doc('columnOrder')
      //     .update({order: newColumnOrder})
    }
  };

  // const getItemStyle = (isDragging, draggableStyle) => ({
  //   // some basic styles to make the items look a bit nicer
  //   userSelect: 'none',
  //   padding: grid * 2,
  //   margin: `0 ${grid}px 0 0`,
  
  //   // change background colour if dragging
  //   background: isDragging ? 'lightgreen' : 'grey',
  
  //   // styles we need to apply on draggables
  //   ...draggableStyle,
  // });
  
  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    display: 'flex',
    padding: 8,
    overflow: 'auto',
  });

  const navigate = useNavigate();

  const initiateUpdateBoard = () => {
    setBoardUpdater(boardUpdater + 1);
  }
  const initiateUpdateCard = () => {
    setCardUpdater(cardUpdater + 1);
  }

  const initiateUpdateLabel = () => {
    setLabelUpdater(labelUpdater+1)
  }

  const handleMembershipChange = (userId) => {
    changeMembershipBoard(boardId, userId).then(() => {
      console.log(userId);
      initiateUpdateBoard()
    });
  };

  const handleUserRemoval = (userId) => {
    removeBoardUser(boardId, userId).then(() => {
      console.log(userId);
      initiateUpdateBoard()
    });
  };

  const handleVisibility = (visibility) => {
    changeVisibilityBoard(boardId, visibility).then(
      initiateUpdateBoard()
    );
  }

  const handleFilterChange = (e) => {
    const labelId = e.target.value
    const flag = e.target.checked
    // console.log(labelId, flag)

    if (flag) {
      const arr = []
      filterLabel.forEach(id => {
        arr.push(id)
      });

      arr.push(labelId)
      setFilterLabel(arr)
    } else {
      const remove = filterLabel.filter((id) => {
        return id !== labelId
      })
      setFilterLabel(remove)
    }
    // console.log(filterLabel)
  }

  return (
    <div id="kanban-page">
      {kanbans === null || board === null || labels === null? (
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
                    className="btn btn-primary my-2"
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
                    joinBoard(boardId, userId).then(() => initiateUpdateBoard())
                  }}
                  >
                    Join Board
              </button>
            </div>
          )}

          <Link to={`/calendar/${board.uid}`} className="mb-2">
            <div className="btn btn-primary">Calendar View</div>
          </Link>
          <SearchBar setSearchOne={setSearchCard} setSearchTwo={setSearchList} termOne={"Card"} termTwo={"List"}/>
          <Filter labels={labels} handleFilterChange={handleFilterChange}/>
          <ModalComponent
            isModal={isModal}
            setIsModal={setIsModal}
            text={modalTitle}
            appELement={"#kanban-page"}
          >
            {modalTitle == "Card" ? (
              <CardModalComponent
                cardId={card.uid}
                setCard={setCard}
                cardUpdater={cardUpdater}
                boardId={boardId}
                labels={labels}
                initiateUpdateCard = {initiateUpdateCard}
                userId={userId}
                setModalTitle={setModalTitle}
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
                initiateUpdateLabel = {initiateUpdateLabel}
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
                  labels={labels}
                  boardId={boardId}
                  initiateUpdateLabel={initiateUpdateLabel}
                  initiateUpdateCard={initiateUpdateCard}
                />
              </div>
            )  : modalTitle === "Board Members" ? (
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
                    type="list"
                    direction="horizontal"
                  >
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
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
                            index={i}
                            searchCard={searchCard}
                            labels={labels}
                            filter={filterLabel}
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
