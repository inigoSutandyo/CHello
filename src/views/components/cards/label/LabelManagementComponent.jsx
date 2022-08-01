import React from 'react'
import { FaWindowClose } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib'
import { deleteLabel, updateLabel, useLabels } from '../../../../controller/CardController'

export const LabelManagementComponent = ({
  labels,
  boardId,
  initiateUpdateLabel,
  initiateUpdateCard
}) => {

  return (
    <div>
        {!labels || labels.length === 0 ? <></> : (
          <div>

            {labels?.map(l => (
                <div>
                  <div key={l.uid} className="m-3 d-flex flex-row align-items-center justify-content-between w-75">
                      <div className='w-50 me-1 d-flex align-items-center justify-content-evenly'>
                        <input
                          type="text"
                          className="form-control me-2"
                          style={{ borderRadius: "10px" }}
                          defaultValue={l.name}
                          id="name"
                        />
                        <input type="color" id='color' defaultValue={l.color}/>
                      </div>
                      <div className='d-flex'>
                        <button className='btn btn-outline-dark me-2' onClick={() => {
                          const name = document.getElementById("name").value.trim()
                          const color = document.getElementById('color').value
                          updateLabel(l.uid, boardId, name, color).then(() => {
                              initiateUpdateLabel()
                              initiateUpdateCard()
                          })
                        }}>
                          Save Changes
                        </button>
                        <IconContext.Provider
                          value={{ color: 'red', size: '20px' }}
                          className="me-2"
                        >
                          <FaWindowClose style={{
                            cursor: "pointer"
                          }} onClick = {() => {
                            deleteLabel(l.uid, boardId).then(() => {
                              initiateUpdateLabel()
                              initiateUpdateCard()
                            })
                          }}/>
                        </IconContext.Provider>
                      </div>
                  </div>
                  <hr
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
            ))}
          </div>
        )}
    </div>
  )
}
