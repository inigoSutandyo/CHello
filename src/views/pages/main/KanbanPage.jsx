import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBoardById } from "../../../controller/BoardController";
import { addNewCard } from "../../../controller/CardController";
import {
  addNewList,
  getKanban,
  useKanban,
} from "../../../controller/KanbanController";
import { CardModalComponent } from "../../components/cards/CardModalComponent";
import { KanbanListComponent } from "../../components/lists/KanbanListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";

export const KanbanPage = ({ userId }) => {
  const { boardId } = useParams();

  const [sessionUser, setSessionUser] = useState(userId);
  const [isModal, setIsModal] = useState(false);
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

  useEffect(() => {
    setSessionUser(userId);
  }, [userId]);

  return (
    <div id="kanban-page">
      {/* {console.log(kanbans)} */}
      {kanbans == null || board == null ? (
        <LoadingComponent />
      ) : (
        <div className="m-3">
          <h3>Board {board.title}</h3>
          <ModalComponent
            isModal={isModal}
            setIsModal={setIsModal}
            text={"Card View"}
            appELement={"#kanban-page"}
          >
            <CardModalComponent
              card={card}
              kanbanId={kanban.uid}
              boardId={boardId}
              cardUpdater={cardUpdater}
              setCardUpdater={setCardUpdater}
            />
          </ModalComponent>

          <KanbanListComponent
            kanbans={kanbans}
            board={board}
            addNewList={addNewList}
            addNewCard={addNewCard}
            setIsModal={setIsModal}
            setCard={setCard}
            setKanban={setKanban}
            listUpdater={listUpdater}
            setListUpdater={setListUpdater}
            cardUpdater={cardUpdater}
            setCardUpdater={setCardUpdater}
          />
        </div>
      )}
    </div>
  );
};
