import Phaser from "phaser";
import Items from "../entity/Items";
import { sceneEvents } from "../Events/EventsCenter";

export default class Heart extends Phaser.Scene {
  constructor() {
    super("Heart");
    this.hearts = Phaser.GameObjects.Group;
  }
  preload() {
    // Hearts
    this.load.image("heart", "assets/sprites/heart.png");
    // this.load.image("fullHeart", "assets/sprites/fullHeart.png");
  }
  create() {
    this.playerData = this.registry.get("playerData");

    this.heart1 = new Items(this, 330, 30, "heart").setScale(0.7);
    this.heart2 = new Items(this, 380, 30, "heart").setScale(0.7);
    this.heart3 = new Items(this, 430, 30, "heart").setScale(0.7);

    sceneEvents.on(
      "player-health-changed",
      this.handlePlayerHealthChanged,
      this
    );
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(
        "player-health-changed",
        this.handlePlayerHealthChanged,
        this
      );
    });
  }
  handlePlayerHealthChanged() {
    if (this.playerData.hp === 3) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(true);
    }
    if (this.playerData.hp === 2) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(true);
      this.heart3.setVisible(false);
    }
    if (this.playerData.hp === 1) {
      this.heart1.setVisible(true);
      this.heart2.setVisible(false);
      this.heart3.setVisible(false);
    }
    if (this.playerData.hp === 0) {
      this.heart1.setVisible(false);
      this.heart2.setVisible(false);
      this.heart3.setVisible(false);
    }
  }
}
