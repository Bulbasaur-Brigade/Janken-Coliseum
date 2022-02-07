import Phaser from "phaser";
import config from "./config/config";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.start("TitleScene");
  }
  create() {}
}

// const app = initializeApp(firebaseConfig);
window.onload = function () {
  window.game = new Game();
};
