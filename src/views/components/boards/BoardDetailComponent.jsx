import React from 'react'
import { closeBoard, deleteBoard, moveBoard, openBoard } from '../../../controller/BoardController'
import { useBoardWorkspace, useWorkspaceList } from '../../../controller/WorkspaceController'
import { LoadingComponent } from '../LoadingComponent'

export const BoardDetailComponent = ({isOpen, boardId, handleUpdateWorkspace, setIsModal}) => {
  const workspaces = useWorkspaceList()
  const currWorkspace = useBoardWorkspace(boardId)
//   console.log(currWorkspace)
  return (
    <>
        <div className='m-3 d-flex flex-column'>
            {isOpen ? (
                currWorkspace ? (
                    <>
                    
                        <div className='d-flex mb-3'>
                            <button className='btn btn-warning mx-2' onClick={() => {
                                closeBoard(boardId, currWorkspace.uid).then(() => {
                                    handleUpdateWorkspace()
                                    setIsModal(false)
                                })
                            }}>Close</button>
                            <button className='btn btn-danger mx-2' onClick={() => {
                                deleteBoard(boardId, currWorkspace.uid).then(() => {
                                    handleUpdateWorkspace()
                                    setIsModal(false)
                                })
                            }}>Delete</button>
                        </div>
                        {workspaces ? (
                            <div className='d-flex flex-column'>
                                <label htmlFor="" className='mb-1'>Move Board</label>
                                <input type="hidden" id="hidden" value={currWorkspace.uid} />
                                <select id='workspace' className='form-control mb-3' defaultValue={currWorkspace.uid}>
                                    {workspaces.map(w => 
                                        <option key={w.uid} value={w.uid}>{w.name}</option>
                                    )}
                                </select>
                                <div className='d-flex justify-content-center'>
                                    <button className='btn btn-primary' onClick={() => {
                                        const to = document.getElementById('workspace').value
                                        const from = document.getElementById('hidden').value
                                        moveBoard(boardId, from, to).then(() => {
                                            handleUpdateWorkspace()
                                        })
                                        // console.log("move to " + to + " from " + from)
                                    }}>Move</button>
                                </div>
                            </div>

                        ) : <div> Loading </div>}
                    </>
                ) : <LoadingComponent/>
            ) : (
                workspaces ? (
                    <>
                        <div className='mb-2'> 
                            <button className='btn btn-danger' onClick={() => {
                                deleteBoard(boardId, null).then(() => {
                                    handleUpdateWorkspace()
                                    setIsModal(false)
                                })
                            }}>Delete</button>
                        </div>
                        <div className='d-flex flex-column'>
                            <label htmlFor="" className='mb-1'>Reopen Board</label>
                            <select id='workspace' className='form-control mb-3'>
                                {workspaces.map(w => 
                                    <option key={w.uid} value={w.uid}>{w.name}</option>
                                )}
                            </select>
                            <div className='d-flex justify-content-center'>
                                <button className='btn btn-primary' onClick={() => {
                                    const to = document.getElementById('workspace').value
                                    openBoard(boardId, to).then(() => {
                                        handleUpdateWorkspace()
                                        setIsModal(false)
                                    })
                                }}>Reopen</button>
                            </div>
                        </div>
                    </>

                ) : <div>Loading</div>
            )}
        </div>
    </>
  )
}
