import Phaser from 'phaser';
import OverworldScene from '../scene/OverworldScene';
import StartScene from '../scene/StartScene';

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
      debug: true,
    },
  },
  scene: [StartScene, OverworldScene],
};
