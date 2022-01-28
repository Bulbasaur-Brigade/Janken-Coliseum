import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }
  updateMovement(cursors) {
    // Move left
    if (cursors.left.isDown) {
      this.setVelocityX(-270);
    }

    // Move right
    else if (cursors.right.isDown) {
      this.setVelocityX(270);
    }
    // Move down
    else if (cursors.up.isDown) {
      this.setVelocityY(-270);
      this.setVelocityX(0);
    }
    // Move down
    else if (cursors.down.isDown) {
      this.setVelocityY(270);
    }
    // Neutral (no movement)
    else {
      this.setVelocityX(0);
    }
  }
  update(cursors) {
    // << INSERT CODE HERE >>
    this.updateMovement(cursors);
  }
}
