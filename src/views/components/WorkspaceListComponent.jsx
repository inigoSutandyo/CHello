import { VscAdd } from "react-icons/vsc";
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom' 
export const WorkspaceListComponent = ({workspaces}) => {
  const [idToBeDeleted, setIdToBeDeleted] = useState(null)
  let navigate = useNavigate()
  return (
    <>
    <div className='mx-2 mt-5 d-flex flex-wrap'>
        {workspaces.map(b=>
            <div className="card" key={b} style={{maxWidth: "20%"}}>
                <div className="card-body d-flex flex-column">
                    <h4 className="card-title mb-3 text-wrap">{b.name}</h4>
                    {/* <p className="card-text">Date Created : {b.date}</p> */}
                    <Link to={`/workspace/${b.uid}`}>
                        <p className="btn btn-primary">
                            Open Workspace
                        </p>
                    </Link>
                    
                </div>
            </div>
        )}
        {workspaces.length === 0 ? 
            <h1 className='text-gray-700'>
                No Workspace created yet. Why don't you go ahead and create one?
            </h1> : null}
    </div>
    <div className="row g-2 mx-2 mt-5 p-1">
        <div className="col-auto">
            <input type="text" className="form-control" id="newboard" placeholder="New Workspace"/>
        </div>
        <div className="col-auto">
            <button type="submit" className="btn btn-primary mb-3 px-2 py-1">
                <VscAdd/>
            </button>
        </div>
    </div>
    </>
  )
}