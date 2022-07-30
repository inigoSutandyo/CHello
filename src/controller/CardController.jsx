import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, namedQuery, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useEffect } from "react"
import { useState } from "react"
import { db, storage } from "../util/FireBaseConfig"
import { notifyUser } from "./InviteController"


export const useCards = (kanbanId, board, cardUpdater) => {
    const [cards, setCards] = useState(null)

    useEffect(() => {
        if (!kanbanId || !board) {
            return;
        }

        const loadData = async () => {

            const docSnap = await getDoc(doc(db.getDB(), `boards/${board.uid}/lists`, kanbanId))
            if (!docSnap.data().cards) {
                return
            }
            const refList = []
            docSnap.data().cards.forEach((ref) => {
                refList.push(ref.id)
            })
            const cardArr = []
            const q = query(collection(db.getDB(), `boards/${board.uid}/cards`))
            const querySnapshot = await getDocs(q)

            if (querySnapshot) {
                querySnapshot.forEach((card) => {    
          
                    if (refList.indexOf(card.id) != -1) {
                        const due = card.data().dueDate ? card.data().dueDate.toDate() : null
                        const reminder = card.data().reminderDate ? card.data().reminderDate.toDate() : null
                        cardArr.push({
                            uid: card.id,
                            due: due,
                            reminder: reminder,
                            ...card.data()
                        })
                        // console.log(doc.data())
                    }
                })
                setCards(cardArr)
            }
        }
        loadData()
    }, [cardUpdater])
    // console.log(cards)
    return cards
}

export const useCardById = (cardId, boardId, updater) => {
    const [card, setCard] = useState(null)

    useEffect(() => {
    //   console.log(cardId)
      if (!cardId || !boardId) return
      const loadData = async () => {
        const cardSnap = await getDoc(doc(db.getDB(), `boards/${boardId}/cards`,cardId))
        if (cardSnap.exists()) {
            const watchersId = []
            if (cardSnap.data().watchers) {
                for (let i = 0; i < cardSnap.data().watchers.length; i++) {
                    watchersId.push(cardSnap.data().watchers[i].id)
                }
            }
            const due = cardSnap.data().dueDate ? cardSnap.data().dueDate.toDate() : null
            const reminder = cardSnap.data().reminderDate ? cardSnap.data().reminderDate.toDate() : null
            setCard({
                uid: cardSnap.id,
                due: due,
                reminder: reminder,
                watchersId: watchersId,
                ...cardSnap.data()
            })
        }
      }
      loadData()
    }, [cardId, updater])
    // console.log(card)
    return card
}

export const addNewCard = async (e) => {  
    e.preventDefault()

    const title = e.target.elements.cardTitle.value
    const boardId = e.target.elements.boardId.value
    const listId = e.target.elements.listId.value

    const docRef = await addDoc(collection(db.getDB(), `/boards/${boardId}/cards`), {
        title: title,
        description: "This is a description",
        datecreated: Timestamp.now()
    })
    // console.log(docRef.path)
    await updateDoc(doc(db.getDB(), `/boards/${boardId}/lists`, listId), {
        cards: arrayUnion(docRef)
    })

    return ""
}

export const updateDescription = async (desc, cardId, boardId) => {
    await updateDoc(doc(db.getDB(),`boards/${boardId}/cards/`, cardId), {
        description: desc
    })
}
export const updateTitle = async (title, cardId, boardId) => {
    await updateDoc(doc(db.getDB(),`boards/${boardId}/cards/`, cardId), {
        title: title
    })
}

export const addCheckList = async (cardId, boardId, content) => {
    // console.log(cardId)
    // console.log(boardId)
    // console.log(content)
    if (!content || !boardId || !cardId) {
        console.log("error")
        return
    }
    await addDoc(collection(db.getDB(),`boards/${boardId}/cards/${cardId}/checklists`), {
        content: content,
        isChecked: false,
    })
    
}

export const removeCheckList = async (cardId, boardId, checkId) => {
    if (!cardId || !boardId || !checkId) {
        return
    }
    const checkRef = doc(db.getDB(),`boards/${boardId}/cards/${cardId}/checklists`, checkId)
    
    await deleteDoc(checkRef)
}

export const useCheckList = (card, boardId, checkUpdater) => {
    const [checklist, setChecklist] = useState(null)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!card ) {
            return
        }
        
        const checkArr = []
        const loadData = async () => {
            try {
                
                const q = query(collection(db.getDB(),`boards/${boardId}/cards/${card.uid}/checklists`))
                const querySnapshot = await getDocs(q)
                if (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        checkArr.push({
                            uid: doc.id,
                            ...doc.data()
                        })
                    })
                }
                setChecklist(checkArr)
            } catch (error) {
                console.log(error)
            }
        }
        loadData()
    }, [card, checkUpdater])

    useEffect(() => {
        if (!checklist) {
            return
        }
        let prog = 0
        checklist.forEach(c => {
            if (c.isChecked) {
                prog++
                // console.log(prog)
            }
        });
        setProgress(prog)
    }, [checklist])

    return {checklist: checklist, progress: progress}
}

export const changeChecked = async (cardId, boardId, checkId, checked) => {
    await updateDoc(doc(db.getDB(),`boards/${boardId}/cards/${cardId}/checklists`, checkId), {
        isChecked : checked
    })
}

export const useCardComment = (cardId, boardId) => {
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (!cardId || !boardId) return

        const commentList = []
        
        const loadData = async () => {
            const cardRef = doc(db.getDB(), `boards/${boardId}/cards`, cardId)
            const q = query(collection(db.getDB(),  `boards/${boardId}/comments`), 
                where('card','==',cardRef))
            
            try {
                
                const querySnapshot = await getDocs(q)
                if (querySnapshot) {
                    querySnapshot.forEach((doc) => {
                        commentList.push({
                            uid: doc.id,
                            cardId: cardId,
                            ...doc.data()
                        })
                    })
                }
                setComments(commentList)
            } catch (error) {
                console.log(error)
            }
        }
        loadData()
    }, [cardId])
    console.log(comments)
    return comments
}

export const addCardComment = async (cardId, boardId, userId, content) => {
    if (!content.trim()) return

    const cardRef = doc(db.getDB(), `boards/${boardId}/cards`, cardId)
    const userRef = doc(db.getDB(), `users`, userId)

    const user = await getDoc(userRef)
    if (!user) {
        console.log("User not found")
        return
    }
    await addDoc(collection(db.getDB(), `boards/${boardId}/comments`), {
        content: content,
        user: userRef,
        card: cardRef,
        userEmail: user.data().email
    })
}

export const useLabels = (boardId, cardUpdater) => {
    const [labels, setLabels] = useState(null)

    useEffect(() => {
      if (!boardId) return
      const labelList = []
      const loadData = async () => {
          try {
            const labelSnapshot = await getDocs(collection(db.getDB(), `/boards/${boardId}/labels`))
            if (labelSnapshot) {
                labelSnapshot.forEach((doc) => {
                    labelList.push({
                        ref: doc.ref,
                        uid: doc.id,
                        ...doc.data()
                    })
                })
                setLabels(labelList)
            }
          } catch (error) {
            console.log(error)
          }
      }
      loadData()
    }, [cardUpdater])
    return labels
}

export const useCardLabel = (labels, card) => {
    const [label, setLabel] = useState(null)
    useEffect(() => {
        if (!card || !labels || !card.label) {
            return 
        }
        labels.forEach(label => {
            
            if (card.label !== null && card.label.id == label.ref.id) {
                setLabel(label)
                return label
            } 
        });

    }, [labels, card])
    // console.log(label)
    return label
}


export const detachLabel = async (card, boardId) => {
    if (!card.label) return
    
    await updateDoc(doc(db.getDB(), `boards/${boardId}/cards`, card.uid), {
        label: null
    })
    console.log("detached")
}

export const addLabel = async (e) => {
    e.preventDefault()
    const lblname = e.target.elements.labelName.value
    const boardId = e.target.elements.boardId.value
    const cardId = e.target.elements.cardId.value
    const color = e.target.elements.color.value

    if (!lblname.trim()) return "Label cannot be empty"

    const q = query(collection(db.getDB(), `boards/${boardId}/labels`), where('color', '==', color))
    let flag = false;
    try {
        const querySnapshot = await getDocs(q)
        if (querySnapshot) {
            querySnapshot.forEach((doc) => {
                // console.log(doc.data().color, color)
                if (doc.data().color == color) {
                    // return "Color already picked"
                    flag = true
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
    
    if (flag) {
        return "Color already picked"
    } else {
        const docRef = await addDoc(collection(db.getDB(), `boards/${boardId}/labels`), {
            name: lblname,
            color: color
        })
        await updateDoc(doc(db.getDB(), `boards/${boardId}/cards`,cardId), {
            label: docRef
        })
        return ""
    }
}

export const changeLabel = async (cardId, labelId, boardId) => {
    if (!cardId || !labelId) {
        return
    }

    const labelRef = doc(db.getDB(), `boards/${boardId}/labels`, labelId)
    await updateDoc(doc(db.getDB(), `boards/${boardId}/cards`, cardId), {
        label: labelRef
    })
}

export const deleteLabel = async (labelId, boardId) => {
    // console.log(cardId)
    if (!labelId) {
        return
    }
    console.log(labelId)
    const labelRef = doc(db.getDB(), `boards/${boardId}/labels`, labelId)
    const q = query(collection(db.getDB(), `boards/${boardId}/cards`), where('label','==', labelRef))
    const querySnap = await getDocs(q)
    await deleteDoc(labelRef)
    if (querySnap) {
        querySnap.forEach((card) => {
            detachLabel(card, boardId)
        })
    }
    await deleteDoc(doc(db.getDB(), `boards/${boardId}/labels`, labelId))
    
}

export const addDueDate = async (cardId, boardId, date) => {
    if (!cardId || !boardId || !date) {
        return
    }
    await updateDoc(doc(db.getDB(), `boards/${boardId}/cards`, cardId), {
        dueDate: Timestamp.fromDate(date)
    })
}

export const addReminderDate = async (cardId, boardId, date) => {
    if (!cardId || !boardId || !date) {
        return
    }
    await updateDoc(doc(db.getDB(), `boards/${boardId}/cards`, cardId), {
        reminderDate: Timestamp.fromDate(date)
    })
}

export const mentionUser = async (data, userId) => {
    const userRef = doc(db.getDB(), "users", userId)
    const userSnap = await getDoc(userRef)
    const mentions = []
    if ( userSnap.exists()) {
        data.forEach(element => {
            // prevent duplicates
            if (mentions.indexOf(element) === -1) {
                mentions.push(element)
            }
        });
        const user = userSnap.data()
        const message = `User ${user.email} mentioned you in a comment!`
        mentions.forEach(mention => {
            notifyUser(mention, message)
        });        
    }

}

export const useFiles = (cardId, boardId, updater) => {
    const [files, setFiles] = useState()

    useEffect(() => {
      if (!cardId || !boardId) {
        return
      }
      const loadData = async () => {
          const fileList = []
          const cardRef = doc(db.getDB(), `boards/${boardId}/cards`,cardId)
          const cardSnap = await getDoc(cardRef)
          if (cardSnap.exists() && cardSnap.data().files) {

            const data = cardSnap.data().files
            data.forEach(path => {
                fileList.push({
                    filename: path.substring(path.indexOf('/') + 1),
                    path: path
                })
            });
          }
          setFiles(fileList)
      }
      loadData()
    }, [updater])
    // console.log(files)
    return files   
}

export const addFiles = async (cardId, boardId, files = []) => {

    if (!cardId || files.length === 0) {
        console.log("error")
        return
    }
    const cardRef = doc(db.getDB(), `boards/${boardId}/cards`,cardId)


    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `${cardId}/${file.name}`);
        try {
            await updateDoc(cardRef, {
                files: arrayUnion(`${cardId}/${file.name}`)
            })
            await uploadBytes(storageRef, file)
        } catch (error) {
            console.log(error)
        }
    }
    // console.log("file uploaded")
}
export const detachFile = async (path, cardId, boardId) => {
    const cardRef = doc(db.getDB(), `boards/${boardId}/cards`,cardId)
    await updateDoc(cardRef, {
        files: arrayRemove(path)
    })
}
export const donwloadFile = async (path) => {
    console.log(path)
    getDownloadURL(ref(storage, path)).then((url) => {
        // require("../shell").openExternal(url)
        window.open(url)
        console.log(url)
    })
    .catch((error) => {
        console.log(error)
    });
}

export const useWatchers = (cardId, boardId) => {
    const [watchers, setWatchers] = useState()
    useEffect(() => {
        if (!cardId || !boardId) return;
        const watcherList= []
        const loadData = async () => {
            const cardSnap = await getDoc(doc(db.getDB(), `boards/${boardId}/cards`, cardId))
            if (cardSnap.exists()) {
                const data = cardSnap.data()
                if (data.watchers) {
                    data.watchers.forEach(watcher => {
                        watcherList.push(watcher)
                    });
                }
            }
            setWatchers(watcherList)
        }
        loadData()
    }, [cardId])
    return watchers
}



export const assignWatcher = async (userId, cardId, boardId) => {
    await updateDoc(doc(db.getDB(), `boards/${boardId}/cards`, cardId), {
        watchers: arrayUnion(doc(db.getDB(), 'users', userId))
    })
}

export const removeWatcher = async (userId, cardId, boardId) => {
    await updateDoc(doc(db.getDB(), `boards/${boardId}/cards`, cardId), {
        watchers: arrayRemove(doc(db.getDB(), 'users', userId))
    })
    console.log(userId)
}

export const notifyWatchers = async (userId, cardId, boardId) => {
    const cardRef = doc(db.getDB(), `boards/${boardId}/cards`, cardId)
    const cardSnap = await getDoc(cardRef)
    const userRef = doc(db.getDB(), `users`, userId)
    const userSnap = await getDoc(userRef)
    if ( userSnap.exists() && cardSnap.exists() && cardSnap.data().watchers && cardSnap.data().watchers.length > 0) {
        const data = cardSnap.data().watchers
        console.log(data)
        const watchers = []
        data.forEach(d => {
            if (d.id !== userId) {
                watchers.push(d.id)
            }
        });
        const user = userSnap.data()
        const message = `User ${user.email} commented on ${cardSnap.data().title}!`
        watchers.forEach(mention => {
            console.log(mention)
            notifyUser(mention, message)
        });        
    }
}