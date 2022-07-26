import React from 'react'
import { useState } from 'react'
import { useCards, useLabels } from '../../../controller/CardController'
import parse from "html-react-parser";
import { CardLabelComponent } from './CardLabelComponent';

export const KanbanCardComponent = ({kanban, board, setIsModal, setCard, setKanban, cardUpdater, setModalTitle}) => {
  const cards = useCards(kanban.uid, board, cardUpdater)
  const labels = useLabels(board.uid)
  

  return (
    <div>
        {cards == null || cards.length === 0 ? <p>Empty</p> : (
            cards.map(c =>     
                <div className="card mb-3 bg-light" key={c.uid}>
                    <div className="card-body p-3">
                        {/* <div className="float-right mr-n2 mb-2">
                            <label className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input"/>
                                <span className="custom-control-label mx-2">Done</span>
                            </label>
                        </div> */}
                        <h6 className="card-title text-muted">{c.title}</h6>
                        <CardLabelComponent card={c} labels={labels}/>
                        <div className="text-muted">{parse(c.description)}</div>
                        
                        <a className="btn btn-outline-primary btn-sm" onClick={()=>{
                            setIsModal(true)
                            setCard(c)
                            setKanban(kanban)
                            setModalTitle("Card")
                            // console.log(card)
                        }}>View</a>
                    </div>
                </div>
            )
            
        )}
    </div>
  )
}
