import Phaser from "phaser";
import Player from "../../entity/Player";
import { createNpcAnims } from "../../anims/NpcAnims";
import { createCharacterAnims } from "../../anims/CharacterAnims";
import NPC from "../../entity/NPC";
import Items from "../../entity/Items";
import store from "../../redux/store";
import { getNPC, doorOpen } from "../../redux/npcBoard";
import { setScene } from "../../redux/sceneReducer";

export default class RoomTwo extends Phaser.Scene {
  constructor() {
    super("RoomTwo");
    this.zach = [];
  }
  npcDefeatListener() {
    const data = store.getState();
    const storeNPCS = data.npcBoardReducer.npcs;

    if (storeNPCS.every((npc) => npc.defeated)) {
      this.scene.stop("Heart");
      this.scene.stop("Inventory");
      this.scene.stop("QuestUi");
      this.scene.stop();
      this.sound.stopAll();
      this.scene.start("VictoryScene");
      // "Congratulations!!!\n\nYou conquered FullStack!\n\nYou're ready to graduate",
    }
  }
  preload() {
    this.load.image("roomTwo", "assets/maps/tilemap.png");
    this.load.image("roomTwoDecor", "assets/maps/Tileset.png");
    this.load.tilemapTiledJSON("roomTwoMap", "assets/maps/roomTwo.json");

    // Music
    this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
  }

  create() {
    // Setting the scene in redux

    this.speechData = this.cache.json.get("speech");
    this.selectSound = this.sound.add("selectSound", { volume: 0.06 });

    createNpcAnims(this.anims, "zach");
    createCharacterAnims(this.anims);

    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: "roomTwoMap" });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage("tilemap", "roomTwo", 16, 16);
    const decor = map.addTilesetImage("interior", "roomTwoDecor", 16, 16);

    const roomTwoLayer = map.createLayer("Ground", decor, 0, 0);
    const roomDecorLayer = map.createLayer("Decoration", decor, 0, 0);

    this.player = new Player(
      this,
      this.data.get("playercordX") || 240,
      this.data.get("playercordY") || 80,
      "character"
    ).setScale(0.25);

    roomTwoLayer.setCollisionByProperty({ collisions: true });
    roomDecorLayer.setCollisionByProperty({ collides: true });
    
    this.physics.add.collider(this.player, [roomTwoLayer, roomDecorLayer]);

    const objectsLayer = map.getObjectLayer("Objects");

    objectsLayer.objects.forEach((object) => {
      if (object.name === "zach") {
        const newNPC = new NPC(
          this,
          object.x,
          object.y,
          "npcSprites",
          object.name
        ).setScale(0.25);
        this.zach.push(newNPC);
        //
        this.physics.add.collider(
          newNPC,
          [roomTwoLayer, roomDecorLayer],
          () => {
            newNPC.anims.stop();
          }
        );
        // !!!!!!!!!!!!!!!!!!
        this.dialogbox = this.add
          .image(this.player.x + 190, this.player.y + 290, "dialogBox")
          .setDepth(20)
          .setScale(0.1, 0.1);
        this.dialogbox.tint = 0xb2560d;

        this.dialogSprite = this.add
          .sprite(this.dialogbox.x - 50, this.dialogbox.y, object.name)
          .setScale(0.3)
          .setDepth(20);

        this.dialogText = this.add
          .text(
            this.dialogbox.x - 30,
            this.dialogbox.y - 15,
            this.speechData[object.name][0],
            {
              font: "7px Arial",
              fill: "#000000",
              wordWrap: { width: 120 - 2 * 2 },
            }
          )
          .setDepth(20)
          .setResolution(10);

        this.defeatedDialogText = this.add
          .text(
            this.dialogbox.x - 30,
            this.dialogbox.y - 15,
            this.speechData[object.name][1],
            {
              font: "7px Arial",
              fill: "#000000",
              wordWrap: { width: 120 - 2 * 2 },
            }
          )
          .setDepth(20)
          .setResolution(10);

        this.dialogTextName = this.add
          .text(
            this.dialogSprite.x - 13,
            this.dialogSprite.y - 20,
            object.name.toUpperCase(),
            {
              font: "9px Arial",
              fill: "#000000",
            }
          )
          .setDepth(20)
          .setResolution(10);

        this.yesRec = this.add
          .rectangle(
            this.dialogbox.x - 8,
            this.dialogbox.y + 10,
            39,
            10,
            0x5e4040
          )
          .setDepth(20);
        this.yesButton = this.add
          .text(this.dialogbox.x - 23, this.dialogbox.y + 4, "Battle", {
            font: "9px",
            fill: "#FFFAF0",
          })
          .setInteractive({ useHandCursor: true })
          .setVisible(true)
          .setDepth(25)
          .setResolution(10);

        this.noRec = this.add
          .rectangle(
            this.dialogbox.x + 55,
            this.dialogbox.y + 10,
            20,
            10,
            0x5e4040
          )
          .setDepth(20);

        this.noButton = this.add
          .text(this.dialogbox.x + 50, this.dialogbox.y + 4, "No", {
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
          store.dispatch(setScene("RoomTwo"));
          dialogArr.forEach((item) => {
            item.setAlpha(0.8);
            item.setScrollFactor(0, 0);
            item.setVisible(false);
          });
          newNPC.enableBody();
          this.selectSound.play();
          this.scene.stop("QuestUi");
          this.scene.switch("BattleScene");
          this.music = this.scene.get("SinglePlayerMapScene");
          this.music.bgMusic.stop();
        });

        this.noButton.on("pointerdown", () => {
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
            store.dispatch(getNPC(currentNPC.npcName));
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
              if (npc.name === currentNPC.npcName) {
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
        //
      }

      if (object.name === "stairsUp") {
        const newItem = new Items(
          this,
          object.x,
          object.y,
          object.name
        ).setScale(1);
        this.physics.add.collider(this.player, newItem, () => {
          store.dispatch(setScene("RoomThree"));
          this.scene.switch("RoomThree");
        });
      }
      if (object.name === "stairsDown") {
        const newItem = new Items(
          this,
          object.x,
          object.y,
          object.name
        ).setScale(1);
        this.physics.add.collider(this.player, newItem, () => {
          store.dispatch(setScene("RoomOne"));
          this.scene.switch("RoomOne");
        });
      }
    });

    const camera = this.cameras.main;
    camera.setZoom(3);
    camera.startFollow(this.player, true);

    this.keys = this.input.keyboard.addKeys("W,S,A,D");
  }

  update() {
    this.music = this.scene.get("SinglePlayerMapScene");
    if (!this.music.bgMusic.isPlaying) {
      this.music.bgMusic.play();
    }
    this.player.update(this.keys);
    this.npcDefeatListener();
  }
}
