import { Dialog } from "@reach/dialog";
import { FaWindowClose } from "react-icons/fa";
import React from 'react'
import Modal from "react-modal";

export const ModalComponent = ({isModal, setIsModal, text, children}) => {
  function handleCloseModal () {
    setIsModal(false)
  }
  return (
    <Modal
      isOpen={isModal}
      contentLabel={text}
      onRequestClose={handleCloseModal()}
      className="Modal"
      overlayClassName="Overlay"
      ariaHideApp={false}
    >
      {/* <Dialog className='z-20 fade-in'> */}
        <div className='d-flex justify-content-end m-5'>
            <div onClick={()=>setIsModal(false)} >
                <div className='btn btn-danger'>
                    <FaWindowClose />
                </div>
            </div>
        </div>
        {children}
      {/* </Dialog> */}
    </Modal>
  )
}
