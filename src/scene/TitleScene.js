import Phaser from "phaser";
import { resetHp } from "../redux/hpReducer";
import SceneTransition from "./SceneTransition";
import store from "../redux/store";
import { resetChar } from "../redux/charReducer";
import { resetItem } from "../redux/inventoryReducer";
import { resetNPC } from "../redux/npcBoard";
import { resetScene } from "../redux/sceneReducer";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    // Music
    this.scene.run("FullScreen");
    this.titleMusic = this.sound.add("music", { volume: 0.15, loop: true });
    this.titleMusic.play();

    this.selectSound = this.sound.add("selectSound", { volume: 0.06 });

    this.add.image(0, -50, "background").setOrigin(0, 0).setScale(0.7);

    this.titleBorder = this.add.rectangle(400, 70, 750, 80, 0x520075);
    this.titleBorder.setDepth(2);
    this.titleBorder.setStrokeStyle(4, 0xffffff);

    this.title = this.add.bitmapText(
      44,
      50,
      "carrier_command",
      "Janken Coliseum",
      40
    );
    this.title.setDepth(2);

    // scene change buttons
    this.singlePlayerBorder = this.add.rectangle(400, 183, 430, 60, 0x520075);
    this.singlePlayerBorder.visible = false;
    this.singlePlayerBorder.setDepth(2);
    this.singlePlayerBorder.setStrokeStyle(4, 0xffffff);
    this.multiplayerBorder = this.add.rectangle(400, 283, 380, 60, 0x520075);
    this.multiplayerBorder.visible = false;
    this.multiplayerBorder.setDepth(2);
    this.multiplayerBorder.setStrokeStyle(4, 0xffffff);
    this.howToPlayBorder = this.add.rectangle(400, 383, 380, 60, 0x520075);
    this.howToPlayBorder.visible = false;
    this.howToPlayBorder.setDepth(2);
    this.howToPlayBorder.setStrokeStyle(4, 0xffffff);
    this.aboutBorder = this.add.rectangle(400, 483, 180, 60, 0x520075);
    this.aboutBorder.visible = false;
    this.aboutBorder.setDepth(2);
    this.aboutBorder.setStrokeStyle(4, 0xffffff);

    this.singlePlayer = this.add.bitmapText(
      207,
      170,
      "carrier_command",
      "Single Player",
      25
    );
    this.singlePlayer.setInteractive({ useHandCursor: true });
    this.singlePlayer.setDepth(2);

    this.singlePlayer.on(
      "pointerover",
      function (pointer) {
        this.singlePlayerBorder.visible = true;
      },
      this
    );

    this.singlePlayer.on(
      "pointerout",
      function (pointer) {
        this.singlePlayerBorder.visible = false;
      },
      this
    );

    this.multiplayer = this.add.bitmapText(
      237,
      270,
      "carrier_command",
      "Multiplayer",
      25
    );
    this.multiplayer.setInteractive({ useHandCursor: true });
    this.multiplayer.setDepth(2);

    this.multiplayer.on(
      "pointerover",
      function (pointer) {
        this.multiplayerBorder.visible = true;
      },
      this
    );

    this.multiplayer.on(
      "pointerout",
      function (pointer) {
        this.multiplayerBorder.visible = false;
      },
      this
    );

    this.howToPlay = this.add.bitmapText(
      237,
      370,
      "carrier_command",
      "How To Play",
      25
    );
    this.howToPlay.setInteractive({ useHandCursor: true });
    this.howToPlay.setDepth(2);

    this.howToPlay.on(
      "pointerover",
      function (pointer) {
        this.howToPlayBorder.visible = true;
      },
      this
    );

    this.howToPlay.on(
      "pointerout",
      function (pointer) {
        this.howToPlayBorder.visible = false;
      },
      this
    );

    this.about = this.add.bitmapText(326, 470, "carrier_command", "About", 25);
    this.about.setInteractive({ useHandCursor: true });
    this.about.setDepth(2);

    this.about.on(
      "pointerover",
      function (pointer) {
        this.aboutBorder.visible = true;
      },
      this
    );

    this.about.on(
      "pointerout",
      function (pointer) {
        this.aboutBorder.visible = false;
      },
      this
    );

    this.howToRectangle = this.add.rectangle(400, 1300, 600, 148, 0x520075);
    this.howToRectangle.setStrokeStyle(4, 0xffffff);
    this.howToRectangle.setInteractive({ useHandCursor: true });
    this.howToRectangle.setDepth(3);
    this.howToText = this.add.bitmapText(
      115,
      1247,
      "carrier_command",
      "Move with the WASD keys\n\nCollect items to grow in power\n\nPlay rock paper scissors\n\nIf you run out of lives you lose",
      15
    );
    this.howToText.setDepth(3);

    this.aboutRectangle = this.add.rectangle(400, 1300, 675, 148, 0x520075);
    this.aboutRectangle.setStrokeStyle(4, 0xffffff);
    this.aboutRectangle.setInteractive({ useHandCursor: true });
    this.aboutRectangle.setDepth(4);
    this.aboutText = this.add.bitmapText(
      88,
      1247,
      "carrier_command",
      "A Rock Paper Scissors Battle Royale\n\nMade with Phaser 3\n\nBy Yogesh Bhatt, Hector Carrasco,\n\nSam Greenberg, and Elstan Lewis",
      15
    );
    this.aboutText.setDepth(4);

    this.singlePlayer.on("pointerdown", () => {
      store.dispatch(resetScene());
      store.dispatch(resetHp());
      store.dispatch(resetChar());
      store.dispatch(resetItem());
      store.dispatch(resetNPC());
      this.selectSound.play();
      this.scene.transition({
        duration: 2500,
        target: "CharPicker",
      });
    });

    // this.multiplayer.on("pointerdown", () => {
    //   this.scene.transition({
    //     duration: 2500,
    //     target: "MultiPlayerMapScene",
    //   });
    // });

    this.howToPlay.on("pointerdown", () => {
      this.selectSound.play();
      this.howToRectangle.y = 300;
      this.howToText.y = 247;
    });

    this.about.on("pointerdown", () => {
      this.selectSound.play();
      this.aboutRectangle.y = 300;
      this.aboutText.y = 247;
    });

    this.howToRectangle.on("pointerdown", () => {
      this.howToRectangle.y = 1300;
      this.howToText.y = 1247;
    });

    this.aboutRectangle.on("pointerdown", () => {
      this.aboutRectangle.y = 1300;
      this.aboutText.y = 1247;
    });

    // this.input.keyboard.on("keydown-L", () => {
    //   this.scene.transition({
    //     duration: 2500,
    //     target: "LossScene",
    //   });
    // });

    // this.input.keyboard.on("keydown-V", () => {
    //   this.scene.transition({
    //     duration: 2500,
    //     target: "VictoryScene",
    //   });
    // });

    // .on("pointerover", () => this.gameStateText)
    // .on("pointerout", () => this.gameStateText.setStyle({ fill: "#111" }));
  }

  update() {
    let randomEvent = Phaser.Math.RND.integerInRange(0, 180);
    if (randomEvent == 1) {
      this.physicsImage = this.physics.add.image(
        Phaser.Math.RND.integerInRange(100, 700),
        -100,
        "rock"
      );
      this.physicsImage.setVelocity(
        Phaser.Math.RND.integerInRange(-300, 300),
        300
      );
      this.physicsImage.setRotation(Phaser.Math.RND.integerInRange(0, 360));
    }
    if (randomEvent == 2) {
      this.physicsImage = this.physics.add.image(
        Phaser.Math.RND.integerInRange(100, 700),
        -100,
        "paper"
      );
      this.physicsImage.setVelocity(
        Phaser.Math.RND.integerInRange(-300, 300),
        300
      );
      this.physicsImage.setRotation(Phaser.Math.RND.integerInRange(0, 360));
    }
    if (randomEvent == 3) {
      this.physicsImage = this.physics.add.image(
        Phaser.Math.RND.integerInRange(100, 700),
        -100,
        "scissors"
      );
      this.physicsImage.setVelocity(
        Phaser.Math.RND.integerInRange(-300, 300),
        300
      );
      this.physicsImage.setRotation(Phaser.Math.RND.integerInRange(0, 360));
    }
  }
}
