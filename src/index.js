import Phaser from 'phaser';
import config from './config/config';
import { initializeApp } from 'firebase/app';
import Firebase from 'firebase/app';
import firebaseConfig from './config/fireBaseConfig';

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.start('TitleScene');
  }
}

const app = initializeApp(firebaseConfig);
window.onload = function () {
  window.game = new Game();
};
