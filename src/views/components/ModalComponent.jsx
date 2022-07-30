import { Dialog } from "@reach/dialog";
import { FaWindowClose } from "react-icons/fa";
import React from 'react'
import Modal from "react-modal";

export const ModalComponent = ({isModal, setIsModal, text, children, appElement}) => {
  Modal.setAppElement(appElement)
  return (
    <Modal
      isOpen={isModal}
      contentLabel={text}
      onRequestClose={() => {setIsModal(false)}}
      // className="Modal"
      // overlayClassName="Overlay"
      ariaHideApp={false}
      style ={{overlay: {zIndex: 1000}}}
    >
      {/* <Dialog className='z-20 fade-in'> */}
        <div className="d-flex justify-content-between">
          <div>
            <h3>{text}</h3>
          </div>
          <div className='d-flex justify-content-end'>
              <div onClick={()=>setIsModal(false)} >
                  <div className='btn btn-danger'>
                      <FaWindowClose />
                  </div>
              </div>
          </div>
        </div>
        {children}
      {/* </Dialog> */}
    </Modal>
  )
}
