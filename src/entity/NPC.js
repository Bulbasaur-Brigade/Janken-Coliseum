import Phaser from "phaser";

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
    this.isDefeated = false;
  }
  // movementNpc() {
  //   switch (this.direction) {
  //     case -1:
  //       // Move left
  //       if (this.x > this.fminX) {
  //         this.setVelocityX(-45);
  //       } else {
  //         // Hit left bounds, change direction
  //         this.direction = 1;
  //       }
  //       break;

  //     case 1:
  //       // Move right
  //       if (this.x < this.fmaxX) {
  //         this.setVelocityX(45);
  //       } else {
  //         //  Hit rightbounds, change direction
  //         this.direction = -1;
  //       }
  //       break;
  //   }
  // }
  update() {
    // this.movementNpc();
  }
}
