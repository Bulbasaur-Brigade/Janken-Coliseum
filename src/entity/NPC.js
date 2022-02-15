import Phaser from "phaser";

const Direction = ["Up", "Down", "Left", "Right"];

const randomDirection = (exclude) => {
  let newDirection = Phaser.Math.Between(0, 3);
  while (Direction[newDirection] === Direction[exclude]) {
    newDirection = Phaser.Math.Between(0, 3);
  }
  return Direction[newDirection];
};

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  //Private Fields
  #direction = Direction[0];

  constructor(scene, x, y, spriteKey, frame) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.npcName = frame;
    this.defeated = false;
    this.moveEvent = this.scene.time.addEvent({
      delay: 2500,
      callback: () => {
        this.#direction = randomDirection(this.#direction);
      },
      loop: true,
    });
  }


  preUpdate(t, dt) {
    super.preUpdate(t, dt);
    if (!this.body.enable) {
      this.play(`${this.npcName}idle`, true);
    }
    const speed = 35;
    switch (this.#direction) {
      case Direction[0]: {
        this.body.setVelocity(0, -speed);
        this.play(`${this.npcName}Up`, true);
        break;
      }
      case Direction[1]: {
        this.body.setVelocity(0, speed);
        this.play(`${this.npcName}Down`, true);
        break;
      }
      case Direction[2]: {
        this.body.setVelocity(-speed, 0);
        this.play(`${this.npcName}Left`, true);
        break;
      }
      case Direction[3]: {
        this.body.setVelocity(speed, 0);
        this.play(`${this.npcName}Right`, true);
        break;
      }
      default: {
        this.body.setVelocity(0, 0);
        this.anims.stop();
      }
    }
  }
}
