import Phaser from "phaser";
import Player from "../../entity/Player";
import { createCharacterAnims } from "../../anims/CharacterAnims";
import NPC from "../../entity/NPC";
import Items from "../../entity/Items";
import store from "../../redux/store";
import { getNPC, doorOpen } from "../../redux/npcBoard";
import { setScene } from "../../redux/sceneReducer";

export default class RoomOne extends Phaser.Scene {
  constructor() {
    super("RoomOne");
    this.mac = [];
  }

  preload() {
    this.load.image("roomOne", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("roomOneMap", "assets/maps/roomOne.json");

    // Music
    this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
  }

  create() {
    // Setting the scene in redux
    store.dispatch(setScene("RoomOne"));

    this.doorRoomOne = this.physics.add
      .sprite(160, 263, "blank")
      .setDepth(50)
      .setVisible(false)
      .setImmovable(true);

    createCharacterAnims(this.anims);

    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: "roomOneMap" });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage("tilemap", "roomOne", 16, 16);

    const roomOneLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);
    //NPC generation/collision
    this.speechData = this.cache.json.get("speech");
    this.selectSound = this.sound.add("selectSound");

    this.player = new Player(
      this,
      this.data.get("playercordX") || 160,
      this.data.get("playercordY") || 245,
      "character"
    ).setScale(0.25);

    const objectsLayer = map.getObjectLayer("Objects");

    objectsLayer.objects.forEach((object) => {
      if (object.name === "mac") {
        const newNPC = new NPC(this, object.x, object.y, object.name).setScale(
          0.25
        );
        this.mac.push(newNPC);
        // !!!!!!!!!!!!!!!!!!
        this.dialogbox = this.add
          .image(object.x + 50, object.y - 54, "dialogBox")
          .setDepth(20)
          .setScale(0.12, 0.16);

        this.dialogText = this.add
          .text(object.x, object.y - 75, this.speechData[object.name], {
            font: "10px Arial",
            fill: "#000000",
            wordWrap: { width: 120 - 2 * 2 },
          })
          .setDepth(20)
          .setResolution(10);

        this.defeatedDialogText = this.add
          .text(object.x, object.y - 40, this.speechData[object.name][1], {
            font: "10px Arial",
            fill: "#000000",
            wordWrap: { width: 120 - 2 * 2 },
          })
          .setDepth(20)
          .setResolution(10);

        this.dialogTextName = this.add
          .text(object.x + 20, object.y - 85, object.name.toUpperCase(), {
            font: "9px Arial",
            fill: "#FF0000",
          })
          .setDepth(20)
          .setResolution(10);

        this.yesRec = this.add
          .rectangle(object.x + 30, object.y - 33, 20, 10, 0x000000)
          .setDepth(20);
        this.yesButton = this.add
          .text(object.x + 22, object.y - 39, "Yes", {
            font: "9px",
            fill: "#FFFAF0",
          })
          .setInteractive({ useHandCursor: true })
          .setVisible(true)
          .setDepth(25)
          .setResolution(10);
        this.noRec = this.add
          .rectangle(object.x + 75, object.y - 33, 20, 10, 0x000000)
          .setDepth(20);
        this.noButton = this.add
          .text(object.x + 70, object.y - 39, "No", {
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
        ];
        dialogArr.forEach((item) => {
          item.setVisible(false);
        });

        this.yesButton.on("pointerdown", () => {
          dialogArr.forEach((item) => {
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
            store.dispatch(getNPC(currentNPC.texture.key));

            // SETTING DIALOG TEXT VISIBLE

            for (let i = 0; i < dialogArr.length; i++) {
              if (i === 6) {
                dialogArr[i].setVisible(false);
              } else dialogArr[i].setVisible(true);
            }

            newNPC.disableBody();

            let data = store.getState();
            const storeNPCS = data.npcBoardReducer.npcs;
            console.log("storeNPCS", storeNPCS);
            this.currentNPC = data.npcBoardReducer.singleNPC;

            console.log("this.currentNPC", this.currentNPC);

            this.time.delayedCall(5000, () => {
              dialogArr.forEach((item) => {
                item.setVisible(false);
                let npcName = currentNPC.texture.key;

                storeNPCS.forEach((npc) => {
                  if (npc.name === npcName) {
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
              });
            });
          },
          null,
          this
        );

        //    !!!!!!!!!!!!!!!!!!!!!!
      }
      if (object.name === "stairsUp") {
        const newItem = new Items(
          this,
          object.x,
          object.y,
          object.name
        ).setScale(1);
        this.physics.add.collider(this.player, newItem, () => {
          this.scene.switch("RoomTwo");
        });
      }
    });

    // Colliders for door in room one
    this.physics.add.collider(this.player, this.doorRoomOne, () => {
      this.scene.switch("SinglePlayerMapScene");
      this.player.y -= 5;
    });

    roomOneLayer.setCollisionByProperty({ collisions: true });
    this.physics.add.collider(this.player, roomOneLayer);

    const camera = this.cameras.main;
    camera.setZoom(3);
    camera.startFollow(this.player, true);

    this.keys = this.input.keyboard.addKeys("W,S,A,D");
  }

  update() {
    this.player.update(this.keys);
  }
}
