import React, { useEffect } from 'react'
import { useState } from 'react'
import { useBoards } from '../../../controller/BoardController'
import { useWorkspace } from '../../../controller/WorkspaceController'
import { BoardListComponent } from '../../components/BoardListComponent'
import { LoadingComponent } from '../../components/LoadingComponent'
import { WorkspaceListComponent } from '../../components/WorkspaceListComponent'

export const WorkspacePage = ({userId}) => { 
  
  const [sessionUser, setSessionUser] = useState(null)

  useEffect(() => {
    setSessionUser(userId)
  }, [userId])
  
  const workspaces = useWorkspace(sessionUser)

  return (
    <>
      {workspaces == null || sessionUser == null ? (
        <LoadingComponent/>
      ) : <div className='m-3'>
            <h3>Workspace</h3>
            <WorkspaceListComponent workspaces={workspaces}/>
        </div>}
    </>
  )
}
