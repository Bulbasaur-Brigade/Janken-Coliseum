import Phaser from 'phaser';
import BattleScene from '../scene/BattleScene';
import SinglePlayerMapScene from '../scene/SinglePlayerMapScene';
import TitleScene from '../scene/TitleScene';
import LossScene from '../scene/LossScene';
import MultiPlayerMapScene from '../scene/MultiPlayerMapScene';
import Heart from '../scene/Heart';
import Inventory from '../scene/Inventory';
import NpcHearts from '../scene/NpcHearts';
import SceneTransition from '../scene/SceneTransition';
import VictoryScene from '../scene/VictoryScene';
import Preloader from '../scene/Preloader';
import CharPicker from '../scene/CharPicker';
import QuestUi from '../scene/QuestUI';

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

  scale: {
    parent: "content",
    autoCenter: true,
  },
  parent: "content",

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
    QuestUi,
    BattleScene,
    Inventory,
    Heart,
    NpcHearts,
    LossScene,
    VictoryScene,
  ],
};
