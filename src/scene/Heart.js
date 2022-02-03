import Phaser from "phaser";
import Items from "../entity/Items";
import { sceneEvents } from "../Events/EventsCenter";

export default class Heart extends Phaser.Scene {
  constructor() {
    super("Heart");
  }
  preload() {
    // Hearts
    this.load.image("heart", "assets/sprites/heart.png");
    // this.load.image("fullHeart", "assets/sprites/fullHeart.png");
  }
  create() {
    this.playerData = this.registry.get("playerData");
    console.log("playerData", this.playerData);

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
    switch (this.playerData.hp) {
      case 3:
        this.heart1.setVisible(true);
        this.heart2.setVisible(true);
        this.heart3.setVisible(true);
        break;
      case 2:
        this.heart1.setVisible(true);
        this.heart2.setVisible(true);
        this.heart3.setVisible(false);
        break;
      case 1:
        this.heart1.setVisible(true);
        this.heart2.setVisible(false);
        this.heart3.setVisible(false);
        break;
      case 0:
        this.heart1.setVisible(false);
        this.heart2.setVisible(false);
        this.heart3.setVisible(false);
        break;
    }
  }
}
