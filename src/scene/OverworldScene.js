import Phaser from 'phaser';
import Player from '../entity/Player';

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super('OverworldScene');
  }

  preload() {
    this.load.image('tiles', 'assets/maps/tilemap.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/maps/overworldMap.json');
    //player
    this.load.image('player', 'assets/sprites/sensei.png');
  }
  create() {
    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: 'tilemap' });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage('characters', 'tiles', 16, 16);

    // Layers
    const waterLayer = map.createLayer('Water', tileset, 0, 0);
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const interactiveLayer = map.createLayer('Interactive', tileset, 0, 0);
    const overheadLayer = map.createLayer('Overhead', tileset, 0, 0);

    //Player
    this.player = new Player(this, 200, 200, 'player').setScale(0.75);
    this.cursors = this.input.keyboard.createCursorKeys();

    //Collisions
    waterLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, waterLayer);

    groundLayer.setCollisionFromCollisionGroup({ collide: true });
    this.physics.add.collider(this.player, groundLayer);

    interactiveLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, interactiveLayer);

    this.player.setDepth(0);
    overheadLayer.setDepth(10);

    // Placeholder Camera
    const camera = this.cameras.main;
    camera.setZoom(2);
    camera.startFollow(this.player, true);
  }
  update() {
    this.player.update(this.cursors);
  }
}
