import Player from '../entity/Player';
import Items from '../entity/Items';
import Phaser from 'phaser';
import NPC from '../entity/NPC';
import SceneTransition from './SceneTransition';
import { addHp, loseHp } from '../redux/hpReducer';
import store from '../redux/store';
import { addNPC, getNPC } from '../redux/npcBoard';
import { createCharacterAnims } from '../anims/CharacterAnims';
import { createNpcAnims } from '../anims/NpcAnims';

export default class SinglePlayerMapScene extends Phaser.Scene {
  constructor() {
    super('SinglePlayerMapScene');
    this.npcsArr = [];
  }

  preload() {
    this.load.image('tiles', 'assets/maps/tilemap.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/maps/overworldMap.json');

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
    // this.scene.run("AnimationLayer");

    this.sound.setVolume(0.08);

    this.inventory = this.scene.get('Inventory');

    this.rockPickup = this.sound.add('rockPickup');
    this.scissorsPickup = this.sound.add('scissorsPickup');
    this.paperPickup = this.sound.add('paperPickup');
    this.heartPickup = this.sound.add('heartPickup');
    this.selectSound = this.sound.add('selectSound');

    // Start animations
    createCharacterAnims(this.anims);

    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: 'tilemap' });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage('characters', 'tiles', 16, 16);

    // Layers

    map.createLayer('Water', tileset, 0, 0);
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const interactiveLayer = map.createLayer('Interactive', tileset, 0, 0);
    const overheadLayer = map.createLayer('Overhead', tileset, 0, 0);

    // Music
    this.bgMusic = this.sound.add('Pallet', { volume: 0.1, loop: true });

    this.bgMusic.play();

    //Player
    // this.time.delayedCall(3000,()=>{})
    this.player = new Player(
      this,
      this.data.get('playercordX') || 370,
      this.data.get('playercordY') || 340,
      'character'
    ).setScale(0.25);

    //NPC generation/collision
    this.speechData = this.cache.json.get('speech');

    const npcLayer = map.getObjectLayer('NPC');

    store.dispatch(addNPC({ name: 'omar', defeated: false }));
    store.dispatch(addNPC({ name: 'zach', defeated: false }));
    store.dispatch(addNPC({ name: 'mac', defeated: false }));

    npcLayer.objects.forEach((npc) => {
      const newNPC = new NPC(
        this,
        npc.x,
        npc.y,
        'npcSprites',
        npc.type
      ).setScale(0.25);

      store.dispatch(
        addNPC({ name: newNPC.npcName, defeated: newNPC.defeated })
      );

      const areaBoxR = this.physics.add
        .sprite(npc.x + 15, npc.y, 'blank')
        .setVisible(false)
        .setImmovable(true)
        .setSize(0.01, 195);

      const areaBoxL = this.physics.add
        .sprite(npc.x - 190, npc.y, 'blank')
        .setVisible(false)
        .setImmovable(true)
        .setSize(0.01, 195);

      const areaBoxT = this.physics.add
        .sprite(npc.x - 88, npc.y - 96, 'blank')
        .setVisible(false)
        .setImmovable(true)
        .setSize(208, 0.01);

      const areaBoxB = this.physics.add
        .sprite(npc.x - 88, npc.y + 96, 'blank')
        .setVisible(false)
        .setImmovable(true)
        .setSize(208, 0.01);

      this.npcsArr.push(newNPC);

      createNpcAnims(this.anims, npc.type);

      this.dialogbox = this.add
        .graphics()
        .fillStyle(0xfffaf0, 1)
        .fillRoundedRect(npc.x - 8, npc.y - 80, 120, 60, 16)
        .setDepth(20);

      this.dialogText = this.add
        .text(npc.x, npc.y - 70, this.speechData[npc.type], {
          font: '10px Arial',
          fill: '#000000',
          wordWrap: { width: 120 - 2 * 2 },
        })
        .setDepth(20)
        .setResolution(10);
      this.dialogTextName = this.add
        .text(npc.x + 20, npc.y - 80, newNPC.npcName.toUpperCase(), {
          font: '9px Arial',
          fill: '#FF0000',
        })
        .setDepth(20)
        .setResolution(10);

      this.yesRec = this.add
        .rectangle(npc.x + 30, npc.y - 30, 20, 10, 0x000000)
        .setDepth(20);
      this.yesButton = this.add
        .text(npc.x + 22, npc.y - 36, 'Yes', {
          font: '9px',
          fill: '#FFFAF0',
        })
        .setInteractive({ useHandCursor: true })
        .setVisible(true)
        .setDepth(25)
        .setResolution(10);
      this.noRec = this.add
        .rectangle(npc.x + 75, npc.y - 30, 20, 10, 0x000000)
        .setDepth(20);
      this.noButton = this.add
        .text(npc.x + 70, npc.y - 36, 'No', {
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
        this.dialogTextName,
      ];

      this.yesButton.on('pointerdown', () => {
        dialogArr.forEach((item) => {
          item.setVisible(false);
        });

        const data = store.getState();
        const defeatNPC = data.npcBoardReducer.singleNPC;
        data.npcBoardReducer.npcs.forEach((npc) => {
          if (npc.defeated === true && npc.name === defeatNPC) {
            newNPC.disableBody();
            dialogArr.forEach((item) => {
              item.setVisible(false);
            });
          }
        });
        newNPC.enableBody();
        this.selectSound.play();
        this.scene.stop('QuestUi');
        this.scene.switch('BattleScene');
        this.bgMusic.stop();
      });

      dialogArr.forEach((item) => {
        item.setVisible(false);
      });
      this.noButton.on('pointerdown', () => {
        dialogArr.forEach((item) => {
          this.selectSound.play();
          item.setVisible(false);
          newNPC.enableBody();
        });
      });

      this.physics.add.collider(newNPC, [
        areaBoxL,
        areaBoxR,
        areaBoxT,
        areaBoxB,
      ]);
      this.physics.add.collider(newNPC, groundLayer);
      this.physics.add.collider(newNPC, interactiveLayer);
      this.physics.add.collider(
        this.player,
        newNPC,
        (player, currentNPC) => {
          store.dispatch(getNPC(currentNPC.npcName));
          newNPC.disableBody();
          dialogArr.forEach((item) => {
            item.setVisible(true);
          });
          this.time.delayedCall(5000, () => {
            newNPC.enableBody();
            dialogArr.forEach((item) => {
              item.setVisible(false);

              let npcName = currentNPC.npcName;
              let data = store.getState();
              const storeNPCS = data.npcBoardReducer.npcs;
              storeNPCS.forEach((npc) => {
                if (npc.name === npcName) {
                  if (npc.defeated === false) {
                    newNPC.enableBody();
                  }
                }
              });
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
      if (item.name === 'bossroom' && item.properties[0].value) {
        //console.log("Item: ", item);
        const newItem = new Items(
          this,
          item.x + 16,
          item.y - 8,
          item.name
        ).setScale(1);
        this.physics.add.collider(
          this.player,
          newItem,
          () => {
            this.scene.switch('RoomOne');
          },
          null,
          this
        );
        if (item.name === 'bossroom') {
        }
      } else if (randomItem) {
        item.name = randomItem;
        const newItem = new Items(this, item.x, item.y, item.name).setScale(
          0.25
        );
        this.physics.add.collider(
          this.player,
          newItem,
          (player, item) => {
            this.inventory.addItem(item.texture.key);
            if (item.texture.key === 'rock') {
              this.rockPickup.play();
            } else if (item.texture.key === 'scissors') {
              this.scissorsPickup.play();
            } else if (item.texture.key === 'paper') {
              this.paperPickup.play();
            }

            if (item.texture.key === 'heart') {
              this.heartPickup.play();
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

    let randomEvent = Phaser.Math.RND.integerInRange(0, 2000);

    if (randomEvent == 1) {
      this.cloud1 = this.physics.add
        .image(-100, Phaser.Math.RND.integerInRange(100, 1800), 'cloud1')
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud1.setVelocity(25, 0);
    }
    if (randomEvent == 2) {
      this.cloud2 = this.physics.add
        .image(-100, Phaser.Math.RND.integerInRange(100, 1800), 'cloud2')
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud2.setVelocity(25, 0);
    }
    if (randomEvent == 3) {
      this.cloud2 = this.physics.add
        .image(-100, Phaser.Math.RND.integerInRange(100, 1800), 'cloud3')
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud2.setVelocity(25, 0);
    }
    if (randomEvent == 4) {
      this.blueBird = this.physics.add
        .sprite(-100, Phaser.Math.RND.integerInRange(100, 1800), 'blueBird')

        .setScale(0.1)
        .setAlpha(0.8)
        .setDepth(30);
      this.blueBird.anims.play('blueBirdFly');
      this.blueBird.setVelocity(25, 0);
    }
    if (randomEvent == 5) {
      this.blueBird = this.physics.add
        .sprite(-100, Phaser.Math.RND.integerInRange(100, 1800), 'greenBird')

        .setScale(0.1)
        .setAlpha(0.8)
        .setDepth(30);
      this.blueBird.anims.play('greenBirdFly');
      this.blueBird.setVelocity(40, 0);
    }
  }
}
