import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBoards } from '../../../controller/BoardController'
import { useWorkspaceById } from '../../../controller/WorkspaceController'
import { BoardListComponent } from '../../components/BoardListComponent'
import { LoadingComponent } from '../../components/LoadingComponent'

export const BoardPage = ({userId}) => {
  const {workspaceId} = useParams()
  const [sessionUser, setSessionUser] = useState(userId)
  useEffect(() => {
    setSessionUser(userId)
  }, [userId])

  const boards = useBoards(sessionUser, workspaceId)
  const workspace = useWorkspaceById(workspaceId)
  return (
    <>
      {boards != null && workspace != null && sessionUser!=null ? (
        <div className='m-3'> 
            <div className='fs-3'>
              <p color='text-primary'>{workspace.name}</p> 
              Boards
            </div>
            <BoardListComponent boards={boards}/>
        </div>
        
      ) : (
        <LoadingComponent/>
      )}
      
    </>
  )
}
