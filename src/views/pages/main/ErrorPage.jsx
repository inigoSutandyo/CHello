import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export const ErrorPage = () => {
  const navigate = useNavigate()
  return (
    <div>
        <div
          className="m-2"
          onClick={() => {
            navigate(-1);
          }}
          style={{
            cursor: "pointer",
          }}
        >
          <FaArrowLeft />
        </div>
        <h1>ERROR PAGE NOT FOUND!</h1>
    </div>
  )
}
