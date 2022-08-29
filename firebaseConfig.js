import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBj8aqNEyE8HLpbHe5igdV9enUzsEF6lIE",
  authDomain: "tinder-8eebc.firebaseapp.com",
  projectId: "tinder-8eebc",
  storageBucket: "tinder-8eebc.appspot.com",
  messagingSenderId: "804594004071",
  appId: "1:804594004071:web:08e6d622d2116dbb4da4c2",
  measurementId: "G-LBH54B3BZ7",
};

let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const auth = getAuth();
const storage = getStorage();

// const db = null;
// const auth = null;

export { db, auth, storage };
