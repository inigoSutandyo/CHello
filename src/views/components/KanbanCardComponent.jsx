import React from 'react'
import { useCards } from '../../controller/CardController'

export const KanbanCardComponent = ({kanban}) => {
  const cards = useCards(kanban)
  return (
    <div>
        {cards == null || cards.length === 0 ? <p>Empty</p> : (
            cards.map(c =>     
                <div className="card mb-3 bg-light" key={c.uid}>
                    <div className="card-body p-3">
                        <div className="float-right mr-n2 mb-2">
                            <label className="custom-control custom-checkbox">
                                <input type="checkbox" className="custom-control-input"/>
                                <span className="custom-control-label mx-2">Done</span>
                            </label>
                        </div>
                        <h6 className="card-title text-muted">{c.title}</h6>
                        <p className="text-muted">{c.description}</p>
                        
                        {/* <a class="btn btn-outline-primary btn-sm" href="#">View</a> */}
                    </div>
                </div>
            )
        )}
    </div>
  )
}
