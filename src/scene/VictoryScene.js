import Phaser from "phaser";
import SceneTransition from "./SceneTransition";

export default class VictoryScene extends SceneTransition {
  constructor() {
    super("VictoryScene");
  }
  preload() {
    this.load.bitmapFont(
      "carrier_command",
      "assets/fonts/carrier_command.png",
      "assets/fonts/carrier_command.xml"
    );
    this.load.image("victoryBackground", "assets/backgrounds/victory.png");
    // Music
    //this.load.audio('music', 'assets/audio/PalletTown.mp3');
  }
  create() {
    super.create();
    // Music
    this.winMusic = this.sound.add("win", { volume: 0.15 }, true);
    this.winMusic.play();

    this.add.image(0, 0, "victoryBackground").setOrigin(0, 0).setScale(2);

    this.title = this.add.bitmapText(234, 50, "carrier_command", "Victory", 40);

    // scene change buttons
    this.homeScreen = this.add.bitmapText(
      73,
      550,
      "carrier_command",
      "Return to Title Screen",
      25
    );
    this.homeScreen.setInteractive({ useHandCursor: true });

    this.homeScreen.on("pointerdown", () => {
      this.winMusic.stop();
      this.scene.transition({
        duration: 1500,
        target: "TitleScene",
      });
    });
  }
}
