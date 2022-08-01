import React from 'react'

export const ErrorComponent = (props) => {
  return (
    <>
      <div className="alert alert-danger m-5" role="alert">
          {props.msg}
      </div>
    </>
  )
}
