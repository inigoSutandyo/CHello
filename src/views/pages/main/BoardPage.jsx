import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addNewBoard, deleteBoard, useBoards } from '../../../controller/BoardController'
import { useWorkspaceById } from '../../../controller/WorkspaceController'
import { BoardListComponent } from '../../components/BoardListComponent'
import { LoadingComponent } from '../../components/LoadingComponent'
import { ModalComponent } from '../../components/ModalComponent'
import { WorkspaceMemberComponent } from '../../components/WorkspaceMemberComponent'

export const BoardPage = ({userId}) => {
  const {workspaceId} = useParams()
  const [sessionUser, setSessionUser] = useState(userId)
  
  useEffect(() => {
    setSessionUser(userId)
  }, [userId])

  const workspace = useWorkspaceById(workspaceId)
  const boards = useBoards(sessionUser, workspace)
  const [isModal, setIsModal] = useState(false)
  
  // const [boardList, setBoardList] = useState(null)
 

  // useEffect(() => {
  //   setBoardList(boards)
  // }, [boards])
  
  return (
    <>
      {boards!=null && workspace != null && sessionUser!=null ? (
        <div className='m-3'> 
            <div className='fs-3'>
              <p color='text-primary'>{workspace.name}</p> 
              Boards
            </div>
            <button className='btn btn-info' onClick={()=>setIsModal(true)}>Members</button>
            {!isModal ? (
              <BoardListComponent boards={boards} sessionUser={sessionUser} workSpaceId={workspaceId} addNewBoard={(e) => {
                addNewBoard(e)
              }} deleteBoard={deleteBoard}/>
            ) : (
              <ModalComponent isModal={isModal} setIsModal={setIsModal} text={"Workspace Member"}>
                <WorkspaceMemberComponent workSpace={workspace} userId={userId}/>
              </ModalComponent>
            )}
        </div>
        
      ) : (
        <LoadingComponent/>
      )}
      
    </>
  )
}
