import Player from '../entity/Player';
import Items from '../entity/Items';
import Phaser from 'phaser';
import NPC from '../entity/NPC';
import SceneTransition from './SceneTransition';
import { addHp, loseHp } from '../redux/hpReducer';
import store from '../redux/store';
import { addNPC, getNPC } from '../redux/npcBoard';
import { createCharacterAnims } from '../anims/CharacterAnims';
export default class SinglePlayerMapScene extends Phaser.Scene {
  constructor() {
    super('SinglePlayerMapScene');
    this.npcsArr = [];
  }

  destroyNPC() {
    const currentNPCS = store.getState();
    const storeNPCS = currentNPCS.npcBoardReducer.npcs;
    if (storeNPCS.every((npc) => npc.defeated)) {
      this.scene.stop("Heart");
      this.scene.stop("Inventory");
      this.scene.stop("QuestUi");
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
    this.load.image("tiles", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("tilemap", "assets/maps/overworldMap.json");

    // this.load.spritesheet(
    //   "npc-character",
    //   "assets/spriteSheets/characters.png",
    //   {
    //     frameWidth: 64,
    //     frameHeight: 64,
    //   }
    // );

    //Dialog Data
    this.load.json('speech', 'assets/speech/npcSpeech.json');

    // Music
    this.load.audio('Pallet', 'assets/audio/PalletTown.mp3');
  }

  create() {
    // Inventory
    // super.create();
    this.scene.run('QuestUi');
    this.scene.run('Inventory');
    this.scene.run('Heart');

    this.inventory = this.scene.get('Inventory');

    // Start animations
    createCharacterAnims(this.anims);
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
    // npcLayer.setCollisionByProperty({ collide: true });
    npcLayer.objects.forEach((npc) => {
      const newNPC = new NPC(this, npc.x, npc.y, npc.type).setScale(0.25);
      this.npcsArr.push(newNPC);

      store.dispatch(addNPC({ name: npc.type, defeated: newNPC.isDefeated }));

      const npcData = store.getState();

      this.dialogbox = this.add
        .graphics()
        .fillStyle(0xfffaf0, 1)
        .fillRoundedRect(npc.x - 8, npc.y - 80, 120, 60, 16)
        .setDepth(20);

      this.dialogText = this.add
        .text(npc.x, npc.y - 70, this.speechData[npc.type], {
          font: "10px Arial",
          fill: "#000000",
          wordWrap: { width: 120 - 2 * 2 },
        })
        .setDepth(20);
      this.dialogTextName = this.add
        .text(npc.x + 20, npc.y - 80, npc.type.toUpperCase(), {
          font: "9px",
          fill: "#000000",
        })
        .setDepth(20);

      this.yesRec = this.add
        .rectangle(npc.x + 30, npc.y - 30, 20, 10, 0x000000)
        .setDepth(20);
      this.yesButton = this.add
        .text(npc.x + 23, npc.y - 35, "Yes", {
          font: "9px",
          fill: "#FFFAF0",
        })
        .setInteractive({ useHandCursor: true })
        .setVisible(true)
        .setDepth(25);
      this.noRec = this.add
        .rectangle(npc.x + 60, npc.y - 30, 20, 10, 0x000000)
        .setDepth(20);
      this.noButton = this.add
        .text(npc.x + 55, npc.y - 35, "No", {
          font: "9px",
          fill: "#FFFAF0",
        })
        .setInteractive({ useHandCursor: true })
        .setVisible(true)
        .setDepth(25);

      this.data.set("playercordX", this.player.x);
      this.data.set("playercordY", this.player.y);
      this.yesButton.on("pointerdown", () => {
        dialogArr.forEach((item) => {
          item.setVisible(false);
        });
        newNPC.enableBody();
        this.scene.stop("QuestUi");
        this.scene.switch("BattleScene");
        this.bgMusic.stop();
      });
      const dialogArr = [
        this.yesRec,
        this.yesButton,
        this.noRec,
        this.noButton,
        this.dialogbox,
        this.dialogText,
        this.dialogTextName,
      ];
      dialogArr.forEach((item) => {
        item.setVisible(false);
      });
      this.noButton.on("pointerdown", () => {
        dialogArr.forEach((item) => {
          item.setVisible(false);
          newNPC.enableBody();
        });
      });
      this.physics.add.collider(
        this.player,
        newNPC,
        (player, currentNPC) => {
          store.dispatch(getNPC(currentNPC.texture.key));
          newNPC.disableBody();
          dialogArr.forEach((item) => {
            item.setVisible(true);
          });
          this.time.delayedCall(5000, () => {
            dialogArr.forEach((item) => {
              item.setVisible(false);
              if (newNPC) {
                newNPC.enableBody();
              }
            });
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

    //Collisions

    groundLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, groundLayer);

    interactiveLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, interactiveLayer);
    this.player.setDepth(0);
    overheadLayer.setDepth(10);

    // Placeholder Camera
    const camera = this.cameras.main;
    camera.setZoom(2.5);
    camera.startFollow(this.player, true);

    // WASD KEYS FOR MOVEMENT
    this.keys = this.input.keyboard.addKeys('W,S,A,D');
  }

  update() {
    this.player.update(this.keys);
    this.destroyNPC();
  }
}
