import React from 'react'
import { useMembers, useWatchers } from '../../../../controller/CardController'

const WatcherModalComponent = ({boardId, card}) => {
  const members = useMembers(boardId)
  const watchers = useWatchers(card.uid, boardId)
  console.log(members)


  return (
    <div>
        {!members || members.length === 0 ? <p>No Members Yet</p> : (
            members.map(m => (
                <div className='d-flex flex-row' key={m.uid}>
                    <p>{m.email}</p>
                    <button>Add</button>
                </div>
                // watchers && watchers.indexOf(m) !== -1 ? (
                //     <div className='d-flex flex-row'>
                //         <p>{m.email}</p>
                //         <button>Remove</button>
                //     </div>
                // ) : (
                // )
            ) )
        )}
    </div>  
  )
}

export default WatcherModalComponent