import Phaser from "phaser";
import store from "../redux/store";

export default class QuestUi extends Phaser.Scene {
  constructor() {
    super("QuestUi");
  }
  init() {
    const data = store.getState();
    this.npcNames = data.npcBoardReducer.npcs;
  }
  preload() {
    this.load.image("quest", "assets/sprites/quest.png");
    this.load.image("tracker", "assets/sprites/tracker.png");
    this.load.image("check", "assets/sprites/check.png");
  }
  showCheckMark() {
    for (let i = 0; i < this.npcNames.length; i++) {
      if (this.npcNames[i].defeated === true) {
        let checkArr = this.checkMarkGroup.getChildren();
        if (this.tracker.visible) checkArr[i].setVisible(true);
        else {
          checkArr[i].setVisible(false);
        }
      }
    }
  }
  create() {
    this.tracker = this.add
      .image(685, 185, "tracker")
      .setInteractive({ useHandCursor: true })
      .setScale(0.55, 0.64)
      .setVisible(false)
      .setAlpha(0.8);
    this.questMark = this.add
      .image(790, 20, "quest")
      .setInteractive({ useHandCursor: true });
    this.checkMarkGroup = this.add.group();
    this.textGroup = this.add.group();

    for (let i = 0; i < this.npcNames.length; i++) {
      this.checkMarkGroup.add(
        this.add
          .image(607, 27 + i * 31, "check")
          .setScale(0.02)
          .setVisible(false)
      );

      this.textGroup.add(
        this.add.text(
          655,
          20 + i * 31,
          `${this.npcNames[i].name.toUpperCase()}`,
          {
            font: "17px Arial",
          }
        )
      );
    }
    this.textGroup.setVisible(false);

    this.questMark.on("pointerdown", () => {
      this.questMark.setVisible(false);
      this.textGroup.setVisible(true);
      this.tracker.setVisible(true);
    });
    this.tracker.on("pointerdown", () => {
      this.tracker.setVisible(false);
      this.questMark.setVisible(true);
      this.textGroup.setVisible(false);
    });
  }
  update() {
    this.showCheckMark();
  }
}
