import Phaser from "phaser";
// import Player from "../entity/player";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }
  preload() {
    this.load.image(
      "startSceneBackground",
      "assets/backgrounds/background.jpg"
    );
    // this.load.image("player", "assets/sprites/player.png");
  }
  create() {
    // this.add.text(100, 100, "Hello world");
    this.add.image(0, 0, "startSceneBackground").setOrigin(0);
    // this.player = new Player(this, 0, 100, "player");
    // this.opponent = new Player(this, 200, 200, "player");
  }
  update() {}
}
