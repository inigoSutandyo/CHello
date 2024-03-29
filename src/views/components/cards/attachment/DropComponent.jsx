import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaFileAlt, FaFileDownload, FaWindowClose } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { addFiles, detachFile, donwloadFile, useFiles } from "../../../../controller/CardController";
import { LoadingComponent } from "../../LoadingComponent";

export const DropComponent = ({card, boardId, initiateUpdateCard}) => {
  
  const [loading, setLoading] = useState(false)
  const [updater, setUpdater] = useState(0)
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxSize: 5000000,
    maxFiles: 3,
    onDropAccepted: function () {  
        if (!acceptedFiles) {
            console.log("no file")
            return
        }

        if (acceptedFiles.length > 0) {
            setLoading(true)
            addFiles(card.uid, boardId, acceptedFiles).then(() => {
                console.log("upload finished")
                setLoading(false)
                initiateUpdateCard()
            })
        }
    }
  });

  useEffect(() => {
    setUpdater(updater+1)
  }, [card])
  
  const files = useFiles(card, boardId, updater)
//   console.log(files)
  return (
    <>
        {!loading ? (
            <>
                <div className="container">
                    <div
                        {...getRootProps()}
                        className="bg-light py-5 border-secondary rounded-4 d-flex flex-column justify-content-center align-items-center"
                        style={{
                        cursor: "pointer",
                        }}
                    >
                        <input {...getInputProps()} />
                        <p className="fw-light fs-3">
                            Drag and drop some files here, or click to select files
                        </p>
                        <p className="fw-lighter fs-5">Maximum (5 mb) and 3 files at a time</p>
                    </div>
                </div>
                <div>
                    <h4>Files</h4>
                    {files?.map((file, i) => (
                        // {console.log(file.filename)}
                        <div key={i} className="d-flex flex-row align-items-center justify-content-between w-50 mb-1">
                            <div>
                                {file.filename}
                            </div>
                            <div>
                                
                                <IconContext.Provider
                                    value={{ color: 'black', size: '20px' }}
                                >
                                    <FaFileDownload className="me-2" style={{cursor: "pointer"}} onClick={()=> {
                                        donwloadFile(file.path)
                                    }}/>
                                </IconContext.Provider>
                                <IconContext.Provider
                                    value={{ color: 'red', size: '20px' }}
                                >
                                    <FaWindowClose style={{
                                        cursor: "pointer"
                                    }} onClick={() => {
                                        detachFile(file.path, card.uid, boardId).then(() => {
                                            initiateUpdateCard()
                                        })
                                    }}/>
                                </IconContext.Provider>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </>

        ) : <LoadingComponent/>}
    </>
  );
};
