import React, { useEffect } from 'react'
import { useState } from 'react'
import { useBoards } from '../../../controller/BoardController'
import { useWorkspace } from '../../../controller/WorkspaceController'
import { BoardListComponent } from '../../components/BoardListComponent'
import { WorkspaceListComponent } from '../../components/WorkspaceListComponent'

export const WorkspacePage = ({userId}) => { 
  
  const [sessionUser, setSessionUser] = useState(userId)
  // console.log(userId)
  useEffect(() => {
    setSessionUser(userId)
  }, [userId])
  
  const workspaces = useWorkspace(sessionUser)
  // if (sessionUser != null) {
    
  // }

  return (
    <>
      {workspaces == null ? (
        <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
      ) : <div className='m-3'>
            <h3>Workspace</h3>
            {/* <BoardListComponent boards={boards}/> */}
            <WorkspaceListComponent workspaces={workspaces}/>
        </div>}
    </>
  )
}
