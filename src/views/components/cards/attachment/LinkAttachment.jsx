import React from 'react'
import { FaWindowClose } from 'react-icons/fa';
import { IconContext } from 'react-icons/lib';
import { addLink, detachLink } from '../../../../controller/CardController';

export const LinkAttachment = ({card, boardId, initiateUpdateCard}) => {

    function isValidHttpUrl(string) {
        let url;
        
        try {
            url = new URL(string);
        } catch (_) {
            return false;  
        }
        
        return url.protocol === "http:" || url.protocol === "https:";
    }

    

    return (
    <div className='mt-3'>
        <h5>Links</h5>
        <div className='mb-3'>
            {card.links && card.links !== 0 ? (
                card.links.map((l,i) => (
                    <div key={i} className="mb-1 d-flex justify-content-between">
                        <a href={l} target="_blank" rel="noopener noreferrer">
                            {l}
                        </a>
                        <div>
                            <IconContext.Provider
                                value={{ color: 'red', size: '20px' }}
                            >
                                <FaWindowClose style={{
                                    cursor: "pointer"
                                }} onClick={() => {
                                    detachLink(l, card.uid, boardId).then(() => {
                                        initiateUpdateCard()
                                    })
                                }}/>
                            </IconContext.Provider>
                        </div>
                    </div>
                ))
            ) : <p>No Links</p>}
        </div>
        <div className='d-flex w-50'>
            <input type="text" className="form-control me-2" id="link" />
            <button className='btn btn-primary' onClick={() => {
                const text = document.getElementById("link").value.trim()
                document.getElementById("link").value = ""
                if (!text || !isValidHttpUrl(text)) return
                addLink(text, card.uid, boardId).then(initiateUpdateCard())
            }}>Add</button>
        </div>
    </div>
  )
}
