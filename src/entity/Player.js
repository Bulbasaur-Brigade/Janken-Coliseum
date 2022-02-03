import Phaser from "phaser";

const IDLE_HEALTH = "IDLE_HEALTH";
const DAMAGE_HP = "DAMAGE_HP";
const DEAD = "DEAD";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.healthState = IDLE_HEALTH;
    this.playerHp = 3;
    this.playerItems = [];
  }
  getHealth() {
    return this.playerHp;
  }
  handleDamage() {
    if (this.playerHp <= 0) {
      return;
    }

    if (this.healthState === DAMAGE_HP) {
      return;
    }

    --this.playerHp;

    if (this.playerHp <= 0) {
      // TODO: die
      this.healthState = DEAD;

      this.setVelocity(0, 0);
    } else {
      // this.setVelocity(dir.x, dir.y);

      // this.setTint(0xff0000);

      this.healthState = DAMAGE_HP;
    }
  }
  addItem(name, amount) {
    for (let i = 0; i < this.playerData.items.length; i++) {
      if (this.playerItems[i].name === name) {
        this.playerItems[i].amount += amount;
        return;
      }
    }
    this.playerItems.push({ name: name, amount: amount });
  }
  removeItem(name, amount) {
    for (let i = 0; i < this.playerData.items.length; i++) {
      if (this.playerItems[i].name === name) {
        this.playerItems[i].amount -= amount;
        if (this.playerItems[i].amount <= 0) {
          this.playerItems.splice(i, 1);
        }
        return;
      }
    }
    this.playerItems.push({ name: name, amount: amount });
  }
  //Movements
  updateMovement(cursors, walkSound) {
    // this.key_W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    // this.key_A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // this.key_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    // this.key_D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    if (cursors.up.isDown) {
      this.setVelocityY(-100);
      this.play("runUp", true);
      walkSound.play();
    } else if (cursors.left.isDown) {
      this.setVelocityX(-100);
      this.play("runLeft", true);
      walkSound.play();
    } else if (cursors.down.isDown) {
      this.setVelocityY(100);
      this.play("runDown", true);
      walkSound.play();
    } else if (cursors.right.isDown) {
      this.setVelocityX(100);
      this.play("runRight", true);
      walkSound.play();
    } else {
      this.setVelocityY(0);
      this.setVelocityX(0);
      this.play("idle");
      // walkSound.stop();
    }
  }

  update(cursors, walkSound) {
    this.updateMovement(cursors, walkSound);
    if (this.healthState === DAMAGE_HP || this.healthState === DEAD) {
      return;
    }
    if (!cursors) {
      return;
    }
  }
}
