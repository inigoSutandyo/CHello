import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { DropComponent } from "./DropComponent";

export const AttachmentModalComponent = ({
  card,
  boardId,
  setModalTitle,
  cardUpdater,
  setCardUpdater,
}) => {
  return (
    <div>
      <div
        className="mb-3"
        onClick={() => {
          setModalTitle("Card");
        }}
      >
        <FaArrowLeft />
      </div>
      <DropComponent
        cardId={card.uid}
        boardId={boardId}
        cardUpdater={cardUpdater}
        setCardUpdater={setCardUpdater}
      />
    </div>
  );
};
