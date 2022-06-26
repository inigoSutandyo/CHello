import React from 'react'
import { KanbanCardComponent } from './KanbanCardComponent'
import { VscAdd } from "react-icons/vsc";

export const KanbanListComponent = ({kanbans}) => {
  return (
    <>
        <form className="row g-2 mx-2 mt-5 p-1">
            {/* <input type="hidden" name="boardId" id="boardId" value={workSpaceId}/>
            <input type="hidden" name="userId" id="userId" value={sessionUser}/> */}
            <div className="col-auto">
                <input required type="text" className="form-control" name="listTitle" id="listTitle" placeholder="Add New List"/>
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary mb-3 px-2 py-1">
                    <VscAdd/>
                </button>
            </div>
        </form>
        <div className='mx-2 mt-5 d-flex flex-wrap'>
            {kanbans.length === 0 ? 
                <h5 className='fs-2 fw-bold'>
                    No Lists created yet. Why don't you go ahead and create one?
                </h5> : (
                    (kanbans.map(k => 
                        <div className="card card-border-primary" style={{width: "20%"}} key={k.uid}>
                            <div className="card-header">
                                <h4 className="card-title">{k.title}</h4>
                                <h5 className="card-subtitle text-muted">Description here</h5>
                            </div>
                            <div className="card-body p-3">
                                <KanbanCardComponent kanban={k}/>
                            </div>
                            <form className="row g-2 mx-2 mt-5 p-1">

                                <div className="col-auto">
                                    <input required type="text" className="form-control" name="listTitle" id="listTitle" placeholder="Add Card"/>
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
