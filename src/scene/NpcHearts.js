import Phaser from "phaser";
import Items from "../entity/Items";

export default class NpcHearts extends Phaser.Scene {
  constructor() {
    super("NpcHearts");
  }
  preload() {
    this.load.image("heart", "assets/sprites/heart.png");
  }

  create() {
    this.heart1 = new Items(this, 620, 80, "heart").setScale(0.5);
    this.heart2 = new Items(this, 670, 80, "heart").setScale(0.5);
    this.heart3 = new Items(this, 720, 80, "heart").setScale(0.5);
  }
  handleComputerHealthChanged() {
    this.computer = this.scene.get("BattleScene");

    if (this.computer.computerHearts === 3) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(true);
    }
    if (this.computer.computerHearts === 2) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(false);
    }

    if (this.computer.computerHearts === 1) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(false);
      this.heart3.setVisible(false);
    }

    if (this.computer.computerHearts === 0) {
      this.heart1.setVisible(false);
      this.heart2.setVisible(false);
      this.heart3.setVisible(false);
    }
  }
  update() {
    this.handleComputerHealthChanged();
  }
}
