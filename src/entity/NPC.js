import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey, npcName) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.npcName = npcName;
    // this.direction = direction;
    // this.body.setImmovable(true);
    // this.isDefeated = false;
  }

  //Movements
  updateMovement(cursors) {
    switch (cursors) {
      case cursors.W.isDown: {
        this.setVelocityY(-100);
        this.play(`${this.npcName}Up`, true);
        break;
      }
      case cursors.S.isDown: {
        this.setVelocityY(100);
        this.play(`${this.npcName}Down`, true);
        break;
      }
      case cursors.A.isDown: {
        this.setVelocityX(-100);
        this.play(`${this.npcName}Left`, true);
        break;
      }
      case cursors.D.isDown: {
        this.setVelocityX(100);
        this.play(`${this.npcName}Right`, true);
        break;
      }
      default: {
        this.setVelocityY(0);
        this.setVelocityX(0);
        this.play(`${this.npcName}idle`, true);
      }
    }
  }

  update(cursors) {
    this.updateMovement(cursors);
    this.body.velocity.normalize().scale(100);
  }
}
