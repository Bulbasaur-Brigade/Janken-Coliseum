import Phaser from 'phaser';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('VictoryScene');
  }
  preload() {
    this.load.bitmapFont(
      'carrier_command',
      'assets/fonts/carrier_command.png',
      'assets/fonts/carrier_command.xml'
    );
    this.load.image('victoryBackground', 'assets/backgrounds/victory.png');
    // Music
    //this.load.audio('music', 'assets/audio/PalletTown.mp3');
  }
  create() {
    // Music
    // this.titleMusic = this.sound.add('music', { volume: 0.15 }, true);
    // this.titleMusic.play();

    this.add.image(0, 0, 'victoryBackground').setOrigin(0, 0).setScale(2);

    this.title = this.add.bitmapText(
      234,
      50,
      'carrier_command',
      'Victory',
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
      this.scene.start('TitleScene')
    });
  }
}
