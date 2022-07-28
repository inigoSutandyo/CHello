import React from 'react'
import { useWorkspaceList } from '../../../controller/WorkspaceController'

export const BoardDetailComponent = ({isOpen, currWorkspace}) => {
  const workspaces = useWorkspaceList()
  return (
    <div className='m-3 d-flex flex-column'>
        {isOpen ? (
            <>
                <div className='d-flex mb-3'>
                    <button className='btn btn-warning mx-2'>Close</button>
                    <button className='btn btn-danger mx-2'>Delete</button>
                </div>
                {workspaces ? (
                        <div className='d-flex flex-column'>
                            <label htmlFor="" className='mb-1'>Reopen Board</label>
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
                                    console.log("move to " + to + " from " + from)
                                }}>Move</button>
                            </div>
                        </div>

                    ) : <div>
                        Loading
                    </div>
                }
            </>
        ) : (
            workspaces ? (
                <div className='d-flex flex-column'>
                    <label htmlFor="" className='mb-1'>Reopen Board</label>
                    <select id='workspace' className='form-control'>
                        <option value="id">Workspace 1</option>
                    </select>
                </div>

            ) : <div>
                Loading
            </div>
        )}
    </div>
  )
}
