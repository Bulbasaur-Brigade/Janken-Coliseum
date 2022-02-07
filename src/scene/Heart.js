import Phaser from "phaser";
import Items from "../entity/Items";
import store from "../store/store";
export default class Heart extends Phaser.Scene {
  constructor() {
    super("Heart");
  }
  init() {}
  preload() {
    this.load.image("heart", "assets/sprites/heart.png");
  }

  create() {
    this.heart1 = new Items(this, 280, 30, "heart").setScale(0.7);
    this.heart2 = new Items(this, 330, 30, "heart").setScale(0.7);
    this.heart3 = new Items(this, 380, 30, "heart").setScale(0.7);
    this.heart4 = new Items(this, 430, 30, "heart").setScale(0.7);
    this.heart5 = new Items(this, 480, 30, "heart").setScale(0.7);
    this.heart6 = new Items(this, 280, 80, "heart").setScale(0.7);
    this.heart7 = new Items(this, 330, 80, "heart").setScale(0.7);
    this.heart8 = new Items(this, 380, 80, "heart").setScale(0.7);
    this.heart9 = new Items(this, 430, 80, "heart").setScale(0.7);
    this.heart10 = new Items(this, 480, 80, "heart").setScale(0.7);

    this.hearts = [
      this.heart1,
      this.heart2,
      this.heart3,
      this.heart4,
      this.heart5,
      this.heart6,
      this.heart7,
      this.heart8,
      this.heart9,
      this.heart10,
    ];
  }

  handlePlayerHealthChanged() {
    this.hp = store.getState();
    switch (this.hp.hpReducer) {
      case 10:
        this.hearts.forEach((heart) => heart.setVisible(true));
        break;
      case 9: {
        const showHearts = this.hearts.slice(0, 9);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(9);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 8: {
        const showHearts = this.hearts.slice(0, 8);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(8);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 7: {
        const showHearts = this.hearts.slice(0, 7);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(7);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 6: {
        const showHearts = this.hearts.slice(0, 6);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(6);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 5: {
        const showHearts = this.hearts.slice(0, 5);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(5);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 4: {
        const showHearts = this.hearts.slice(0, 4);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(4);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 3: {
        const showHearts = this.hearts.slice(0, 3);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(3);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 2: {
        const showHearts = this.hearts.slice(0, 2);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(2);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 1: {
        const showHearts = this.hearts.slice(0, 1);
        showHearts.forEach((heart) => heart.setVisible(true));
        const hideHearts = this.hearts.slice(1);
        hideHearts.forEach((heart) => heart.setVisible(false));
        break;
      }
      case 0: {
        this.hearts.forEach((heart) => heart.setVisible(false));
        break;
      }
    }
  }
  update() {
    this.handlePlayerHealthChanged();
  }
}
