import Phaser from "phaser";
import config from "./config/config";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    // scene start
  }
}

window.onload = function () {
  window.game = new Game();
};
