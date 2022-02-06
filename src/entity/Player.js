import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
  }
  setHp() {
    let hp = parseInt(localStorage.getItem("hp")) || 3;

    localStorage.setItem("hp", JSON.stringify(hp));
  }

  //Movements
  updateMovement(cursors) {
    if (cursors.W.isDown) {
      this.setVelocityY(-100);
      this.play("runUp", true);
    } else if (cursors.A.isDown) {
      this.setVelocityX(-100);
      this.play("runLeft", true);
    } else if (cursors.S.isDown) {
      this.setVelocityY(100);
      this.play("runDown", true);
    } else if (cursors.D.isDown) {
      this.setVelocityX(100);
      this.play("runRight", true);
    } else {
      this.setVelocityY(0);
      this.setVelocityX(0);
      this.play("idle");
    }
  }

  update(cursors) {
    this.updateMovement(cursors);
    this.body.velocity.normalize().scale(100);
  }
}
