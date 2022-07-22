import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBoardById } from "../../../controller/BoardController";
import { addNewCard } from "../../../controller/CardController";
import {
  addNewList,
  getKanban,
  useKanban,
} from "../../../controller/KanbanController";
import { CardModalComponent } from "../../components/CardModalComponent";
import { KanbanListComponent } from "../../components/KanbanListComponent";
import { LoadingComponent } from "../../components/LoadingComponent";
import { ModalComponent } from "../../components/ModalComponent";

export const KanbanPage = ({ userId }) => {
  const { boardId } = useParams();
  const board = useBoardById(boardId);
  const kanbans = useKanban(board);
  const [sessionUser, setSessionUser] = useState(userId);
  const [isModal, setIsModal] = useState(false);
  const [card, setCard] = useState(null);
  
  useEffect(() => {
    setSessionUser(userId);
  }, [userId]);

  return (
    <>
      {/* {console.log(kanbans)} */}
      {kanbans == null || board == null ? (
        <LoadingComponent />
      ) : (
        <div className="m-3">
          <h3>{board.title}</h3>
          <h5>Lists</h5>
          <KanbanListComponent
              kanbans={kanbans}
              board={board}
              addNewList={addNewList}
              addNewCard={addNewCard}
              setIsModal={setIsModal}
              setCard = {setCard}
          />
          <ModalComponent
              isModal={isModal}
              setIsModal={setIsModal}
              text={"Card View"}
            >
              <CardModalComponent card={card}/>
          </ModalComponent>
          {/* {!isModal ? (
            <KanbanListComponent
              kanbans={kanbans}
              board={board}
              addNewList={addNewList}
              addNewCard={addNewCard}
              setIsModal={setIsModal}
              setCard = {setCard}
            />
          ) : (
            <ModalComponent
              isModal={isModal}
              setIsModal={setIsModal}
              text={"Card View"}
            >
              <CardModalComponent card={card}/>
            </ModalComponent>
          )} */}
        </div>
      )}
    </>
  );
};
