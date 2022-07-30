import React from "react";
import { useCards, useLabels } from "../../../controller/CardController";
import parse from "html-react-parser";
import { CardLabelComponent } from "./label/CardLabelComponent";

export const KanbanCardComponent = ({
  kanban,
  board,
  setIsModal,
  setCard,
  setKanban,
  cardUpdater,
  setModalTitle,
  searchCard,
  labels,
  filter
}) => {
  const cards = useCards(kanban.uid, board, cardUpdater, searchCard, filter);

  return (
    <div>
      {cards == null || cards.length === 0 ? (
        <p>Empty</p>
      ) : (
        cards.map((c) => (
          <div className="card mb-3 bg-light" key={c.uid}>
            <div className="card-body p-3">
              <h6 className="card-title text-muted">{c.title}</h6>
              <CardLabelComponent card={c} labels={labels} />
              <div className="text-muted">{parse(c.description)}</div>

              <a
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  setIsModal(true);
                  setCard(c);
                  setKanban(kanban);
                  setModalTitle("Card");
                }}
              >
                View
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
