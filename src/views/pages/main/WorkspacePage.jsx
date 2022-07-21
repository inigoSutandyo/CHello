import React, { useEffect } from 'react'
import { useState } from 'react'
import { addNewWorkspace, useWorkspace } from '../../../controller/WorkspaceController'
import { LoadingComponent } from '../../components/LoadingComponent'
import { ModalComponent } from '../../components/ModalComponent'
import { WorkspaceListComponent } from '../../components/WorkspaceListComponent'
import { WorkspaceMemberComponent } from '../../components/WorkspaceMemberComponent'

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
            <div>
              <h3>Workspace</h3>
            </div>
            <WorkspaceListComponent workspaces={workspaces} sessionUser={sessionUser} addNewWorkSpace={addNewWorkspace}/>
        </div>}
    </>
  )
}
