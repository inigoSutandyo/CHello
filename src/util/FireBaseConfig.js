// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import {getAuth} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: `${process.env.REACT_APP_FIREBASE_API_KEY}`,
  authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
  projectId: `${process.env.REACT_APP_PROJECT_ID}`,
  storageBucket: `${process.env.REACT_APP_STORAGE_BUCKET}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGING_SENDER_ID}`,
  appId: `${process.env.REACT_APP_APPLICATION_ID}`
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

export const storage = getStorage();