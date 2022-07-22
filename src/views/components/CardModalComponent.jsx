import React from 'react'

export const CardModalComponent = ({card}) => {
  console.log(card)
  return (
    <div className="m-3">
      <div className="form-floating mb-3">
        <input type="text" className="form-control" id="title" defaultValue={card.title}/>
        <label htmlFor="floatingInput">Title</label>
      </div>
      <div className="form-floating mb-3">
        <input type="text" className="form-control" id="description" defaultValue={card.description}/>
        <label htmlFor="floatingPassword">Description</label>
      </div>
      <div className='mb-3'>
        <label>Check List</label>
        <input type="text" className="form-control" id='checklist' placeholder='Check List'/>
      </div>
      <div className='mb-3'>
        <label>Due Date</label>
        <input type='datetime-local' className="form-control" name="" id="" />
      </div>
      <div className='mb-3'>
        <label>Reminder Date</label>
        <input type='datetime-local' className="form-control" name="" id="" />
      </div>
    </div>
  )
}
