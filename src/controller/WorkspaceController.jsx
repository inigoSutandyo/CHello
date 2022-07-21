import {
  addDoc,
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

export const useWorkspace = (userId) => {
  const [workspace, setWorkspace] = useState(null);

  useEffect(() => {
    if (userId == null) {
      return;
    }
    const docRef = doc(db, "users", userId);
    const q = query(
      collection(db, "workspaces"),
      where("admins", "array-contains", docRef)
    );
    const loadQuery = async () => {
      try {
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        if (querySnapshot) {
          const documents = [];
          querySnapshot.forEach((element) => {
            console.log(querySnapshot);
            documents.push({
              ...element.data(),
            });
          });

          setWorkspace(documents);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadQuery();
  }, [userId]);

  return workspace;
};

export const useWorkspaceById = (workspaceId) => {
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
  }, [workspaceId]);
  console.log();
  return workspace;
};

export const addNewWorkspace = async (e) => {
  console.log("Adding");
  e.preventDefault();

  const name = e.target.elements.workSpaceName.value;
  const userId = e.target.elements.userId.value;

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
  window.location.reload();
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
          console.log(querySnapshot);
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

  console.log(admins);
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
