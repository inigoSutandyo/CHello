import React from 'react'

export const BoardDetailComponent = ({isOpen}) => {
  return (
    <div className='m-3 d-flex flex-column'>
        {isOpen ? (
            <>
                <div className='d-flex mb-3'>
                    <button className='btn btn-warning mx-2'>Close</button>
                    <button className='btn btn-danger mx-2'>Delete</button>
                </div>
                <div className='d-flex flex-column'>
                    <label htmlFor="" className='mb-1'>Move Board</label>
                    <select id='workspace' className='form-control'>
                        <option value="id">Workspace 1</option>
                    </select>
                </div>
            </>
        ) : (
            <div className='d-flex flex-column'>
                <label htmlFor="" className='mb-1'>Reopen Board</label>
                <select id='workspace' className='form-control'>
                    <option value="id">Workspace 1</option>
                </select>
            </div>
        )}
    </div>
  )
}
