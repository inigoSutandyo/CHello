import React, { useEffect, useState } from 'react'
import { KanbanCardComponent } from './KanbanCardComponent'
import { VscAdd } from "react-icons/vsc";

export const KanbanListComponent = ({kanbans, board, addNewList, addNewCard, setIsModal, setCard}) => {

  return (
    <>
        <form className="row g-2 mx-2 mt-5 p-1" onSubmit={addNewList}>
            <input type="hidden" name="boardId" id="boardId" value={board.uid}/>
            {/* <input type="hidden" name="userId" id="userId" value={sessionUser}/> */}
            <div className="col-auto">
                <input required type="text" className="form-control" name="listTitle" id="listTitle" placeholder="Add New List"/>
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary mb-3 px-2 py-1">
                    <VscAdd/>
                </button>
            </div>
        </form>
        <div className='mx-2 mt-5 d-flex'>
            {kanbans == null || kanbans.length === 0 ? 
                <h5 className='fs-2 fw-bold'>
                    No Lists created yet. Why don't you go ahead and create one?
                </h5> : (
                    
                    (kanbans.map(k => 
                        <div className="card card-border-primary mx-3" style={{width: "20 rem"}} key={k.uid}>
                            <div className="card-header">
                                <h4 className="card-title">{k.title}</h4>
                            </div>
                            <div className="card-body p-3">
                                <KanbanCardComponent kanban={k} board={board} setIsModal={setIsModal} setCard={setCard}/>
                            </div>
                            <form className="row g-2 mx-2 mt-5 p-1" onSubmit={addNewCard}>
                                <input type="hidden" name="boardId" id="boardId" value={board.uid}/>
                                <input type="hidden" name="listId" id="listId" value={k.uid}/>
                                <div className="col-auto">
                                    <input required type="text" className="form-control" name="cardTitle" id="cardTitle" placeholder="Add Card"/>
                                </div>
                                <div className="col-auto">
                                    <button type="submit" className="btn btn-info mb-3 px-2 py-1">
                                        <VscAdd/>
                                    </button>
                                </div>
                            </form>
                        </div>
                        )
                    )
                )
            }
        </div>
    </>
    
  )
}
