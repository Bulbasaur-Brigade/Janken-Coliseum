import Phaser from "phaser";
import store from "../redux/store";
import { pickChar } from "../redux/charReducer";
import SceneTransition from "./SceneTransition";
export default class CharPicker extends SceneTransition {
  constructor() {
    super("CharPicker");
  }
  preload() {
    this.load.image("dave", "assets/sprites/charPicker/dave.png");
    this.load.image("april", "assets/sprites/charPicker/april.png");
    this.load.bitmapFont(
      "carrier_command",
      "assets/fonts/carrier_command.png",
      "assets/fonts/carrier_command.xml"
    );
    this.load.audio('selectSound','assets/audio/selectSound.mp3')
  }
  create() {
    super.create();
    const dave = this.add.sprite(250, 150, "dave").setScale(3);
    const april = this.add.sprite(500, 150, "april").setScale(3);
    this.selectSound = this.sound.add('selectSound',{volume:.1})

    dave.setInteractive({ useHandCursor: true });
    april.setInteractive({ useHandCursor: true });
    this.add.bitmapText(180, 250, "carrier_command", "DAVE", 30);
    this.add.bitmapText(430, 250, "carrier_command", "APRIL", 30);
    this.add.bitmapText(23, 400, "carrier_command", "Select A Character! ", 35);

    dave.on("pointerdown", () => {
      store.dispatch(pickChar("dave"));
      this.selectSound.play()
      this.scene.transition({
        duration: 2500,
        target: "SinglePlayerMapScene",
      });
      const music = this.scene.get("TitleScene");
      music.titleMusic.stop();
    });
    april.on("pointerdown", () => {
      store.dispatch(pickChar("april"));
      this.selectSound.play()
      this.scene.transition({
        duration: 2500,
        target: "SinglePlayerMapScene",
      });
      const music = this.scene.get("TitleScene");
      music.titleMusic.stop();
    });
  }
}
