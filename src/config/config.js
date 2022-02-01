import Phaser from "phaser";
import BattleScene from "../scene/BattleScene";
import fireBaseConfig from "./fireBaseConfig";
// import Firebase from "firebase/app";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import Menu from "../scene/Menu";

export const app = firebase.initializeApp(fireBaseConfig);

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
import OverworldScene from "../scene/OverworldScene";
import FirebasePlugin from "../scene/Login";

export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine
  width: 800, // Game width in pixels
  height: 600, // Game height in pixels

  render: {
    pixelArt: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  // plugins:{
  //   global:[{
  //     key:'FirebasePlugin',
  //     plugin:FirebasePlugin,
  //     start:true,
  //     mapping:'firebase'
  //   }]
  // },

  parent: "content",
  dom: {
    createContainer: true,
  },
  scene: [Menu, OverworldScene, BattleScene],
};
