import Phaser from "phaser";
// import SceneTransition from "./SceneTransition";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.bitmapFont(
      "carrier_command",
      "assets/fonts/carrier_command.png",
      "assets/fonts/carrier_command.xml"
    );
    this.load.image("background", "assets/backgrounds/background.png");
    // Music
    this.load.audio("music", "assets/audio/PalletTown.mp3");
  }

  create() {
    // super.create();

    // Music
    this.titleMusic = this.sound.add("music", { volume: 0.1 }, true);
    this.titleMusic.play();

    this.add.image(0, -50, "background").setOrigin(0, 0).setScale(0.7);

    this.title = this.add.bitmapText(
      44,
      50,
      "carrier_command",
      "Janken Coliseum",
      40
    );

    // scene change buttons
    this.singlePlayer = this.add.bitmapText(
      207,
      170,
      "carrier_command",
      "Single Player",
      25
    );
    this.singlePlayer.setInteractive({ useHandCursor: true });

    this.multiplayer = this.add.bitmapText(
      237,
      270,
      "carrier_command",
      "Multiplayer",
      25
    );
    this.multiplayer.setInteractive({ useHandCursor: true });

    this.howToPlay = this.add.bitmapText(
      237,
      370,
      "carrier_command",
      "How To Play",
      25
    );
    this.howToPlay.setInteractive({ useHandCursor: true });

    this.about = this.add.bitmapText(326, 470, "carrier_command", "About", 25);
    this.about.setInteractive({ useHandCursor: true });

    this.howToRectangle = this.add.rectangle(400, 1300, 600, 148, 0xfa6900);
    this.howToRectangle.setStrokeStyle(4, 0xffffff);
    this.howToRectangle.setInteractive({ useHandCursor: true });
    this.howToText = this.add.bitmapText(
      115,
      1247,
      "carrier_command",
      "Move with the arrow keys\n\nCollect items to grow in power\n\nPlay rock paper scissors\n\nIf you run out of lives you lose",
      15
    );

    this.aboutRectangle = this.add.rectangle(400, 1300, 675, 148, 0xfa6900);
    this.aboutRectangle.setStrokeStyle(4, 0xffffff);
    this.aboutRectangle.setInteractive({ useHandCursor: true });
    this.aboutText = this.add.bitmapText(
      88,
      1247,
      "carrier_command",
      "A Rock Paper Scissors Battle Royale\n\nMade with Phaser 3\n\nBy Yogesh Bhatt, Hector Carrasco,\n\nSam Greenberg, and Elstan Lewis",
      15
    );

    this.singlePlayer.on("pointerdown", () => {
      this.scene.transition({
        duration: 2500,
        target: "CharPicker",
      });
    });

    this.multiplayer.on("pointerdown", () => {
      this.scene.transition({
        duration: 2500,
        target: "Menu",
      });
    });

    this.howToPlay.on("pointerdown", () => {
      this.howToRectangle.y = 300;
      this.howToText.y = 247;
    });

    this.about.on("pointerdown", () => {
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

    // .on("pointerover", () => this.gameStateText)
    // .on("pointerout", () => this.gameStateText.setStyle({ fill: "#111" }));
  }
}
