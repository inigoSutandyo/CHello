import React from "react";
import { useCards, useLabels } from "../../../controller/CardController";
import parse from "html-react-parser";
import { CardLabelComponent } from "./label/CardLabelComponent";
import { Draggable, Droppable } from "react-beautiful-dnd";

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
  filter,
}) => {
  const cards = useCards(kanban, board, cardUpdater, searchCard, filter);
  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightblue' : 'white',

    ...draggableStyle,
  });
  return (
    <div>
      {cards == null || cards.length === 0 ? (
        <p>Empty</p>
      ) : (
        <Droppable droppableId={kanban.uid} type="card">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {cards.map((c,i) => (
                <div key={c.uid}>
                    {/* {console.log(c.uid)} */}
                    <Draggable draggableId={c.uid} index={i} >
                      {(provided, snapshot) => (
                        <div 
                          {...provided.draggableProps} 
                          {...provided.dragHandleProps} 
                          ref={provided.innerRef}
                          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                        >
                          <div className="card mb-3 bg-light" >
                            <div className="card-body p-3">
                              <h6 className="card-title text-muted">{c.title}</h6>
                              <CardLabelComponent card={c} labels={labels} />
                              <div className="text-muted">
                                {parse(c.description)}
                              </div>
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
                        </div>
                      )}
                    </Draggable>
                  </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};
