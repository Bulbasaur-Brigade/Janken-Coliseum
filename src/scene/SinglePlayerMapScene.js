import Player from "../entity/Player";
import Items from "../entity/Items";
import Phaser from "phaser";
import NPC from "../entity/NPC";

import { addHp, loseHp } from "../redux/hpReducer";
import store from "../redux/store";
import { addNPC, getNPC, doorOpen } from "../redux/npcBoard";
import { createCharacterAnims } from "../anims/CharacterAnims";
import { setScene } from "../redux/sceneReducer";
export default class SinglePlayerMapScene extends Phaser.Scene {
  constructor() {
    super("SinglePlayerMapScene");
    this.npcsArr = [];
    this.yesAndNoButtons = [];
  }

  npcDefeatListener() {
    const data = store.getState();
    const storeNPCS = data.npcBoardReducer.npcs;
    let tempNpcArr = [];

    for (let i = 3; i < storeNPCS.length; i++) {
      tempNpcArr.push(storeNPCS[i]);
      if (tempNpcArr.every((npc) => npc.defeated === true)) {
        store.dispatch(doorOpen());
        this.announce.setVisible(true);
      }
    }
    if (storeNPCS.every((npc) => npc.defeated)) {
      this.scene.stop("Heart");
      this.scene.stop("Inventory");
      this.scene.stop("QuestUi");
      this.scene.stop();
      this.scene.start("VictoryScene");
      // "Congratulations!!!\n\nYou conquered FullStack!\n\nYou're ready to graduate",
    }

    // !!!!!!!ONLY SHOW BUTTONS FOR THOSE NPCS THAT ARENT DEFEATED!
    storeNPCS.forEach((npc) => {
      if (npc.defeated) {
        // this.npcsArr.forEach((sprite) => {
        //   if (npc.name === sprite.texture.key)
        //  sprite.destroy();
        this.yesAndNoButtons.forEach((button) => {
          button.setVisible(false);
          // });
        });
      } else {
        this.yesAndNoButtons.forEach((button) => {
          button.setVisible(true);
          // });
        });
      }
    });
    // !!!!!!!ONLY SHOW BUTTONS FOR THOSE NPCS THAT ARENT DEFEATED!
  }

  preload() {
    this.load.image("tiles", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("tilemap", "assets/maps/overworldMap.json");
  }

  create() {
    // Setting the scene in redux store
    store.dispatch(setScene("SinglePlayerMapScene"));
    // Inventory
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

    this.sound.setVolume(0.08);

    this.inventory = this.scene.get("Inventory");

    this.rockPickup = this.sound.add("rockPickup");
    this.scissorsPickup = this.sound.add("scissorsPickup");
    this.paperPickup = this.sound.add("paperPickup");
    this.heartPickup = this.sound.add("heartPickup");
    this.selectSound = this.sound.add("selectSound");

    this.announce = this.add
      .bitmapText(
        150,
        300,
        "carrier_command",
        "GO TO THE SPECIAL BUILDING TO FIND THE BIG 3",
        40
      )
      .setDepth(50)
      .setScrollFactor(0, 0)
      .setVisible(false);

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

    // Music
    this.bgMusic = this.sound.add("Pallet", { volume: 0.1, loop: true });
    this.bgMusic.play();

    //Player
    // this.time.delayedCall(3000,()=>{})
    this.player = new Player(
      this,
      this.data.get("playercordX") || 370,
      this.data.get("playercordY") || 340,
      "character"
    ).setScale(0.25);

    //NPC generation/collision
    this.speechData = this.cache.json.get("speech");

    const npcLayer = map.getObjectLayer("NPC");
    // npcLayer.setCollisionByProperty({ collide: true });
    store.dispatch(addNPC({ name: "omar", defeated: false }));
    store.dispatch(addNPC({ name: "zach", defeated: false }));
    store.dispatch(addNPC({ name: "mac", defeated: false }));
    npcLayer.objects.forEach((npc) => {
      const newNPC = new NPC(this, npc.x, npc.y, npc.type).setScale(0.25);
      this.npcsArr.push(newNPC);

      store.dispatch(addNPC({ name: npc.type, defeated: newNPC.isDefeated }));

      this.dialogbox = this.add
        .image(npc.x + 50, npc.y - 54, "dialogBox")
        .setDepth(20)
        .setScale(0.1, 0.14);

      // this.dialogbox = this.add
      //   .graphics()
      //   .fillStyle(0xfffaf0, 1)
      //   .fillRoundedRect(npc.x - 8, npc.y - 80, 120, 60, 16)
      //   .setDepth(20);

      this.dialogText = this.add
        .text(npc.x, npc.y - 70, this.speechData[npc.type][0], {
          font: "10px Arial",
          fill: "#000000",
          wordWrap: { width: 120 - 2 * 2 },
        })
        .setDepth(20)
        .setResolution(10);
      this.dialogTextName = this.add
        .text(npc.x + 20, npc.y - 80, npc.type.toUpperCase(), {
          font: "9px Arial",
          fill: "#FF0000",
        })
        .setDepth(20)
        .setResolution(10);

      this.yesRec = this.add
        .rectangle(npc.x + 30, npc.y - 36, 20, 10, 0x000000)
        .setDepth(20);
      this.yesButton = this.add
        .text(npc.x + 22, npc.y - 42, "Yes", {
          font: "9px",
          fill: "#FFFAF0",
        })
        .setInteractive({ useHandCursor: true })
        .setVisible(true)
        .setDepth(25)
        .setResolution(10);
      this.noRec = this.add
        .rectangle(npc.x + 75, npc.y - 36, 20, 10, 0x000000)
        .setDepth(20);
      this.noButton = this.add
        .text(npc.x + 70, npc.y - 42, "No", {
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
        this.dialogTextName,
      ];
      this.buttons = [this.yesRec, this.yesButton, this.noRec, this.noButton];
      this.buttons.forEach((button) => {
        this.yesAndNoButtons.push(button);
      });

      this.yesButton.on("pointerdown", () => {
        dialogArr.forEach((item) => {
          item.setVisible(false);
        });
        newNPC.enableBody();
        this.selectSound.play();
        this.scene.stop("QuestUi");
        this.scene.switch("BattleScene");
        this.bgMusic.stop();
      });
      dialogArr.forEach((item) => {
        item.setVisible(false);
      });
      this.noButton.on("pointerdown", () => {
        dialogArr.forEach((item) => {
          this.selectSound.play();
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
          let data = store.getState();
          const storeNPCS = data.npcBoardReducer.npcs;
          this.currentNPC = data.npcBoardReducer.singleNPC;

          this.time.delayedCall(5000, () => {
            dialogArr.forEach((item) => {
              item.setVisible(false);
              let npcName = currentNPC.texture.key;

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
    const itemLayer = map.getObjectLayer("ItemSpawns");
    const itemArray = ["rock", "paper", "scissors", "heart", ""];

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
    this.keys = this.input.keyboard.addKeys("W,S,A,D");
  }

  ifDoorIsOpen() {
    const data = store.getState();
    const doorOpen = data.npcBoardReducer.doorOpen;

    if (!doorOpen) {
      this.physics.add.collider(this.player, this.door, () => {
        this.scene.switch("RoomOne");
        this.player.y += 5;
      });
    }
  }
  update() {
    // if (!this.bgMusic.isPlaying) {
    //   this.bgMusic.play();
    // }
    this.player.update(this.keys);
    this.ifDoorIsOpen();
    this.npcDefeatListener();

    let randomEvent = Phaser.Math.RND.integerInRange(0, 2000);

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
    let leftToRight = [
      this.cloud1,
      this.cloud2,
      this.cloud3,
      this.blueBird,
      this.greenBird,
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
