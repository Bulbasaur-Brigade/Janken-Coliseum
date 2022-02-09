import Player from '../entity/Player';
import Items from '../entity/Items';
import Phaser from 'phaser';
// import SceneTransition from "./SceneTransition";
import NPC from '../entity/NPC';
import SceneTransition from './SceneTransition';
import { addHp, loseHp } from '../redux/hpReducer';
import store from '../redux/store';
import Heart from './Heart';
import { addNPC, getNPC } from '../redux/npcBoard';

export default class SinglePlayerMapScene extends SceneTransition {
  // export default class SinglePlayerMapScene extends SceneTransition {
  constructor() {
    super('SinglePlayerMapScene');
    this.npcsArr = [];
  }

  destroyNPC() {
    const currentNPCS = store.getState();
    const storeNPCS = currentNPCS.npcBoardReducer.npcs;
    if (storeNPCS.every((npc) => npc.defeated)) {
      this.scene.stop('Heart');
      this.scene.stop('Inventory');
      this.scene.stop();
      this.scene.start('VictoryScene');
    }
    storeNPCS.forEach((npc) => {
      if (npc.defeated) {
        this.npcsArr.forEach((sprite) => {
          if (npc.name === sprite.texture.key) sprite.destroy();
        });
      }
    });
  }

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
    //Dialog Data
    this.load.json('speech', 'assets/speech/npcSpeech.json');
    // Music
    this.load.audio('Pallet', 'assets/audio/PalletTown.mp3');
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
    this.anims.create({
      key: 'runLeftApril',
      frames: this.anims.generateFrameNumbers('character', {
        start: 60,
        end: 62,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'runRightApril',
      frames: this.anims.generateFrameNumbers('character', {
        start: 69,
        end: 71,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'runDownApril',
      frames: this.anims.generateFrameNumbers('character', {
        start: 63,
        end: 65,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: 'runUpApril',
      frames: this.anims.generateFrameNumbers('character', {
        start: 66,
        end: 68,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: 'idleApril',
      frames: [{ key: 'character', frame: 63 }],
      frameRate: 10,
    });
  }

  create() {
    // Inventory
    // this.scene.run("QuestUi");
    this.scene.run('Inventory');
    this.scene.run('Heart');

    this.inventory = this.scene.get('Inventory');

    super.create();

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

    //Player
    // this.time.delayedCall(3000,()=>{})
    this.player = new Player(
      this,
      this.data.get('playercordX') || 250,
      this.data.get('playercordY') || 200,
      'character'
    ).setScale(0.25);

    //NPC generation/collision
    this.speechData = this.cache.json.get('speech');

    const npcLayer = map.getObjectLayer('NPC');

    npcLayer.objects.forEach((npc) => {
      const newNPC = new NPC(this, npc.x, npc.y, npc.type).setScale(0.25);
      this.npcsArr.push(newNPC);
      store.dispatch(addNPC({ name: npc.type, defeated: newNPC.isDefeated }));
      const npcData = store.getState();
      this.physics.add.collider(
        this.player,
        newNPC,
        (player, currentNPC) => {
          //Dialog
          newNPC.createSpeechBubble(
            npc.x,
            npc.y,
            125,
            50,
            this.speechData[npc.type],
            npc.type
          );
          store.dispatch(getNPC(currentNPC.texture.key));

          this.data.set('playercordX', this.player.x);
          this.data.set('playercordY', this.player.y);
          this.time.delayedCall(4000, () => {
            // text.setText('');
            this.scene.switch('BattleScene');
            this.bgMusic.stop();
          });
        },
        null,
        this
      );
    });

    //Item randomized/overlaps
    const itemLayer = map.getObjectLayer('ItemSpawns');
    const itemArray = ['rock', 'paper', 'scissors', 'heart', ''];
    itemLayer.objects.forEach((item) => {
      const randomItem =
        itemArray[Math.floor(Math.random() * itemArray.length)];
      if (randomItem) {
        item.name = randomItem;
        const newItem = new Items(this, item.x, item.y, item.name).setScale(
          0.25
        );
        this.physics.add.collider(
          this.player,
          newItem,
          (player, item) => {
            this.inventory.addItem(item.texture.key);

            if (item.texture.key === 'heart') {
              store.dispatch(addHp(1));
            }
            item.destroy();
          },
          null,
          this
        );
      }
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

    // WASD KEYS FOR MOVEMENT
    this.keys = this.input.keyboard.addKeys('W,S,A,D');
  }

  update() {
    this.player.update(this.keys);
    this.destroyNPC();
  }
}
