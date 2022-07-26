import React, { useEffect } from 'react'
import { FaWindowClose } from 'react-icons/fa'
import { IconContext } from 'react-icons/lib'
import { removeCheckList } from '../../../controller/CardController'

export const CheckListComponent = ({checklist, checkListHandler, removeCheckHandler, handleChange}) => {
  
  const styling = {
    backgroundColor: "#fff",
    backgroundClip: "border-box",
    border: "1px solid #e5e9f2",
    borderRadius: ".2rem",
    width: "30%",
  }

  return (
    <div>
      <div style={styling} className="mb-2 p-1">
        {!checklist ? <div>Fetching Checklists....</div> : (
            checklist.map((l, idx) => (
              <div className='d-flex justify-content-between mx-2' key={idx} >
                  <div>
                    <input type="checkbox" id={l.uid} className='mx-1' defaultChecked={l.isChecked} onChange = {() => {
                      const checked = document.getElementById(l.uid).checked
                      handleChange(l.uid, checked)
                    }}/>
                    <label htmlFor='box' >{l.content}</label>
                  </div>
                  <div style={{cursor: "pointer"}} onClick={()=>{removeCheckHandler(l.uid)}}>
                    <IconContext.Provider
                      value={{ color: 'red', size: '20px' }}
                    >
                      <FaWindowClose  />
                    </IconContext.Provider>
                  </div>
              </div>
            ))
        )}
      </div>
        <input
          type="text"
          className="form-control"
          id="checklist"
          placeholder="Add Check List"
          onKeyDown={checkListHandler}
        />
    </div>
  )
}
