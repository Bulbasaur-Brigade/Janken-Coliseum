import Phaser from 'phaser';
import config from './config/config';
import { initializeApp } from 'firebase/app';
import Firebase from 'firebase/app';
import firebaseConfig from './config/fireBaseConfig';
import io from 'socket.io-client'

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.start('TitleScene');
    this.socket = io('http://localhost:8080');

  }
}

// const app = initializeApp(firebaseConfig);
window.onload = function () {
  window.game = new Game();
};
