import Phaser from "phaser";
import BattleScene from "../scene/BattleScene";
import SinglePlayerMapScene from "../scene/SinglePlayerMapScene";
import TitleScene from "../scene/TitleScene";
import Menu from "../scene/Menu";
import LossScene from "../scene/LossScene";
import MultiPlayerMapScene from "../scene/MultiPlayerMapScene";
import Heart from "../scene/Heart";
import Inventory from "../scene/Inventory";
import NpcHearts from "../scene/NpcHearts";
import SceneTransition from "../scene/SceneTransition";
import VictoryScene from "../scene/VictoryScene";
import CharPicker from "../scene/CharPicker";


export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine
  width: 800, // Game width in pixels
  height: 600, // Game height in pixels

  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },

  parent: 'content',
  dom: {
    createContainer: true,
  },
  scene: [
    // SceneTransition,
    // Instructions,
    TitleScene,
    CharPicker,
    Menu,

    // Menu,
    MultiPlayerMapScene,
    SinglePlayerMapScene,
    BattleScene,
    Inventory,
    Heart,
    NpcHearts,
    LossScene,
    VictoryScene,
  ],
};
