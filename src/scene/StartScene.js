import Phaser from "phaser";
import Player from "../entity/player";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }
  preload() {
    this.load.image(
      "startSceneBackground",
      "assets/backgrounds/background.jpg"
    );
    this.load.image("sensei", "assets/sprites/sensei.png");
  }
  create() {
    // this.add.text(100, 100, "Hello world");
    this.add.image(0, 0, "startSceneBackground").setOrigin(0).setScale(0.8);
    this.player = new Player(this, 100, 550, "sensei").setScale(3);
    this.opponent = new Player(this, 400, 550, "sensei").setScale(3);
    // Collision;
    this.physics.add.collider(
      this.player,
      this.opponent,
      function () {
        this.scene.start("BattleScene");
      },
      null,
      this
    );

    // Movement with cursors
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  update(time, delta) {
    this.player.update(this.cursors);
  }
}
