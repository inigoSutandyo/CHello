import React from 'react'

export const LabelOptionComponent = ({label}) => {
  return (
    <option value={label.uid} style={{
        color: `${label.color}`
    }}>{label.name}</option>
  )
}
