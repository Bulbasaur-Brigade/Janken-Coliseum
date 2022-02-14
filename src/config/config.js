
import BattleScene from "../scene/BattleScene";
import SinglePlayerMapScene from "../scene/SinglePlayerMapScene";
import TitleScene from "../scene/TitleScene";
import LossScene from "../scene/LossScene";
import MultiPlayerMapScene from "../scene/MultiPlayerMapScene";
import Heart from "../scene/Heart";
import Inventory from "../scene/Inventory";
import NpcHearts from "../scene/NpcHearts";
import SceneTransition from "../scene/SceneTransition";
import VictoryScene from "../scene/VictoryScene";
import Preloader from "../scene/Preloader";
import CharPicker from "../scene/CharPicker";
import QuestUi from "../scene/QuestUI";
import RoomOne from "../scene/rooms/RoomOne";
import RoomTwo from "../scene/rooms/RoomTwo";
import RoomThree from "../scene/rooms/RoomThree";
import FullScreen from "../scene/FullScreen";


export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine

  render: {
    pixelArt: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },

  scale: {
    parent: 'content',
    autoCenter: true,
    width: 800, // Game width in pixels
    height: 600, // Game height in pixels
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,

  },
  parent: 'content',

  dom: {
    createContainer: true,
  },
  scene: [
    Preloader,
    SceneTransition,
    TitleScene,

    CharPicker,
    // MultiPlayerMapScene,
    SinglePlayerMapScene,
    BattleScene,
    RoomOne,
    RoomTwo,
    RoomThree,
    QuestUi,

    Inventory,
    Heart,
    NpcHearts,
    LossScene,
    VictoryScene,
    FullScreen,
  ],
};
