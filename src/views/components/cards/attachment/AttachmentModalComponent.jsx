import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { DropComponent } from "./DropComponent";
import { LinkAttachment } from "./LinkAttachment";

export const AttachmentModalComponent = ({
  card,
  boardId,
  setModalTitle,
  initiateUpdateCard
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
        card={card}
        boardId={boardId}
        initiateUpdateCard={initiateUpdateCard}
      />
      <LinkAttachment card={card} boardId={boardId} initiateUpdateCard={initiateUpdateCard}/>
    </div>
  );
};
