import Phaser from "phaser";
import { createCharacterAnims } from "../anims/CharacterAnims";

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
    createCharacterAnims(this.anims);

    this.selectSound = this.sound.add("selectSound", { volume: 0.06 });

    this.tracker = this.add
      .image(685, 185, "tracker")
      .setInteractive({ useHandCursor: true })
      .setScale(0.55, 0.64)
      .setVisible(false)
      .setAlpha(0.8);
    this.questMark = this.add
      .sprite(780, 25, "mark")
      .setInteractive({ useHandCursor: true })
      .setScale(1.2);

    this.checkMarkGroup = this.add.group();
    this.textGroup = this.add.group();
    this.questMark.play("mark");

    this.text0 = this.add.text(635, 20, "OMAR");
    this.text1 = this.add.text(635, 51, "ZACH");
    this.text2 = this.add.text(635, 82, "MAC");
    this.text3 = this.add.text(635, 113, "SAVION");
    this.text4 = this.add.text(635, 144, "MARGARITA");
    this.text5 = this.add.text(635, 175, "GREG");
    this.text6 = this.add.text(635, 206, "SEY");
    this.text7 = this.add.text(635, 237, "AMBER");
    this.text8 = this.add.text(635, 268, "DEVONNE");
    this.text9 = this.add.text(635, 299, "ERIC");
    this.text10 = this.add.text(635, 330, "DANNY");

    this.loc0 = this.add.text(725, 20, "***");
    this.loc1 = this.add.text(725, 51, "***");
    this.loc2 = this.add.text(725, 82, "***");
    this.loc3 = this.add.text(725, 113, "↓");
    this.loc4 = this.add.text(725, 144, "↓");
    this.loc5 = this.add.text(725, 175, "→");
    this.loc6 = this.add.text(725, 206, "↗");
    this.loc7 = this.add.text(725, 237, "↙ ");
    this.loc8 = this.add.text(725, 268, "←");
    this.loc9 = this.add.text(725, 299, "↑");
    this.loc10 = this.add.text(725, 330, "↘");

    this.textGroup = [
      this.text0,
      this.text1,
      this.text2,
      this.text3,
      this.text4,
      this.text5,
      this.text6,
      this.text7,
      this.text8,
      this.text9,
      this.text10,
    ];
    this.locGroup = [
      this.loc0,
      this.loc1,
      this.loc2,
      this.loc3,
      this.loc4,
      this.loc5,
      this.loc6,
      this.loc7,
      this.loc8,
      this.loc9,
      this.loc10,
    ];

    this.textGroup.forEach((item) => {
      item.setVisible(false);
      // item.setResolution(20);
    });

    this.locGroup.forEach((item) => {
      item.setVisible(false);
      // item.setResolution(20);
    });

    for (let i = 0; i < this.npcNames.length; i++) {
      this.checkMarkGroup.add(
        this.add
          .image(607, 27 + i * 31, "check")
          .setScale(0.02)
          .setVisible(false)
      );
    }
    //   this.textGroup.add(
    //     this.add.text(
    //       635,
    //       20 + i * 31,
    //       `${this.npcNames[i].name.toUpperCase()}`,
    //       {
    //         font: "17px Arial",
    //       }
    //     )
    //   );
    // }

    // this.textGroup.setVisible(false);

    this.questMark.on("pointerdown", () => {
      this.selectSound.play();
      this.questMark.setVisible(false);
      // this.textGroup.setVisible(true);
      this.tracker.setVisible(true);
      this.textGroup.forEach((item) => {
        item.setVisible(true);
        // item.setResolution(10);
      });
      this.locGroup.forEach((item) => {
        item.setVisible(true);
        // item.setResolution(10);
      });
    });
    this.tracker.on("pointerdown", () => {
      this.selectSound.play();
      this.questMark.setVisible(true);
      this.tracker.setVisible(false);
      this.textGroup.forEach((item) => {
        item.setVisible(false);
        // item.setResolution(10);
      });
      this.locGroup.forEach((item) => {
        item.setVisible(false);
        // item.setResolution(10);
      });
      // this.textGroup.setVisible(false);
    });
  }
  update() {
    this.showCheckMark();
  }
}
