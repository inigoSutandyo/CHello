import React from 'react'
import { useState } from 'react'
import { useCards } from '../../controller/CardController'
import { CardModalComponent } from './CardModalComponent'
import { ModalComponent } from './ModalComponent'

export const KanbanCardComponent = ({kanban, board, setIsModal, setCard}) => {
  const cards = useCards(kanban, board)

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
                        <p className="text-muted">{c.description}</p>
                        
                        <a className="btn btn-outline-primary btn-sm" onClick={()=>{
                            setIsModal(true)
                            setCard(c)
                        }}>View</a>
                    </div>
                </div>
            )
            
        )}
    </div>
  )
}
