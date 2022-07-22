import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
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
  const [publicSpace, setPublicSpace] = useState(null);

  useEffect(() => {
    
    if (userId == null) {
      return;
    }

    // console.log("test")

    const docRef = doc(db, "users", userId);
    const q = query(
      collection(db, "workspaces"),
      where("admins", "array-contains", docRef)
    );
    const q2 = query(
      collection(db, "workspaces"),
      where("members", "array-contains", docRef)
    );
    const q3 = query(
      collection(db, "workspaces"),
      where("visibility", "==", "public")
    );
    const loadQuery = async () => {
      try {
        const documents = [];
        const publicDocs = [];
        const uidList = [];
        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(q2);
        const querySnapshot3 = await getDocs(q3);

        if (querySnapshot) {
          querySnapshot.forEach((element) => {
            documents.push({
              ...element.data(),
            });
            uidList.push(element.id);
          });
        }
        
        if (querySnapshot2) {
          querySnapshot2.forEach((element) => {
            documents.push({
              ...element.data(),
            });
            uidList.push(element.id);
          });
        }

        if (querySnapshot3) {
          querySnapshot3.forEach((element) => {
            if (uidList.indexOf(element.id) == -1) {

              publicDocs.push({
                ...element.data(),
              });
              uidList.push(element.id)
            }
          });
        }
        setWorkspace(documents);
        setPublicSpace(publicDocs);
      } catch (e) {
        console.log(e);
      }
    };
    loadQuery();
  }, [updater]);
  // console.log(workspace)
  return workspace;
};

export const useWorkspaceById = (workspaceId, updater) => {
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    const loadAsync = async () => {
      const docRef = doc(db, "workspaces", workspaceId);
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
  const userRef = doc(db, "users", userId);

  const docRef = await addDoc(collection(db, "workspaces"), {
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

        const querySnapshot = await getDocs(collection(db, "users"));
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
          // console.log(querySnapshot);
          // adminRefs.forEach(admin => {
          //     const q = query(collection(db, "boards"), where('admins', "array-contains", docRef), where('uid','in',boardRef))
          // });
        }
        // TODO change from user into 3 separate roles
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

  const workSpaceRef = doc(db, "workspaces", workSpaceId);
  const userRef = doc(db, "users", userId);

  await updateDoc(workSpaceRef, {
    admins: arrayUnion(userRef),
  });

  // e.target.elements.value = ""
  window.location.reload();
};

export const addBoard = async (workspaceId, boardRef) => {
  const workspaceRef = doc(db, "workspaces", workspaceId)
  await updateDoc(workspaceRef, {
      boards: arrayUnion(boardRef)
  })
}

export const removeBoard = async (workspaceId, boardRef) => {
  const workspaceRef = doc(db, "workspaces", workspaceId)
  await updateDoc(workspaceRef, {
      boards: arrayRemove(boardRef)
  })
}