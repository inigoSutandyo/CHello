import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { createNewWorkspace, createWorkspace } from "../factory/WorkspaceFactory";
import Workspace from "../model/Workspace";
import { db } from "../util/FireBaseConfig";
import { closeBoard } from "./BoardController";
import { createNotifications, notifyUser } from "./InviteController";

export const useWorkspace = (userId, updater, search) => {
  const [workspace, setWorkspace] = useState(null);
  const [fixed, setFixed] = useState(null);

  useEffect(() => {
    
    if (userId == null) {
      return;
    }

    // console.log("test")
    const docRef = doc(db.getDB(), "users", userId);
    const q = query(
      collection(db.getDB(), "workspaces"),
      where("admins", "array-contains", docRef)
    );
    const q2 = query(
      collection(db.getDB(), "workspaces"),
      where("members", "array-contains", docRef)
    );
    const loadQuery = async () => {
      try {
        const documents = [];
        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(q2);

        if (querySnapshot) {
          querySnapshot.forEach((element) => {
            documents.push({
              ...element.data(),
              membership: "admin"
            });
          });
        }
        
        if (querySnapshot2) {
          querySnapshot2.forEach((element) => {
            documents.push({
              ...element.data(),
              membership: "member"
            });

          });
        }

        setWorkspace(documents);
        setFixed(documents)
      } catch (e) {
        console.log(e);
      }
    };
    loadQuery();
  }, [updater]);


  useEffect(() => {
    if (workspace !== null) {

      const result = fixed.filter(item => {
          const term = search.toLowerCase()
          return item.name.toLowerCase().startsWith(term)
      })
      setWorkspace(result)
    }
  }, [search])
  

  return {workspaces: workspace, fixedWorkspaces: fixed};
};

export const usePublicWorkspace = (workspaces, search) => {
  const [publicSpace, setPublicSpace] = useState(null);
  const [fixed, setFixed] = useState(null)
  useEffect(() => {
    
    if (workspaces == null) {
      return;
    }
    const uidList = []
    workspaces.forEach((workspace) => {
      uidList.push(workspace.uid)
    })
    // console.log(uidList)

    const q = query(
      collection(db.getDB(), "workspaces"),
      where("visibility", "==", "public")
    );
    const loadQuery = async () => {
      try {
        const publicDocs = [];
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot) {
          querySnapshot.forEach((element) => {
            if (uidList.indexOf(element.id) == -1) {
              publicDocs.push({
                ...element.data(),
                membership: "none"
              });
            }
          });
        }
        setPublicSpace(publicDocs);
        setFixed(publicDocs)
      } catch (e) {
        console.log(e);
      }
    };
    loadQuery();
  }, [workspaces]);

  useEffect(() => {
    if (publicSpace !== null) {

      const result = fixed.filter(item => {
          const term = search.toLowerCase()
          return item.name.toLowerCase().startsWith(term)
      })
      setPublicSpace(result)
    }
  }, [search])

  return publicSpace;
}

export const useWorkspaceList = () => {
  const [workspaces, setWorkspaces] = useState()

  useEffect(() => {
    const loadData = async () => {
      const data = []
      const q = query(collection(db.getDB(), "workspaces"), where("visibility", '==', 'public'))
      const querySnap = await getDocs(q)
      if (querySnap) {
        querySnap.forEach(doc => {
          data.push({
            ...doc.data(),
            uid: doc.id,
            ref: doc.ref
          })
        });
      }
      setWorkspaces(data)
    }
    loadData()
  }, [])
  return workspaces
}

export const useWorkspaceById = (workspaceId, userId, updater) => {
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    if (!workspaceId || !userId) return
    
    const loadAsync = async () => {
      const userRef = doc(db.getDB(), 'users', userId)
      const docRef = doc(db.getDB(), "workspaces", workspaceId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data()

        const isAdmin = data.admins.find((admin) => {
          return admin.id === userRef.id
        })
        const isMember = data.members.find((member) => {
          return member.id === userRef.id
        })
        
        if (isAdmin) {
          setWorkspace({
            curr_membership: "admin",
            ...docSnap.data()
          });
        } else if (isMember) {
          setWorkspace({
            curr_membership: "member",
            ...docSnap.data()
          });
        } else {
          setWorkspace({
            curr_membership: "none",
            ...docSnap.data()
          });
        }

        
      }
    };
    loadAsync();
  }, [updater]);
  // console.log(workspace);
  return workspace;
};

export const addNewWorkspace = async (e) => {
  console.log("Adding");
  e.preventDefault();

  const name = e.target.elements.workSpaceName.value.trim();
  const userId = e.target.elements.userId.value;
  if (!name) {
    return ""
  }
  const userRef = doc(db.getDB(), "users", userId);
  const newWorkspace = createNewWorkspace([userRef], name, Timestamp.now()).toDictionary()
  const docRef = await addDoc(collection(db.getDB(), "workspaces"), newWorkspace);

  console.log(docRef);

  await updateDoc(docRef, {
    uid: docRef.id,
  });

  e.target.elements.workSpaceName.value = "";
  return "";
  // window.location.reload();
};

export const deleteWorkspace = async (workspaceId) => {
  const docSnap = await getDoc(doc(db.getDB(), 'workspaces', workspaceId))
  if (docSnap.exists()) {
    const data = docSnap.data()
    const boardRefs = data.boards
    if (boardRefs && boardRefs.length > 0) {
      for (let i = 0; i < boardRefs.length; i++) {
        const element = boardRefs[i];
        closeBoard(element.id, workspaceId)
      }
    }
  }
  await deleteDoc(doc(db.getDB(), 'workspaces', workspaceId))
}

export const useWorkspaceUsers = (workSpace) => {
  const [admins, setAdmins] = useState([]) 
  const [members, setMembers] = useState([]) 

  // const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (workSpace == null) {
      return;
    }

    const loadData = async () => {
      const adminRefs = [];
      const memberRefs = [];
      const adminList = [];
      const memberList = [];

      try {
        if (workSpace.admins) {
          workSpace.admins.forEach((admin) => {
            adminRefs.push(admin.id);
          });
        }
        if (workSpace.members) {
          workSpace.members.forEach((member) => {
            memberRefs.push(member.id);
          });
        }

        const querySnapshot = await getDocs(collection(db.getDB(), "users"));
        if (querySnapshot) {
          querySnapshot.forEach((doc) => {
            if (adminRefs.indexOf(doc.id) != -1) {
              adminList.push({
                uid: doc.id,
                role: "admin",
                ...doc.data(),
              });
            } else if (memberRefs.indexOf(doc.id) != -1) {
              memberList.push({
                uid: doc.id,
                role: "member",
                ...doc.data(),
              });
            } 
          });
        }
        setAdmins(adminList);
        setMembers(memberList);

      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, [workSpace]);

  // console.log(admins);
  return { admins, members };
};

export const addAdmin = async (e) => {
  e.preventDefault();

  const workSpaceId = e.target.elements.workSpaceId.value;
  const userId = e.target.elements.userId.value;

  const workSpaceRef = doc(db.getDB(), "workspaces", workSpaceId);
  const userRef = doc(db.getDB(), "users", userId);

  await updateDoc(workSpaceRef, {
    admins: arrayUnion(userRef),
  });

  // e.target.elements.value = ""
  window.location.reload();
};

export const joinWorkspace = async (userId, workspaceId) => {
  const userRef = doc(db.getDB(), "users", userId)
  const workspaceRef = doc(db.getDB(), 'workspaces', workspaceId)

  await updateDoc(workspaceRef, {
    members: arrayUnion(userRef)
  })

  createNotifications(userRef, workspaceRef)
}

export const changeMembership = async (userId, workspaceId) => {
  const userRef = doc(db.getDB(), "users", userId)
  const workspaceRef = doc(db.getDB(), "workspaces", workspaceId)
  const workspaceSnap = await getDoc(workspaceRef)
  if (workspaceSnap.exists()) {
    const data = workspaceSnap.data()

    const isAdmin = data.admins.find((admin) => {
      return admin.id === userRef.id
    })
    const isMember = data.members.find((member) => {
      return member.id === userRef.id
    })
    // console.log(isAdmin)
    if (isAdmin) {
      toMember(userRef, workspaceRef)
    } else if (isMember) {
      toAdmin(userRef, workspaceRef)
    }
  }
}

const toMember = async (userRef, workspaceRef) => {
  await updateDoc(workspaceRef, {
    admins: arrayRemove(userRef),
    members: arrayUnion(userRef)
  })
}

const toAdmin = async (userRef, workspaceRef) => {
  await updateDoc(workspaceRef, {
    admins: arrayUnion(userRef),
    members: arrayRemove(userRef)
  })
} 

const checkWorkspaceMembers = async (workspaceId) => {
  const workspaceRef = doc(db.getDB(), "workspaces", workspaceId)
  const workspaceSnap = await getDoc(workspaceRef)
  if (workspaceSnap.exists()) {
    const data =workspaceSnap.data()
    if ((!data.admins || data.admins.length === 0) && (!data.members || data.members.length === 0)) {
      deleteWorkspace(workspaceId)
    }
  }
}

export const removeUserWorkspace = async (userId, workspaceId) => {
  const userRef = doc(db.getDB(), "users", userId)
  const workspaceRef = doc(db.getDB(), "workspaces", workspaceId)
  const workspaceSnap = await getDoc(workspaceRef)
  if (workspaceSnap.exists()) {
    const data =workspaceSnap.data()

    const isAdmin = data.admins.find((admin) => {
      return admin.id === userRef.id
    })
    const isMember = data.members.find((member) => {
      return member.id === userRef.id
    })
    // console.log(isAdmin)
    if (isAdmin) {
      removeAdmin(userRef, workspaceRef).then(async ()=> {
        await checkWorkspaceMembers(workspaceId)
      })
    } else if (isMember) {
      removeMember(userRef, workspaceRef).then(async ()=> {
        await checkWorkspaceMembers(workspaceId)
      })
    }
  }
}

const removeAdmin = async (userRef, workspaceRef) => {
  await updateDoc(workspaceRef, {
    admins: arrayRemove(userRef),
  })
}

const removeMember = async (userRef, workspaceRef) => {
  await updateDoc(workspaceRef, {
    members: arrayRemove(userRef)
  })
} 

export const addBoard = async (workspaceId, boardRef) => {
  const workspaceRef = doc(db.getDB(), "workspaces", workspaceId)
  await updateDoc(workspaceRef, {
      boards: arrayUnion(boardRef)
  })

}

export const removeBoard = async (workspaceId, boardRef) => {
  const workspaceRef = doc(db.getDB(), "workspaces", workspaceId)
  await updateDoc(workspaceRef, {
      boards: arrayRemove(boardRef)
  })
}

export const changeVisibility = async (workspaceId, visibility) => {
  await updateDoc(doc(db.getDB(), "workspaces", workspaceId), {
    visibility: visibility
  })
}

export const useBoardWorkspace = (boardId) => {
  const [workspace, setWorkspace] = useState(null)
  useEffect(() => {
    const loadData = async () => {
      if (!boardId) return
      const workspaceSnap = await getDocs(collection(db.getDB(), 'workspaces')) 
      if (workspaceSnap) {

        workspaceSnap.forEach(doc => {
          const data = doc.data()
          if (data.boards) {
            for (let i = 0; i < data.boards.length; i++) {
              const boardRef = data.boards[i];
              if (boardRef.id === boardId) {
                setWorkspace({
                  uid: doc.id,
                  ...doc.data()
                })
                break;
              }
            }
          }
        });
      }
    }
    loadData()
  }, [boardId])
  return workspace
}