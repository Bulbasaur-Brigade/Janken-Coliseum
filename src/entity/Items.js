import Phaser from "phaser";

export default class Items extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey,index) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }

}
