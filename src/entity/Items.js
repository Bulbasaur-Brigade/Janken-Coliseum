import Phaser from 'phaser';

export default class Items extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {

    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
  }
}
