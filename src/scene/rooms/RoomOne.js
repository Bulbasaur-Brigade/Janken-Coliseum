import Phaser from 'phaser';
import Player from '../../entity/Player';
import { createCharacterAnims } from '../../anims/CharacterAnims';
import { createNpcAnims } from '../../anims/NpcAnims';
import NPC from '../../entity/NPC';
import Items from '../../entity/Items';
import store from '../../redux/store';
import { getNPC, doorOpen } from '../../redux/npcBoard';
import { setScene } from '../../redux/sceneReducer';

export default class RoomOne extends Phaser.Scene {
  constructor() {
    super('RoomOne');
    this.mac = [];
  }
  npcDefeatListener() {
    const data = store.getState();
    const storeNPCS = data.npcBoardReducer.npcs;

    if (storeNPCS.every((npc) => npc.defeated)) {
      this.scene.stop('Heart');
      this.scene.stop('Inventory');
      this.scene.stop('QuestUi');
      this.scene.stop();
      this.scene.start('VictoryScene');
      // "Congratulations!!!\n\nYou conquered FullStack!\n\nYou're ready to graduate",
    }
  }
  preload() {
    this.load.image('roomOne', 'assets/maps/tilemap.png');
    this.load.tilemapTiledJSON('roomOneMap', 'assets/maps/roomOne.json');

    // Music
    this.load.audio('Pallet', 'assets/audio/PalletTown.mp3');
  }

  create() {
    // Setting the scene in redux
    store.dispatch(setScene('RoomOne'));

    this.doorRoomOne = this.physics.add
      .sprite(160, 263, 'blank')
      .setDepth(50)
      .setVisible(false)
      .setImmovable(true);

    createCharacterAnims(this.anims);
    createNpcAnims(this.anims, 'mac');
    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: 'roomOneMap' });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage('tilemap', 'roomOne', 16, 16);

    const roomOneLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);
    //NPC generation/collision
    this.speechData = this.cache.json.get('speech');

    // SOUND
    this.selectSound = this.sound.add('selectSound', { volume: 0.06 });

    this.player = new Player(
      this,
      this.data.get('playercordX') || 160,
      this.data.get('playercordY') || 245,
      'character'
    ).setScale(0.25);

    const objectsLayer = map.getObjectLayer('Objects');

    objectsLayer.objects.forEach((object) => {
      if (object.name === 'mac') {
        const newNPC = new NPC(
          this,
          object.x,
          object.y,
          'npcSprites',
          object.name
        ).setScale(0.25);
        this.mac.push(newNPC);
        // !!!!!!!!!!!!!!!!!!
        this.dialogbox = this.add
          .image(this.player.x + 265, this.player.y + 125, 'dialogBox')
          .setDepth(20)
          .setScale(0.1, 0.1);
        this.dialogbox.tint = 0xb2560d;

        this.dialogSprite = this.add
          .sprite(this.player.x + 215, this.player.y + 127, object.name)
          .setScale(0.3)
          .setDepth(20);

        this.dialogText = this.add
          .text(
            this.player.x + 230,
            this.player.y + 112,
            this.speechData[object.name][0],
            {
              font: '7px Arial',
              fill: '#000000',
              wordWrap: { width: 120 - 2 * 2 },
            }
          )
          .setDepth(20)
          .setResolution(10);

        this.defeatedDialogText = this.add
          .text(
            this.player.x + 230,
            this.player.y + 112,
            this.speechData[object.name][1],
            {
              font: '7px Arial',
              fill: '#000000',
              wordWrap: { width: 120 - 2 * 2 },
            }
          )
          .setDepth(20)
          .setResolution(10);

        this.dialogTextName = this.add
          .text(
            this.dialogSprite.x - 10,
            this.dialogSprite.y - 20,
            object.name.toUpperCase(),
            {
              font: '9px Arial',
              fill: '#000000',
            }
          )
          .setDepth(20)
          .setResolution(10);

        this.yesRec = this.add
          .rectangle(this.player.x + 250, this.player.y + 136, 39, 10, 0x5e4040)
          .setDepth(20);
        this.yesButton = this.add
          .text(this.yesRec.x - 15, this.yesRec.y - 6, 'Battle', {
            font: '9px',
            fill: '#FFFAF0',
          })
          .setInteractive({ useHandCursor: true })
          .setVisible(true)
          .setDepth(25)
          .setResolution(10);

        this.noRec = this.add
          .rectangle(this.player.x + 320, this.player.y + 136, 20, 10, 0x5e4040)
          .setDepth(20);

        this.noButton = this.add
          .text(this.noRec.x - 5, this.noRec.y + -6, 'No', {
            font: '9px',
            fill: '#FFFAF0',
          })
          .setInteractive({ useHandCursor: true })
          .setVisible(true)
          .setDepth(25)
          .setResolution(10);

        this.data.set('playercordX', this.player.x);
        this.data.set('playercordY', this.player.y);

        const dialogArr = [
          this.yesRec,
          this.yesButton,
          this.noRec,
          this.noButton,
          this.dialogbox,
          this.dialogText,
          this.defeatedDialogText,
          this.dialogTextName,
          this.dialogSprite,
        ];
        dialogArr.forEach((item) => {
          item.setAlpha(0.8);
          item.setScrollFactor(0, 0);
          item.setVisible(false);
        });

        this.yesButton.on('pointerdown', () => {
          dialogArr.forEach((item) => {
            item.setAlpha(0.8);
            item.setScrollFactor(0, 0);
            item.setVisible(false);
          });
          newNPC.enableBody();
          this.selectSound.play();
          this.scene.stop('QuestUi');
          this.scene.switch('BattleScene');
          this.music = this.scene.get('SinglePlayerMapScene');
          this.music.bgMusic.stop();
        });

        this.noButton.on('pointerdown', () => {
          dialogArr.forEach((item) => {
            this.selectSound.play();
            item.setVisible(false);
            newNPC.enableBody();
          });
        });

        // !!!!!!!!!!!!!!!!!!!!
        this.physics.add.collider(
          this.player,
          newNPC,
          (player, currentNPC) => {
            store.dispatch(getNPC(currentNPC.texture.key));
            let data = store.getState();
            const storeNPCS = data.npcBoardReducer.npcs;
            this.currentNPC = data.npcBoardReducer.singleNPC;
            // SETTING DIALOG TEXT VISIBLE

            for (let i = 0; i < dialogArr.length; i++) {
              if (i === 6) {
                dialogArr[i].setVisible(false);
              } else dialogArr[i].setVisible(true);
            }

            newNPC.disableBody();
            // TURNING THE BUTTONS OFF IF DEFEATED
            // AND CHANGING DIALOG TEXT WHEN DEFEATED
            storeNPCS.forEach((npc) => {
              if (npc.name === currentNPC.texture.key) {
                if (npc.defeated) {
                  dialogArr[5].setVisible(false);
                  dialogArr[6].setVisible(true);

                  dialogArr[0].setVisible(false);
                  dialogArr[1].setVisible(false);
                  dialogArr[2].setVisible(false);
                  dialogArr[3].setVisible(false);
                }
              }
            });
            this.time.delayedCall(5000, () => {
              dialogArr.forEach((item) => {
                item.setVisible(false);
                newNPC.enableBody();
              });
            });
          },
          null,
          this
        );

        //    !!!!!!!!!!!!!!!!!!!!!!
      }
      if (object.name === 'stairsUp') {
        const newItem = new Items(
          this,
          object.x,
          object.y,
          object.name
        ).setScale(1);
        this.physics.add.collider(this.player, newItem, () => {
          store.dispatch(setScene('RoomTwo'));
          this.scene.switch('RoomTwo');
        });
      }
    });

    // Colliders for door in room one
    this.physics.add.collider(this.player, this.doorRoomOne, () => {
      this.scene.switch('SinglePlayerMapScene');
      this.player.y -= 5;
    });

    roomOneLayer.setCollisionByProperty({ collisions: true });
    this.physics.add.collider(this.player, roomOneLayer);

    const camera = this.cameras.main;
    camera.setZoom(3);
    camera.startFollow(this.player, true);

    this.keys = this.input.keyboard.addKeys('W,S,A,D');
  }

  update() {
    this.music = this.scene.get('SinglePlayerMapScene');
    // if (!this.music.bgMusic.isPlaying) {
    //   this.music.bgMusic.play();
    // }

    this.player.update(this.keys);
    this.npcDefeatListener();
  }
}
