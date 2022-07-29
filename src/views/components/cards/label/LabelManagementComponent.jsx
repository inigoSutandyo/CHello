import React from 'react'
import { FaWindowClose } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib'
import { deleteLabel, useLabels } from '../../../../controller/CardController'

export const LabelManagementComponent = ({
  card,
  boardId,
  setModalTitle,
  cardUpdater,
}) => {
  const labels = useLabels(boardId, cardUpdater)
  return (
    <div>
        {!labels || labels.length === 0 ? <></> : (
            labels?.map(l => (
                <div key={l.uid} className="m-3 d-flex flex-row align-items-center">
                    <div className='badge rounded-pill me-3' style={{
                        backgroundColor: `${l.color}`
                    }}>{l.name}</div>
                    <div>
                    <IconContext.Provider
                      value={{ color: 'red', size: '20px' }}
                    >
                      <FaWindowClose style={{
                        cursor: "pointer"
                      }} onClick = {() => {
                        deleteLabel(l.uid, boardId, card).then(() => {
                            console.log("done")
                        })
                      }}/>
                    </IconContext.Provider>
                    </div>
                </div>
            ))
        )}
    </div>
  )
}
