import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQG4LHP83vG2ejxmvvhEO9JmkCRz1Ura8",
  authDomain: "evolving-cyborgs.firebaseapp.com",
  projectId: "evolving-cyborgs",
  storageBucket: "evolving-cyborgs.appspot.com",
  messagingSenderId: "227289225069",
  appId: "1:227289225069:web:3ebe01331f89b51f2aac64",
  measurementId: "G-MNK9S3Y1TD",
};

//init firebase
firebase.initializeApp(firebaseConfig);

//init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

//timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };
