import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }
  preload() {
    //NPC charcters
    this.load.image('sey', 'assets/sprites/npcs/sey.png');
    this.load.image('greg', 'assets/sprites/npcs/greg.png');
    this.load.image('margarita', 'assets/sprites/npcs/margarita.png');
    this.load.image('danny', 'assets/sprites/npcs/danny.png');
    this.load.image('mac', 'assets/sprites/npcs/mac.png');
    this.load.image('savion', 'assets/sprites/npcs/savion.png');
    this.load.image('omar', 'assets/sprites/npcs/omar.png');
    this.load.image('amber', 'assets/sprites/npcs/amber.png');
    this.load.image('devonne', 'assets/sprites/npcs/devonne.png');
    this.load.image('eric', 'assets/sprites/npcs/eric.png');
    this.load.image('zach', 'assets/sprites/npcs/zach.png');
    // Heart
    this.load.image('heart', 'assets/sprites/heart.png');
    //Inventory
    this.load.image('inventory', 'assets/sprites/inventory.png');
    //Items
    this.load.image('rock', 'assets/sprites/rock.png');
    this.load.image('paper', 'assets/sprites/paper.png');
    this.load.image('scissors', 'assets/sprites/scissors.png');
    this.load.image('heart', 'assets/sprites/heart.png');
    this.load.image('diamond', 'assets/sprites/diamond.png');
  }

  create() {
    this.scene.start('TitleScene');
  }
}