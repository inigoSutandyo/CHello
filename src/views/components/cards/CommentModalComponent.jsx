import React, { useEffect } from 'react'
import { useState } from 'react'
import { useCardComment } from '../../../controller/CardController'
import { CommentListComponent } from './CommentListComponent'
import { FaArrowLeft } from "react-icons/fa";
export const CommentModalComponent = ({
  card,
  boardId,
  setModalTitle
}) => {
  const [commentUpdater, setCommentUpdater] = useState(0)
  const comments = useCardComment(card.uid, boardId)

  useEffect(() => {
    setCommentUpdater(commentUpdater+1)
  }, [card])

  return (
    <>
        <div className='mb-3'  onClick={()=>{
            setModalTitle("Card")
        }}>
            <FaArrowLeft/>
        </div>
        <div className='d-flex flex-column'>
            {!comments || comments.length === 0 ? <div>No Comments found</div> : (
                <CommentListComponent comments={Array.from(comments)} commentUpdater={commentUpdater} setCommentUpdater={setCommentUpdater}/>
            )}
        </div>
    </>
  )
}
