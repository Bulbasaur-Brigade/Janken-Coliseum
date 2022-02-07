import Phaser from "phaser";
import Items from "../entity/Items";
// import { sceneEvents } from "../Events/EventsCenter";

export default class Heart extends Phaser.Scene {
  constructor() {
    super("Heart");
  }
  preload() {
    this.load.image("heart", "assets/sprites/heart.png");
  }

  create() {
    this.heart1 = new Items(this, 330, 30, "heart").setScale(0.7);
    this.heart2 = new Items(this, 380, 30, "heart").setScale(0.7);
    this.heart3 = new Items(this, 430, 30, "heart").setScale(0.7);
  }
  handlePlayerHealthChanged() {
    let data = localStorage.getItem("hp");
    let hp = data ? JSON.parse(data) : 3;

    if (hp === 3) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(true);
    }
    if (hp === 2) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(false);
    }

    if (hp === 1) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(false);
      this.heart3.setVisible(false);
    }

    if (hp === 0) {
      this.heart1.setVisible(false);
      this.heart2.setVisible(false);
      this.heart3.setVisible(false);
    }
  }
  update() {
    this.handlePlayerHealthChanged();
  }
}
