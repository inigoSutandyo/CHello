// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6Awo2iM_RdzewGpF6mZkPmaaQRev1f6c",
  authDomain: "chello-tpa.firebaseapp.com",
  projectId: "chello-tpa",
  storageBucket: "chello-tpa.appspot.com",
  messagingSenderId: "282117346104",
  appId: "1:282117346104:web:6016d9283a684b8c69e7cd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);
// export const auth = getAuth(app)

export const db = (function () {
  var database;
  var auth;
  function create() {
      // Initialize Firebase
      database = getFirestore(app);
  }
  function createAuth() {
      auth = getAuth(app);
  }
  return {
      getDB: function () {
          if (!database) create();

          return database;
      },
      getAuth: function () {
          if (!auth) createAuth();

          return auth;
      },
  };
})();

export const auth = (function () {
  var auth;
  function createAuth() {
      auth = getAuth(app);
  }
  return {
      getAuth: function () {
          if (!auth) createAuth();

          return auth;
      },
  };
})();