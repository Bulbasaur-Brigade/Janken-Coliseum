import Phaser from 'phaser';
import BattleScene from '../scene/BattleScene';
import SinglePlayerMapScene from '../scene/SinglePlayerMapScene';
import TitleScene from '../scene/TitleScene';
import Menu from '../scene/Menu';
import LossScene from '../scene/LossScene';
import MultiPlayerMapScene from '../scene/MultiPlayerMapScene';

// import fireBaseConfig from './fireBaseConfig';
// // import Firebase from "firebase/app";
// import {
//   getFirestore,
//   Firestore,
//   setDoc,
//   doc,
//   getDoc,
//   DocumentSnapshot,
//   addDoc,
//   collection,
//   query,
//   orderBy,
//   limit,
//   getDocs,
//   collectionGroup,
// } from 'firebase/firestore';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

// export const app = firebase.initializeApp(fireBaseConfig);
// const database = getFirestore(app);
// console.log('/////', database);

// addDoc(doc(database, "games","test"), {
//   name: "hell"
// }).then((data) => {
//   return data
// }).catch((error) => {
//   console.log(error);
// })

// setDoc(doc(database, "games/LA/players"), {
// name: "Los Angeles",

// })

// const allPosts = getDocs(collectionGroup(database, "Players"))

// setDoc(doc(database, 'games', 'gamesession1', 'players', 'player2'), {
//   health: 2,
//   inventory: [
//     {
//       rock: 1,
//       paper: 1,
//       scissors: 1,
//     },
//   ],
//   name: 'fuck',
// })
//   .then((data) => {
//     return data;
//   })
//   .catch((error) => console.log(error));

// setDoc(doc(database, "games"), {
//   name:'player 3'
// });

// const getData =async() => {
// const querySnapshot = await getDocs(collection(database,'players'))
//   console.log('//////////', querySnapshot);

// }

// getData()

// set(ref(database, 'players/elstan/'), {
//   name: 'Elstan',
//   inventory: [{
//     name: 'rock',
//     quantity:0
//   },
//     {

//   }]
// });

// firebaseApp.auth().onAuthStateChanged(function (user) {
//     if (user) {
//         // User is signed in.
//         var displayName = user.displayName;
//         var email = user.email;
//         var emailVerified = user.emailVerified;
//         var photoURL = user.photoURL;
//         var isAnonymous = user.isAnonymous;
//         var uid = user.uid;
//         var providerData = user.providerData;
//         // ...
//     } else {
//         // User is signed out.
//         // ...
//     }
// });

// import FirebasePlugin from '../scene/Login';

export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine
  width: 800, // Game width in pixels
  height: 600, // Game height in pixels

  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },

  parent: 'content',
  dom: {
    createContainer: true,
  },
  scene: [
    TitleScene,
    Menu,
    MultiPlayerMapScene,
    SinglePlayerMapScene,
    BattleScene,
    LossScene,
  ],
};
