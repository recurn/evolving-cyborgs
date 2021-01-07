import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB5sD4OdKgrroxABBEeKPNo2I8m3KE8xp4",
  authDomain: "evolving-cyborgs.firebaseapp.com",
  projectId: "evolving-cyborgs",
  storageBucket: "evolving-cyborgs.appspot.com",
  messagingSenderId: "227289225069",
  appId: "1:227289225069:web:70744b4ed8fa3f742aac64",
  measurementId: "G-PP87ZVKPSX"
};

//init firebase
firebase.initializeApp(firebaseConfig)

//init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()
const projectStorage = firebase.storage()

//timestamp
const timestamp = firebase.firestore.FieldValue.serverTimestamp

export {projectFirestore, projectAuth, projectStorage, timestamp}