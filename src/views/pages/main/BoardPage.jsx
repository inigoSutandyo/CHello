import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBoards } from '../../../controller/BoardController'
import { useWorkspaceById } from '../../../controller/WorkspaceController'
import { BoardListComponent } from '../../components/BoardListComponent'

export const BoardPage = ({userId}) => {
  const {workspaceId} = useParams()
  const [sessionUser, setSessionUser] = useState(userId)
  useEffect(() => {
    setSessionUser(userId)
  }, [userId])

  const boards = useBoards(sessionUser, workspaceId)

  return (
    <>
      {boards != null  ? (
        <div className='m-3'>
            {/* <h3>{workspace.name}</h3> */}
            <h4>Boards</h4>
            <BoardListComponent boards={boards}/>
        </div>
        
      ) : (
        <div className="spinner">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      )}
      
    </>
  )
}
