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
import { db } from "../util/FireBaseConfig";

export const useWorkspace = (userId, updater) => {
  const [workspace, setWorkspace] = useState(null);

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
      } catch (e) {
        console.log(e);
      }
    };
    loadQuery();
  }, [updater]);

  return workspace;
};

export const usePublicWorkspace = (workspaces) => {
  const [publicSpace, setPublicSpace] = useState(null);

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
      } catch (e) {
        console.log(e);
      }
    };
    loadQuery();
  }, [workspaces]);

  return publicSpace;
}

export const useWorkspaceById = (workspaceId, updater) => {
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const loadAsync = async () => {
      const docRef = doc(db.getDB(), "workspaces", workspaceId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setWorkspace(docSnap.data());
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

  const docRef = await addDoc(collection(db.getDB(), "workspaces"), {
    name: name,
    datecreated: Timestamp.now(),
    admins: [userRef],
    members: [],
    boards: [],
    visibility: "public",
  });

  console.log(docRef);

  await updateDoc(docRef, {
    uid: docRef.id,
  });

  e.target.elements.workSpaceName.value = "";
  return "";
  // window.location.reload();
};

export const deleteWorkspace = async (workspaceId) => {
  await deleteDoc(doc(db.getDB(), 'workspace', workspaceId))
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

export const changeMembership = async (userId, workspaceId) => {
  const userRef = doc(db.getDB(), "users", userId)
  const workspaceRef = doc(db.getDB(), "workspaces", workspaceId)
  const workspaceSnap = await getDoc(workspaceRef)
  if (workspaceSnap.exists()) {
    const data =workspaceSnap.data()
    // if (data.members[0] == userRef) {
    //   console.log("found")
    // }
    // console.log(data.members[0])
    // console.log(userRef)

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
      removeAdmin(userRef, workspaceRef)
    } else if (isMember) {
      removeMember(userRef, workspaceRef)
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
