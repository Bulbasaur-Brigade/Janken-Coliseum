import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }
  preload() {
    //SpriteSheets
    this.load.spritesheet('character', 'assets/spriteSheets/characters.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet('npcSprites', 'assets/spriteSheets/npcSprites.png', {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet('blueBird', 'assets/spriteSheets/blueBird.png', {
      frameWidth: 342,
      frameHeight: 290,
    });

    this.load.spritesheet('greenBird', 'assets/spriteSheets/greenBird.png', {
      frameWidth: 342,
      frameHeight: 290,
    });

    //Player Character
    this.load.image('dave', 'assets/sprites/charPicker/dave.png');
    this.load.image('april', 'assets/sprites/charPicker/april.png');

    this.load.image('background', 'assets/backgrounds/background.png');
    this.load.image('defeatBackground', 'assets/backgrounds/defeat.png');

    // Heart
    this.load.image('heart', 'assets/sprites/heart.png');
    //Inventory
    this.load.image('inventory', 'assets/sprites/inventory.png');
    //Items
    this.load.image('cloud1', 'assets/sprites/cloud1.png');
    this.load.image('cloud2', 'assets/sprites/cloud2.png');
    this.load.image('cloud3', 'assets/sprites/cloud3.png');

    this.load.image('rock', 'assets/sprites/rock.png');
    this.load.image('paper', 'assets/sprites/paper.png');
    this.load.image('scissors', 'assets/sprites/scissors.png');
    this.load.image('heart', 'assets/sprites/heart.png');

    this.load.image('stairsUp', 'assets/sprites/stairsUp.png');
    this.load.image('stairsDown', 'assets/sprites/stairsDown.png');
    this.load.image('blank', 'assets/sprites/blank.png');
    this.load.image('bossroom', 'assets/sprites/blank.png');

    // this.load.image('diamond', 'assets/sprites/diamond.png');
    this.load.audio('loss', 'assets/audio/lossMusic.mp3');
    this.load.audio('win', 'assets/audio/win.mp3');

    this.load.audio('rockPickup', 'assets/audio/rockPickup.mp3');
    this.load.audio('scissorsPickup', 'assets/audio/scissorsPickup.mp3');
    this.load.audio('paperPickup', 'assets/audio/paperPickup.mp3');
    this.load.audio('heartPickup', 'assets/audio/heartPickup.mp3');
    this.load.audio('selectSound', 'assets/audio/selectSound.mp3');
    this.load.audio('music', 'assets/audio/titleScreen.mp3');
    this.load.audio('Pallet', 'assets/audio/PalletTown.mp3');
    this.load.audio('explode', 'assets/audio/explosion.mp3');

    //Font
    this.load.bitmapFont(
      'carrier_command',
      'assets/fonts/carrier_command.png',
      'assets/fonts/carrier_command.xml'
    );

    this.load.image('battleScene', 'assets/backgrounds/battleScene.jpg');

    // Battle Music
    this.load.audio('Battle', 'assets/audio/Battle.mp3');
  }

  create() {
    this.scene.start('TitleScene');
  }
}
