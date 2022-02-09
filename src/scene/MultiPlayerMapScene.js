import Phaser from "phaser";
import io from "socket.io-client";
import { createCharacterAnims } from "../anims/CharacterAnims";
import Items from "../entity/Items";
import Player from "../entity/Player";
import { addHp } from "../redux/hpReducer";
import store from "../redux/store";

export default class MultiPlayerMapScene extends Phaser.Scene {
  constructor() {
    super("MultiPlayerMapScene");
  }
  // init(data) {
  //   this.socket = data.socket;
  // }
  preload() {
    this.load.image("tiles", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("tilemap", "assets/maps/overworldMap.json");
    this.load.spritesheet("character", "assets/spriteSheets/characters.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    // Heart

    //Items
    this.load.image("rock", "assets/sprites/rock.png");
    this.load.image("paper", "assets/sprites/paper.png");
    this.load.image("scissors", "assets/sprites/scissors.png");
    this.load.image("heart", "assets/sprites/heart.png");

    // Music
    this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
  }
  create() {
    this.socket = io("http://localhost:3000", { transports: ["websocket"] });

    this.socket.on("connect", () => {
      console.log("Connected to Multiplayer!");
    });

    // JOINED ROOM - SET STATE
    this.socket.on("currentPlayers", function (players) {
      Object.keys(players).forEach(function (id) {
        if (players[id].playerId === self.socket.id) {
          this.addPlayer(self, players[id]);
        }
      });
    });

    this.scene.run("Inventory");
    this.scene.run("Heart");

    this.inventory = this.scene.get("Inventory");

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
    this.bgMusic = this.sound.add("Pallet", { volume: 0.1 }, true);
    this.bgMusic.play();

    //Player
    this.socket.on("isPlayer1", function () {
      this.isPlayerA = true;
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

            if (item.texture.key === "heart") {
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

    // groundLayer.setCollisionByProperty({ collide: true });
    // this.physics.add.collider(this.player, groundLayer);

    // interactiveLayer.setCollisionByProperty({ collide: true });
    // // this.physics.add.collider(this.player, interactiveLayer);
    // this.player.setDepth(0);
    // overheadLayer.setDepth(10);

    // Placeholder Camera
    // const camera = this.cameras.main;
    // camera.setZoom(2);
    // camera.startFollow(this.player, true);

    // WASD KEYS FOR MOVEMENT
    this.keys = this.input.keyboard.addKeys("W,S,A,D");
  }
  addPlayer(scene, playerInfo) {
    scene.player = new Player(
      this,
      playerInfo.x,
      playerInfo.y,
      "character"
    ).setScale(0.25);
  }
  // addOtherPlayers(scene, playerInfo) {
  //   const otherPlayer = new Player(
  //     this,
  //     playerInfo.x + 40,
  //     playerInfo.y + 40,
  //     "character"
  //   );

  //   otherPlayer.playerId = playerInfo.playerId;
  //   scene.otherPlayers.add(otherPlayer);
  // }
  update() {
    this.player.update(this.keys);
  }
}
