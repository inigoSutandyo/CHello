import React, { useEffect, useState } from 'react'
import { addLabel } from '../../../controller/CardController';
import { ErrorComponent } from '../ErrorComponent';
import { LoadingComponent } from '../LoadingComponent';

export const LabelModalComponent = ({card, boardId, setModalTitle}) => {

  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsError(errorMsg === "" ? false : true)
  }, [errorMsg])

  return (
    <>
        {isLoading != true ? (
            <form onSubmit={(e) => {
            setIsLoading(true)
            // const lblname = document.getElementById('label-name').value
            addLabel(e).then((msg) => {
                setIsLoading(false)
                setErrorMsg(msg)
                if (msg == "") {
                    setModalTitle("Card")
                } else {
                    setIsError(true)
                }
            })
            }}>
            <input type="hidden" name="boardId" id='boardId' value={boardId}/>
            <input type="hidden" name="cardId" id='cardId' value={card.uid}/>
    
            <div className='mb-3 d-flex flex-column'>
                <label htmlFor="color">Choose Color</label>
                <input type="color" id="color" name="color"/>
            </div>
            
            <div className='mb-3 d-flex flex-column'>
                <label>Label Name</label>
                <input type="text" id="labelName" name='labelName' className='form-control'/>
            </div>
            
            <div className='mb-3'>
                <input type="submit" className='btn btn-primary' value="Submit" />
            </div>
    
            {isError && <ErrorComponent msg={errorMsg}/>}
        </form>

        ) : <LoadingComponent/>}
    </>
  )
}
