import React from 'react'
import { useCardLabel } from '../../../../controller/CardController'
import { LabelComponent } from './LabelOptionComponent'


export const CardLabelComponent = ({labels, card}) => {
  const label = useCardLabel(labels, card)
  return (
    <div className='mb-1'>
        {!label || label.uid == "-1" ? <div></div> : (
            <span className='badge rounded-pill' style={{
              backgroundColor: `${label.color}`
          }}>{label.name}</span>
        )}
    </div>
  )
}
