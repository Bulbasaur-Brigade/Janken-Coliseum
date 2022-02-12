import Phaser from "phaser";
import Player from "../../entity/Player";
import { createCharacterAnims } from "../../anims/CharacterAnims";
import NPC from "../../entity/NPC";
import Items from "../../entity/Items";
import store from "../../redux/store";
import { getNPC, doorOpen } from "../../redux/npcBoard";
import { setScene } from "../../redux/sceneReducer";

export default class RoomThree extends Phaser.Scene {
  constructor() {
    super("RoomThree");
    this.omar = [];
  }
  npcDefeatListener() {
    const data = store.getState();
    const storeNPCS = data.npcBoardReducer.npcs;

    if (storeNPCS.every((npc) => npc.defeated)) {
      this.scene.stop("Heart");
      this.scene.stop("Inventory");
      this.scene.stop("QuestUi");
      this.scene.stop();
      this.scene.start("VictoryScene");
      // "Congratulations!!!\n\nYou conquered FullStack!\n\nYou're ready to graduate",
    }
    storeNPCS.forEach((npc) => {
      if (npc.defeated) {
        this.omar[0].destroy();
      }
    });
  }
  preload() {
    this.load.image("RoomThree", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("RoomThreeMap", "assets/maps/RoomThree.json");

    // Music
    this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
  }

  create() {
    createCharacterAnims(this.anims);
    store.dispatch(setScene("RoomThree"));
    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: "RoomThreeMap" });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage("tilemap", "RoomThree", 16, 16);

    const roomThreeLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);

    this.speechData = this.cache.json.get("speech");
    this.selectSound = this.sound.add("selectSound");

    this.player = new Player(
      this,
      this.data.get("playercordX") || 80,
      this.data.get("playercordY") || 80,
      "character"
    ).setScale(0.25);

    const objectsLayer = map.getObjectLayer("Objects");
    console.log(objectsLayer.objects);
    objectsLayer.objects.forEach((object) => {
      if (object.name === "omar") {
        const newNPC = new NPC(this, object.x, object.y, object.name).setScale(
          0.25
        );
        this.omar.push(newNPC);
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
          this.dialogTextName,
        ];
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

        // !!!!!!!!!!!!!!!!!!!!
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
      }
      if (object.name === "stairsDown") {
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

    roomThreeLayer.setCollisionByProperty({ collisions: true });
    this.physics.add.collider(this.player, roomThreeLayer);

    const camera = this.cameras.main;
    camera.setZoom(3);
    camera.startFollow(this.player, true);

    this.keys = this.input.keyboard.addKeys("W,S,A,D");
  }

  update() {
    this.player.update(this.keys);
    this.npcDefeatListener();
  }
}
