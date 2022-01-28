import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }
  //Movements
  updateMovement(cursors) {
    // this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    // this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    if (cursors.up.isDown) {
      this.setVelocityY(-100);
    } else if (cursors.left.isDown) {
      this.setVelocityX(-100);
    } else if (cursors.down.isDown) {
      this.setVelocityY(100);
    } else if (cursors.right.isDown) {
      this.setVelocityX(100);
    } else {
      this.setVelocityY(0);
      this.setVelocityX(0);
    }
  }

  update(cursors) {
    this.updateMovement(cursors);
  }
}
