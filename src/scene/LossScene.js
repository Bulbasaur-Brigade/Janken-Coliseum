import Phaser from 'phaser';
import SceneTransition from './SceneTransition';

export default class LossScene extends Phaser.Scene {
  constructor() {
    super('LossScene');
  }
  preload() {
    this.load.bitmapFont(
      'carrier_command',
      'assets/fonts/carrier_command.png',
      'assets/fonts/carrier_command.xml'
    );
    this.load.image('defeatBackground', 'assets/backgrounds/defeat.png');
    // Music
    //this.load.audio('music', 'assets/audio/PalletTown.mp3');
  }
  create() {
    // super.create();
    // Music
    // this.titleMusic = this.sound.add('music', { volume: 0.15 }, true);
    // this.titleMusic.play();

    this.add.image(0, 0, 'defeatBackground').setOrigin(0, 0).setScale(1.9);

    this.title = this.add.bitmapText(
      257,
      50,
      'carrier_command',
      'Defeat',
      40
    );

    // scene change buttons
    this.homeScreen = this.add.bitmapText(
      73,
      550,
      'carrier_command',
      'Return to Title Screen',
      25
    );
    this.homeScreen.setInteractive({ useHandCursor: true });

    this.homeScreen.on('pointerdown', () => {
      this.scene.transition({
        duration: 2500,
        target: 'TitleScene'
      });
    });
  }
}
