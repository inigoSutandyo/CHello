import React from 'react'

export const CommentListComponent = ({comments, commentUpdater, setCommentUpdater}) => {
  
  return (
    <div>
        {comments.map((c)=> (
                <div className="card m-3 text-white bg-light" key={c.uid}>
                    <div className="card-body p-3">
                        <h6 className="card-title text-muted">{c.userEmail}</h6>
                        <p className="text-muted">{c.content}</p>
                    </div>
                </div>
            ))
        }
    </div>
  )
}
