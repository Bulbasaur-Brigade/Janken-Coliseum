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
  updateMovement() {
    this.body.setVelocityX(25);
    this.play(`${this.npcName}Right`, true);
    // switch (cursors) {
    //   case cursors.W.isDown: {
    //     this.body.setVelocityY(-100);
    //     this.play(`${this.npcName}Up`, true);
    //     break;
    //   }
    //   case cursors.S.isDown: {
    //     this.body.setVelocityY(100);
    //     this.play(`${this.npcName}Down`, true);
    //     break;
    //   }
    //   case cursors.A.isDown: {
    //     this.body.setVelocityX(-100);
    //     this.play(`${this.npcName}Left`, true);
    //     break;
    //   }
    //   case cursors.D.isDown: {
    //     this.body.setVelocityX(100);
    //     this.play(`${this.npcName}Right`, true);
    //     break;
    //   }
    //   default: {
    //     this.body.setVelocityY(0);
    //     this.body.setVelocityX(0);
    //     this.play(`${this.npcName}idle`, true);
    //   }
    // }
  }

  update() {
    this.updateMovement();
    this.body.velocity.normalize().scale(100);
  }
}
