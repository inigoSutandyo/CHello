import React from 'react'

export const Login = () => {
  return (
    <div className='m-5'>
        <div className="mb-3">
            <label for="exampleFormControlInput1" className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
        </div>
        <div className="mb-3">
            <label for="inputPassword" className="form-label">Password</label>
            <input type="password" className="form-control" id="password"/>
        </div>

        <div className='d-flex justify-content-center'>
            <button>Login</button>
        </div>
    </div>
  )
}
