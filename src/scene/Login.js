// import Phaser from "phaser";
// import { app } from "../config/config";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   // Auth,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
//   signInAnonymously,
// } from "firebase/auth";

// export default class FirebasePlugin extends Phaser.Plugins.BasePlugin {
//   constructor() {
//     super();
//     this.auth = getAuth(app);
//     // this.authStateChangedUnsubscribe = Unsubscribe;

//     this.authStateChangedUnsubscribe = onAuthStateChanged(this.auth, (user) => {
//       if (user && this.onLoggedInCallback) {
//         this.onLoggedInCallback();
//       }
//     });
//   }
//   onLoggedInCallback() {
//     return null;
//   }
//   destroy() {
//     this.authStateChangedUnsubscribe();

//     super.destroy();
//   }

//   onLoggedIn() {
//     this.onLoggedInCallback();
//   }

//   // async saveGameData(userId, data= { name: '', score: 0 })
//   // {
//   // 	await setDoc(doc(this.db, 'game-data', userId), data)
//   // }

//   // async loadGameData(userId='')
//   // {
//   // 	const snap = await getDoc(
//   // 		doc(this.db, 'game-data', userId)
//   // 	) as DocumentSnapshot<{ name: '', score: 0 }>

//   // 	return snap.data()
//   // }

//   async createUserWithEmail(email = "", password = "") {
//     const credentials = await createUserWithEmailAndPassword(
//       this.auth,
//       email,
//       password
//     );
//     return credentials.user;
//   }

//   async signInUserWithEmail(email = "", password = "") {
//     const credentials = await signInWithEmailAndPassword(
//       this.auth,
//       email,
//       password
//     );
//     return credentials.user;
//   }

//   async signInAnonymously() {
//     const credentials = await signInAnonymously(this.auth);
//     return credentials.user;
//   }

//   getUser() {
//     return this.auth.currentUser;
//   }

//   // async addHighScore(name='', score=0)
//   // {
//   // 	await addDoc(collection(this.db, 'high-scores'), { name, score })
//   // }

//   // async getHighScores()
//   // {
//   // 	const q = query(
//   // 		collection(this.db, 'high-scores'),
//   // 		orderBy('score', 'desc'),
//   // 		limit(10)
//   // 	)

//   // 	const snap = await getDocs(q)
//   // 	return snap.docs.map(ref => ref.data())
//   // }
// }
