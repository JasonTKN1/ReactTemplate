import app from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import '@firebase/firestore';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: "AIzaSyBwXL8N5IXD0FBBKu1sJHtTzEvPzUO4xgc",
  authDomain: "react-template-521ee.firebaseapp.com",
  databaseURL: "https://react-template-521ee.firebaseio.com",
  projectId: "react-template-521ee",
  storageBucket: "react-template-521ee.appspot.com",
  messagingSenderId: "644150921085",
  appId: "1:644150921085:web:db19fbd0e2f560e5e3ae14",
  measurementId: "G-Y88XXJFD9Q"
};

const firebase = app.initializeApp(firebaseConfig);
export const db = firebase.firestore();
export const storage = firebase.storage();

export default firebase;

// class Firebase {
//   constructor() {
//     app.initializeApp(firebaseConfig);
//     app.analytics();
//     this.auth = app.auth();
//   }

//   //Firebase API
//   doCreateUserWithEmailAndPassword = (email, password) =>
//     this.auth.createUserWithEmailAndPassword(email, password);

//   doSignInWithEmailAndPassword = (email, password) =>
//     this.auth.signInWithEmailAndPassword(email, password);

//   doSignOut = () => this.auth.signOut();

//   doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

//   doPasswordUpdate = password =>
//     this.auth.currentUser.updatePassword(password);
// }

// export default Firebase;