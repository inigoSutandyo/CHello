import { VscAdd } from "react-icons/vsc";
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconContext } from "react-icons/lib";
import { FaWindowClose } from "react-icons/fa";
import { deleteWorkspace } from "../../../controller/WorkspaceController";
 
export const WorkspaceListComponent = ({workspaces, addNewWorkSpace, sessionUser, updater, setUpdater, isMember}) => {
  
  return (
    <>
        <div className='mx-2 mt-5 d-flex flex-wrap'>
            {workspaces.map(b=>
                <div className="card text-bg-light p-3 me-5 mb-3" key={b.uid} style={{width: "20%"}}>
                    {b.membership === "admin" ? (
                        <div className="d-flex justify-content-end">
                            <div style={{cursor: "pointer"}} onClick={() => {
                                deleteWorkspace(b.uid).then(setUpdater(updater+1))
                            }}>
                                <IconContext.Provider
                                value={{ color: 'red', size: '20px' }}
                                >
                                    <FaWindowClose />
                                </IconContext.Provider>
                            </div>
                        </div>
                    ) : <></>}
                    <div className="card-body d-flex flex-column">
                        <h5 className="card-title mb-3 text-wrap">{b.name}</h5>
                        {/* <p className="card-text">Date Created : {b.datecreated}</p> */}
                        <Link to={`/workspace/${b.uid}`}>
                            <p className="btn btn-primary">
                                Open Workspace
                            </p>
                        </Link>
                        
                    </div>
                </div>
            )}
            {workspaces.length === 0 ? 
                <h4 className='text-gray-700'>
                    No Workspace created yet. Why don't you go ahead and create one?
                </h4> : null}
        </div>
        {isMember ? (
            <div>
                <form className="row g-2 mx-2 mt-5 p-1" onSubmit={(e) => {
                    addNewWorkSpace(e).then(() => {
                        setUpdater(updater+1);
                    })
                }}>
                    <input type="hidden" name="userId" value={sessionUser} />
                    <div className="col-auto">
                        <input type="text" className="form-control" id="workSpaceName" placeholder="New Workspace"/>
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-3 px-2 py-1">
                            <VscAdd/>
                        </button>
                    </div>
                </form>
            </div>

        ) : <div></div>}
    </>
  )
}
