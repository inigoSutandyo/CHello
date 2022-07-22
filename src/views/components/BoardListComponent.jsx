import { VscAdd } from "react-icons/vsc";
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom' 
import {FaTrashAlt} from 'react-icons/fa'
import { LoadingComponent } from "./LoadingComponent";


export const BoardListComponent = ({boards, sessionUser, workSpaceId, addNewBoard, deleteBoard, updater, setUpdater}) => {

  return (
    <>
        <div className='mx-2 mt-5 d-flex flex-wrap'>
            {boards.length === 0 ? 
                <h1 className='fs-2 fw-bold'>
                    No Boards created yet. Why don't you go ahead and create one?
                </h1> : (
                    boards.map(b=>
                        <div className="card me-5 mb-3 text-bg-dark p-3" key={b.uid} style={{width: "20%"}}>
                            <div className="card-body d-flex flex-column">
                                <h4 className="card-title mb-3 text-wrap">{b.title}</h4>
                                {/* <p className="card-text">Date Created : {b.date}</p> */}
                                <div className="d-flex flex-row justify-content-between">
                                    <Link to={`/board/${b.uid}`}>
                                        <p className="btn btn-primary">
                                            Open
                                        </p>
                                    </Link>
                                    <a className="btn text-danger fs-4" onClick={ () => {
                                        deleteBoard(b.uid, workSpaceId).then(()=>{
                                            setUpdater(updater+1)
                                        })
                                    }}>
                                        <FaTrashAlt/>
                                    </a>
                                </div>
                            </div>
                        </div>
                    )
                )}
        </div>
        <form className="row g-2 mx-2 mt-5 p-1" onSubmit={(e)=> {
                addNewBoard(e).then(()=>{
                    console.log("update!")
                    setUpdater(updater+1)
                    console.log(updater)
                })
            }}>
            <input type="hidden" name="workSpaceId" id="workSpaceId" value={workSpaceId}/>
            <input type="hidden" name="userId" id="userId" value={sessionUser}/>
            <div className="col-auto">
                <input required type="text" className="form-control" name="boardTitle" id="boardTitle" placeholder="Add Board"/>
            </div>
            <div className="col-auto">
                <button type="submit" className="btn btn-primary mb-3 px-2 py-1">
                    <VscAdd/>
                </button>
            </div>
        </form>
    </>
  )
}
