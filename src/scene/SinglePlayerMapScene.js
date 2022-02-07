import Phaser from 'phaser';
import Player from '../entity/Player';
import NPC from '../entity/NPC';
// import Items from "../entity/Items";

export default class SinglePlayerMapScene extends Phaser.Scene {
  constructor() {
    super('SinglePlayerMapScene');
  }
  // init() {
  //   this.items = [];
  //   this.rockCounter = 0;
  //   this.paperCounter = 0;
  //   this.scissorsCounter = 0;
  // }
  preload() {
    this.load.image('tiles', 'assets/maps/tilemap.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/maps/overworldMap.json');
    this.load.spritesheet('character', 'assets/spriteSheets/characters.png', {
      frameWidth: 64,
      frameHeight: 64,
    });
    this.load.spritesheet(
      'npc-character',
      'assets/spriteSheets/characters.png',
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
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

    //Items
    this.load.image('rock', 'assets/sprites/rock.png');
    this.load.image('paper', 'assets/sprites/paper.png');
    this.load.image('scissors', 'assets/sprites/scissors.png');
    // Music
    this.load.audio('Pallet', 'assets/audio/PalletTown.mp3');
    this.load.audio('Walk', 'assets/audio/walk.mp3');
  }
  createAnimations() {
    this.anims.create({
      key: 'runLeft',
      frames: this.anims.generateFrameNumbers('character', {
        start: 0,
        end: 2,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'runRight',
      frames: this.anims.generateFrameNumbers('character', {
        start: 9,
        end: 11,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'runDown',
      frames: this.anims.generateFrameNumbers('character', {
        start: 3,
        end: 5,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'runUp',
      frames: this.anims.generateFrameNumbers('character', {
        start: 6,
        end: 8,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'character', frame: 3 }],
      frameRate: 10,
    });
  }
  create() {
    // Start animations
    this.createAnimations();
    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: 'tilemap' });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage('characters', 'tiles', 16, 16);

    // Layers
    const waterLayer = map.createLayer('Water', tileset, 0, 0);
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const interactiveLayer = map.createLayer('Interactive', tileset, 0, 0);
    const overheadLayer = map.createLayer('Overhead', tileset, 0, 0);

    // Music
    this.bgMusic = this.sound.add('Pallet', { volume: 0.1 }, true);
    this.bgMusic.play();
    this.walkSound = this.sound.add('Walk', { volume: 0.4 });

    //Player
    this.player = new Player(
      this,
      this.data.get('playercordX') || 250,
      this.data.get('playercordY') || 200,
      'character'
    ).setScale(0.25);

    //NPC generation/collision
    const npcLayer = map.getObjectLayer('NPC');
    npcLayer.objects.forEach((npc) => {
      const text = this.add.text(npc.x - 100, npc.y + 100, '', {
        font: '16px Courier',
        fill: '#F0F8FF',
      });
      const newNPC = new NPC(this, npc.x, npc.y, npc.type).setScale(0.25);
      this.physics.add.collider(
        this.player,
        newNPC,
        () => {
          //Dialog
          text.setText(`${npc.name} accepts \n your challenge!!!`);
          text.setDepth(30);

          // this.data.set('playercordX', this.player.x);
          // this.data.set('playercordY', this.player.y);
          // this.scene.start('BattleScene');
          // this.bgMusic.stop();
        },
        null,
        this
      );
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    //Collisions

    groundLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, groundLayer);

    interactiveLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, interactiveLayer);

    this.player.setDepth(0);
    overheadLayer.setDepth(10);

    // Placeholder Camera
    const camera = this.cameras.main;
    camera.setZoom(2);
    camera.startFollow(this.player, true);

    // Inventory
    // this.graphics = this.add.graphics();
    // this.graphics.lineStyle(1);
    // this.graphics.strokeRect(0, 325, 100, 25);

    // for (let i = 0; i < 10; i++) {
    //   let xx = Phaser.Math.Between(100, 200);
    //   let yy = Phaser.Math.Between(0, 400);
    //   this.rock = new Items(this, xx, yy, "rock", i).setScale(0.25);
    //   this.items.push(this.rock);
    //   // console.log("this.items", this.items);

    //   this.physics.add.collider(
    //     this.player,
    //     this.rock,
    //     () => {
    //       this.rockCounter += 1;
    //       this.rock.destroy();

    //       this.rockText.setText("Rock-" + this.rockCounter);
    //     },
    //     null,
    //     this
    //   );
    // }
    // // this.rock = new Items(this, 150, 200, "rock").setScale(0.25);
    // this.paper = new Items(this, 150, 180, "paper").setScale(0.25);
    // this.scissors = new Items(this, 150, 160, "scissors").setScale(0.25);

    // this.rockText = this.add
    //   .text(200, 400, "Rock-0")
    //   .setScrollFactor(0, 0)
    //   .setScale(1);
    // this.paperText = this.add
    //   .text(200, 380, "Paper-0")
    //   .setScrollFactor(0, 0)
    //   .setScale(1);
    // this.scissorsText = this.add
    //   .text(200, 360, "Scissors-0")
    //   .setScrollFactor(0, 0)
    //   .setScale(1);

    // this.rockText.setScrollFactor(100, 100);
    // this.staticRock = this.physics.add
    //   .staticImage(0, 325, "rock")
    //   .setScrollFactor(0, 0);

    // this.physics.add.collider(
    //   this.player,
    //   this.paper,
    //   () => {
    //     this.paper.destroy();

    //     this.paperCounter += 1;
    //     this.paperText.setText("Paper-" + this.paperCounter);
    //   },
    //   null,
    //   this
    // );
    // this.physics.add.collider(
    //   this.player,
    //   this.scissors,
    //   () => {
    //     this.scissors.destroy();

    //     this.scissorsCounter += 1;
    //     this.scissorsText.setText("Scissors-" + this.scissorsCounter);
    //   },
    //   null,
    //   this
    // );
  }
  // createRock(x, y) {
  //   this.rockGroup.create(x, y, "rock");
  // }

  update() {
    this.player.update(this.cursors, this.walkSound);
  }
}
