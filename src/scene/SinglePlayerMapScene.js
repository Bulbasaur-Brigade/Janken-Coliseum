import Player from "../entity/Player";
import Items from "../entity/Items";
import Phaser from "phaser";
import NPC from "../entity/NPC";
import SceneTransition from "./SceneTransition";
import { addHp, loseHp } from "../redux/hpReducer";
import store from "../redux/store";
import { createCharacterAnims } from "../anims/CharacterAnims";
import { createNpcAnims } from "../anims/NpcAnims";
import { addNPC, getNPC, doorOpen } from "../redux/npcBoard";
import { setScene } from "../redux/sceneReducer";

export default class SinglePlayerMapScene extends Phaser.Scene {
  constructor() {
    super("SinglePlayerMapScene");
    this.npcsArr = [];
  }

  preload() {
    this.load.image("tiles", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("tilemap", "assets/maps/overworldMap.json");
  }
  npcDefeatListener() {
    const data = store.getState();
    this.storeNPCS = data.npcBoardReducer.npcs;
    let tempNpcArr = [];

    for (let i = 3; i < this.storeNPCS.length; i++) {
      tempNpcArr.push(this.storeNPCS[i]);
      if (tempNpcArr.every((npc) => npc.defeated === true)) {
        store.dispatch(doorOpen());
        // ANNOUNCEMENT THAT OPENS BOSS BUILDING
        this.announce.forEach((item) => {
          item.setVisible(true);
        });
      }
    }
  }

  create() {
    store.dispatch(setScene("SinglePlayerMapScene"));
    // super.create();
    this.scene.run("QuestUi");
    this.scene.run("Inventory");
    this.scene.run("Heart");
    // this.scene.run("AnimationLayer");
    this.door = this.physics.add
      .sprite(895, 1050, "blank")
      .setDepth(50)
      .setVisible(false)
      .setImmovable(true);

    this.inventory = this.scene.get("Inventory");

    // SOUNDS
    this.rockPickup = this.sound.add("rockPickup");
    this.scissorsPickup = this.sound.add("scissorsPickup");
    this.paperPickup = this.sound.add("paperPickup");
    this.heartPickup = this.sound.add("heartPickup");
    this.selectSound = this.sound.add("selectSound");
    this.audioSounds = [
      this.rockPickup,
      this.scissorsPickup,
      this.paperPickup,
      this.heartPickup,
      this.selectSound,
    ];
    this.audioSounds.forEach((sound) => sound.setVolume(0.06));

    this.bgMusic = this.sound.add("Pallet", { volume: 0.015, loop: true });
    this.bgMusic.play();

    // Start animations
    createCharacterAnims(this.anims);

    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: "tilemap" });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage("characters", "tiles", 16, 16);

    // Layers

    map.createLayer("Water", tileset, 0, 0);
    const groundLayer = map.createLayer("Ground", tileset, 0, 0);
    const interactiveLayer = map.createLayer("Interactive", tileset, 0, 0);
    const overheadLayer = map.createLayer("Overhead", tileset, 0, 0);

    //Player
    // this.time.delayedCall(3000,()=>{})
    this.player = new Player(
      this,
      this.data.get("playercordX") || 370,
      this.data.get("playercordY") || 340,
      "character"
    ).setScale(0.25);

    //ANNOUNCEMENT
    this.announceBox = this.add
      .image(this.player.x + 55, this.player.y + 40, "dialogBox")
      .setAlpha(0.8)
      .setScrollFactor(0, 0)
      .setDepth(20)
      .setScale(0.14, 0.14);
    this.announceBox.tint = 0xb2560d;
    this.announceText = this.add
      .text(
        this.announceBox.x - 25,
        this.announceBox.y - 20,
        "I am waiting for you at my HQ. Make your way to the big building in the center.",
        {
          font: "9px Arial",
          fill: "#000000",
          wordWrap: { width: 120 - 2 * 1.5 },
        }
      )
      .setAlpha(0.8)
      .setScrollFactor(0, 0)
      .setDepth(20)
      .setResolution(15);
    this.announceSprite = this.add
      .sprite(this.announceBox.x - 59, this.announceBox.y + 5, "omar")
      .setScale(0.5)
      .setDepth(20)
      .setScrollFactor(0, 0);
    this.announceName = this.add
      .text(this.announceBox.x - 80, this.announceBox.y - 24, "OMAR", {
        font: "12px Arial",
        fill: "#000000",
      })
      .setAlpha(0.8)
      .setScrollFactor(0, 0)
      .setDepth(20)
      .setResolution(10);

    this.announce = [
      this.announceBox,
      this.announceName,
      this.announceSprite,
      this.announceText,
    ];

    this.announce.forEach((item) => item.setVisible(false));

    //NPC generation/collision
    this.speechData = this.cache.json.get("speech");

    const npcLayer = map.getObjectLayer("NPC");

    store.dispatch(addNPC({ name: "omar", defeated: false }));
    store.dispatch(addNPC({ name: "zach", defeated: false }));
    store.dispatch(addNPC({ name: "mac", defeated: false }));

    npcLayer.objects.forEach((npc) => {
      const newNPC = new NPC(
        this,
        npc.x,
        npc.y,
        "npcSprites",
        npc.type
      ).setScale(0.25);

      store.dispatch(
        addNPC({ name: newNPC.npcName, defeated: newNPC.defeated })
      );

      const areaBoxR = this.physics.add
        .sprite(npc.x + 15, npc.y, "blank")
        .setVisible(false)
        .setImmovable(true)
        .setSize(0.01, 195);

      const areaBoxL = this.physics.add
        .sprite(npc.x - 190, npc.y, "blank")
        .setVisible(false)
        .setImmovable(true)
        .setSize(0.01, 195);

      const areaBoxT = this.physics.add
        .sprite(npc.x - 88, npc.y - 96, "blank")
        .setVisible(false)
        .setImmovable(true)
        .setSize(208, 0.01);

      const areaBoxB = this.physics.add
        .sprite(npc.x - 88, npc.y + 96, "blank")
        .setVisible(false)
        .setImmovable(true)
        .setSize(208, 0.01);

      this.npcsArr.push(newNPC);

      createNpcAnims(this.anims, npc.type);

      this.dialogbox = this.add
        .image(this.player.x + 50, this.player.y + 40, "dialogBox")
        .setDepth(20)
        .setScale(0.14, 0.14);
      this.dialogbox.tint = 0xb2560d;

      this.dialogSprite = this.add
        .sprite(this.player.x - 10, this.player.y + 42, npc.type)
        .setScale(0.5)
        .setDepth(20);

      this.dialogText = this.add
        .text(
          this.player.x + 25,
          this.player.y + 19,
          this.speechData[npc.type][0],
          {
            font: "10px Arial",
            fill: "#000000",
            wordWrap: { width: 120 - 2 * 2 },
          }
        )
        .setDepth(20)
        .setResolution(10);

      this.defeatedDialogText = this.add
        .text(
          this.player.x + 25,
          this.player.y + 19,
          this.speechData[npc.type][1],
          {
            font: "10px Arial",
            fill: "#000000",
            wordWrap: { width: 120 - 2 * 2 },
          }
        )
        .setDepth(20)
        .setResolution(10);

      this.dialogTextName = this.add
        .text(
          this.dialogSprite.x - 28,
          this.dialogSprite.y - 25,
          npc.type.toUpperCase(),
          {
            font: "10px Arial",
            fill: "#000000",
          }
        )
        .setDepth(20)
        .setResolution(10);

      this.yesRec = this.add
        .rectangle(this.player.x + 50, this.player.y + 56, 39, 10, 0x5e4040)
        .setDepth(20);
      this.yesButton = this.add
        .text(this.player.x + 32, this.player.y + 50, "Battle", {
          font: "10px",
          fill: "#FFFAF0",
        })
        .setInteractive({ useHandCursor: true })
        .setVisible(true)
        .setDepth(25)
        .setResolution(10);

      this.noRec = this.add
        .rectangle(this.player.x + 120, this.player.y + 56, 20, 10, 0x5e4040)
        .setDepth(20);

      this.noButton = this.add
        .text(this.player.x + 115, this.player.y + 50, "No", {
          font: "9px",
          fill: "#FFFAF0",
        })
        .setInteractive({ useHandCursor: true })
        .setVisible(true)
        .setDepth(25)
        .setResolution(10);

      this.data.set("playercordX", this.player.x);
      this.data.set("playercordY", this.player.y);

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

      this.yesButton.on("pointerdown", () => {
        dialogArr.forEach((item) => {
          item.setVisible(false);
        });
        newNPC.enableBody();
        this.selectSound.play();
        store.dispatch(setScene("SinglePlayerMapScene"));
        // this.scene.switch("SinglePlayerMapScene");
        this.scene.switch("BattleScene");
        // this.bgMusic.stop();
        this.sound.stopAll();
      });

      this.noButton.on("pointerdown", () => {
        dialogArr.forEach((item) => {
          this.selectSound.play();
          item.setVisible(false);
          newNPC.enableBody();
        });
      });

      this.physics.add.collider(
        newNPC,
        [areaBoxL, areaBoxR, areaBoxT, areaBoxB],
        () => {
          newNPC.anims.stop();
        },
        null,
        this
      );
      this.physics.add.collider(
        newNPC,
        groundLayer,
        () => {
          newNPC.anims.stop();
        },
        null,
        this
      );
      this.physics.add.collider(
        newNPC,
        interactiveLayer,
        () => {
          newNPC.anims.stop();
        },
        null,
        this
      );

      // Player and NPC COLLISIONS

      this.physics.add.collider(
        this.player,
        newNPC,
        (player, currentNPC) => {
          store.dispatch(getNPC(currentNPC.npcName));

          //REDUX
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
            let npcName = currentNPC.npcName;
            if (npc.name === npcName) {
              if (npc.defeated) {
                dialogArr[5].setVisible(false);
                dialogArr[6].setVisible(true);

                dialogArr[1].setVisible(false);
                dialogArr[0].setVisible(false);
                dialogArr[3].setVisible(false);
                dialogArr[2].setVisible(false);
              }
            }
          });

          this.time.delayedCall(4000, () => {
            dialogArr.forEach((item) => {
              item.setVisible(false);
              newNPC.enableBody();
            });
          });
        },
        null,
        this
      );
    });

    //Item randomized/overlaps

    const itemLayer = map.getObjectLayer("ItemSpawns");
    const itemArray = ["rock", "paper", "scissors", "heart", "heart", ""];

    itemLayer.objects.forEach((item) => {
      const randomItem =
        itemArray[Math.floor(Math.random() * itemArray.length)];

      if (randomItem) {
        item.name = randomItem;
        const newItem = new Items(this, item.x, item.y, item.name).setScale(
          0.25
        );
        // Player and ITEM COLLISIONS
        this.physics.add.collider(
          this.player,
          newItem,
          (player, item) => {
            this.inventory.addItem(item.texture.key);
            if (item.texture.key === "rock") {
              this.rockPickup.play();
            } else if (item.texture.key === "scissors") {
              this.scissorsPickup.play();
            } else if (item.texture.key === "paper") {
              this.paperPickup.play();
            }

            if (item.texture.key === "heart") {
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
    this.keys = this.input.keyboard.addKeys("W,S,A,D");
  }

  ifDoorIsOpen() {
    const data = store.getState();
    const doorOpen = data.npcBoardReducer.doorOpen;

    if (doorOpen) {
      this.physics.add.collider(this.player, this.door, () => {
        this.announce.forEach((item) => item.destroy());
        store.dispatch(setScene("RoomOne"));
        this.scene.switch("RoomOne");
        this.player.y += 5;
      });
    }
  }
  update() {
    // CHECK IF SOUND PLAYING
    if (!this.bgMusic.isPlaying) {
      this.bgMusic.play();
    }
    this.player.update(this.keys);
    this.ifDoorIsOpen();
    this.npcDefeatListener();

    // RANDOMIZED EVENTS FOR CLOUDS AND BIRDS FOR ENVIRONMENT
    let randomEvent = Phaser.Math.RND.integerInRange(0, 2000);
    let randomEvent1 = Phaser.Math.RND.integerInRange(0, 15000);

    if (randomEvent == 1) {
      this.cloud1 = this.physics.add
        .image(-100, Phaser.Math.RND.integerInRange(100, 1700), "cloud1")
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud1.setVelocity(30, 0);
    }
    if (randomEvent == 2) {
      this.cloud2 = this.physics.add
        .image(-100, Phaser.Math.RND.integerInRange(100, 1700), "cloud2")
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud2.setVelocity(25, 0);
    }
    if (randomEvent == 3) {
      this.cloud3 = this.physics.add
        .image(-100, Phaser.Math.RND.integerInRange(100, 1700), "cloud3")
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud3.setVelocity(20, 0);
    }
    if (randomEvent == 4) {
      this.blueBird = this.physics.add
        .sprite(-100, Phaser.Math.RND.integerInRange(100, 1700), "blueBird")
        .setScale(0.07)
        .setAlpha(0.8)
        .setDepth(30);

      this.blueBird.anims.play("blueBirdFly");
      this.blueBird.setVelocity(45, 0);
    }
    if (randomEvent == 5) {
      this.greenBird = this.physics.add
        .sprite(-100, Phaser.Math.RND.integerInRange(100, 1700), "greenBird")

        .setScale(0.07)
        .setAlpha(0.8)
        .setDepth(30);
      this.greenBird.anims.play("greenBirdFly");
      this.greenBird.setVelocity(60, 0);
    }
    if (randomEvent == 6) {
      this.greenBird1 = this.physics.add
        .sprite(1700, Phaser.Math.RND.integerInRange(1700, 100), "greenBird")

        .setScale(0.07)
        .setAlpha(0.8)
        .setDepth(30);

      this.greenBird1.flipX = true;
      this.greenBird1.anims.play("greenBirdFly");
      this.greenBird1.setVelocity(-60, 0);
    }
    if (randomEvent == 7) {
      this.blueBird1 = this.physics.add
        .sprite(1700, Phaser.Math.RND.integerInRange(1700, 100), "blueBird")

        .setScale(0.07)
        .setAlpha(0.8)
        .setDepth(30);
      this.blueBird1.flipX = true;
      this.blueBird1.anims.play("blueBirdFly");
      this.blueBird1.setVelocity(-60, 0);
    }
    if (randomEvent == 8) {
      this.cloud4 = this.physics.add
        .image(1700, Phaser.Math.RND.integerInRange(1700, 100), "cloud1")
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud4.setVelocity(-25, 0);
    }
    if (randomEvent == 9) {
      this.cloud5 = this.physics.add
        .image(1700, Phaser.Math.RND.integerInRange(1700, 100), "cloud2")
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud5.setVelocity(-20, 0);
    }
    if (randomEvent == 10) {
      this.cloud6 = this.physics.add
        .image(1700, Phaser.Math.RND.integerInRange(1700, 100), "cloud3")
        .setAlpha(0.2)
        .setScale(0.4)
        .setDepth(30);
      this.cloud6.setVelocity(-30, 0);
    }
    if (randomEvent1 == 11) {
      this.pinkBoat = this.physics.add
        .image(1600, 200, "pinkBoat")
        // .setAlpha(0.7)
        .setScale(0.8)
        .setDepth(30);
      this.pinkBoat.setVelocity(-50, 0);
    }
    if (randomEvent1 == 12) {
      this.pinkBoat1 = this.physics.add
        .image(-100, 1650, "pinkBoat")
        // .setAlpha(0.7)
        .setScale(0.8)
        .setDepth(30);
      this.pinkBoat1.flipX = true;
      this.pinkBoat1.setVelocity(25, 0);
    }
    if (randomEvent1 == 13) {
      this.blueBoat = this.physics.add
        .image(190, 1600, "blueBoat")
        // .setAlpha(0.7)
        .setScale(0.8)
        .setDepth(30);

      this.blueBoat.setVelocity(0, -25);
    }
    if (randomEvent1 == 14) {
      this.blueBoat1 = this.physics.add
        .image(1650, 190, "blueBoat")
        // .setAlpha(0.7)
        .setScale(0.8)
        .setDepth(30);
      this.blueBoat1.flipY = true;
      this.blueBoat1.flipX = true;
      this.blueBoat1.setVelocity(0, 25);
    }
    let topToBottom = [this.blueBoat1];
    let bottomToTop = [this.blueBoat];

    topToBottom.forEach((sprite) => {
      if (sprite) {
        if (sprite.y === 1600) {
          sprite.destroy();
        }
      }
    });
    bottomToTop.forEach((sprite) => {
      if (sprite) {
        if (sprite.y === -1600) {
          sprite.destroy;
        }
      }
    });

    let leftToRight = [
      this.cloud1,
      this.cloud2,
      this.cloud3,
      this.blueBird,
      this.greenBird,
      this.pinkBoat1,
    ];
    leftToRight.forEach((sprite) => {
      if (sprite) {
        if (sprite.x === 1700) {
          sprite.destroy();
        }
      }
    });
    let rightToLeft = [
      this.cloud4,
      this.cloud5,
      this.cloud6,
      this.blueBird1,
      this.greenBird1,
      this.pinkBoat,
    ];
    rightToLeft.forEach((sprite) => {
      if (sprite) {
        if (sprite.x === -100) {
          sprite.destroy();
        }
      }
    });
  }
}
