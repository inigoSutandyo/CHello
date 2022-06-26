import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBoardById } from '../../../controller/BoardController'
import { useKanban } from '../../../controller/KanbanController'
import { KanbanListComponent } from '../../components/KanbanListComponent'
import { LoadingComponent } from '../../components/LoadingComponent'

export const KanbanPage = ({userId}) => {
  const {boardId} = useParams()
  const [sessionUser, setSessionUser] = useState(userId)
  const board = useBoardById(boardId)  
  useEffect(() => {
    setSessionUser(userId)
  }, [userId])

  const kanbans = useKanban(board)
  return (
    <>
      {kanbans == null ? <LoadingComponent/> : (
        <div className='m-3'>
          <h3>{board.title}</h3>
          <h5>Lists</h5>
          <KanbanListComponent kanbans={kanbans}/>
        </div>
      )}
    </>
  )
}
