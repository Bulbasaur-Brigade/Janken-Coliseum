import Phaser from "phaser";

export default class QuestUi extends Phaser.Scene {
  constructor() {
    super("QuestUi");
  }
  preload() {
    this.load.image("quest", "assets/sprites/quest.png");
    this.load.image("tracker", "assets/sprites/tracker.png");
  }
  create() {
    this.quest = this.add.image(100, 100, "quest");
    this.tracker = this.add.image(200, 100, "tracker");
  }
}
