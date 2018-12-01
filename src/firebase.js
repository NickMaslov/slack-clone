import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
  apiKey: 'AIzaSyBNIqcb-HC-TAxJVMVAy3tFGYa9hzhn2mo',
  authDomain: 'slack-clone-0.firebaseapp.com',
  databaseURL: 'https://slack-clone-0.firebaseio.com',
  projectId: 'slack-clone-0',
  storageBucket: 'slack-clone-0.appspot.com',
  messagingSenderId: '246320814164',
};
firebase.initializeApp(config);

export default firebase;
