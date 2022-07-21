import { Dialog } from "@reach/dialog";
import { FaWindowClose } from "react-icons/fa";
import React from 'react'

export const ModalComponent = ({isModal, setIsModal, text, children}) => {
  return (
    <Dialog isOpen={isModal} onDismiss={()=>setIsModal(false)} aria-label={text} className='z-20 fade-in'>
        <div className='d-flex justify-content-end m-5'>
            <div onClick={()=>setIsModal(false)} >
                <div className='btn btn-danger'>
                    <FaWindowClose />
                </div>
            </div>
        </div>
        {children}
    </Dialog>
  )
}
