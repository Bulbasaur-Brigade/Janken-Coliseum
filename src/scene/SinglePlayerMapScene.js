import Player from "../entity/Player";
import Items from "../entity/Items";
import Phaser from "phaser";
// import SceneTransition from "./SceneTransition";

export default class SinglePlayerMapScene extends Phaser.Scene {
  constructor() {
    super("SinglePlayerMapScene");
  }

  preload() {
    this.load.image("tiles", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("tilemap", "assets/maps/overworldMap.json");
    this.load.spritesheet("character", "assets/spriteSheets/characters.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    // Heart
    this.load.image("heart", "assets/sprites/heart.png");
    //Items
    this.load.image("rock", "assets/sprites/rock.png");
    this.load.image("paper", "assets/sprites/paper.png");
    this.load.image("scissors", "assets/sprites/scissors.png");
    this.load.image("heart", "assets/sprites/heart.png");

    // Music
    this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
  }
  createAnimations() {
    this.anims.create({
      key: "runLeft",
      frames: this.anims.generateFrameNumbers("character", {
        start: 0,
        end: 2,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "runRight",
      frames: this.anims.generateFrameNumbers("character", {
        start: 9,
        end: 11,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "runDown",
      frames: this.anims.generateFrameNumbers("character", {
        start: 3,
        end: 5,
      }),
      frameRate: 6,
      repeat: -1,
    });
    this.anims.create({
      key: "runUp",
      frames: this.anims.generateFrameNumbers("character", {
        start: 6,
        end: 8,
      }),
      frameRate: 6,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: [{ key: "character", frame: 3 }],
      frameRate: 10,
    });
  }

  create() {
    // Inventory

    this.scene.run("Inventory");
    this.scene.run("Heart");

    this.inventory = this.scene.get("Inventory");

    //  Hearts

    // super.create();

    // Start animations
    this.createAnimations();
    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: "tilemap" });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage("characters", "tiles", 16, 16);

    // Layers
    //const waterLayer = map.createLayer("Water", tileset, 0, 0);
    const groundLayer = map.createLayer("Ground", tileset, 0, 0);
    const npcLayer = map.createLayer("NPC", tileset, 0, 0);
    const interactiveLayer = map.createLayer("Interactive", tileset, 0, 0);
    const overheadLayer = map.createLayer("Overhead", tileset, 0, 0);

    // Music
    this.bgMusic = this.sound.add("Pallet", { volume: 0.1 }, true);
    this.bgMusic.play();

    //Player
    this.player = new Player(
      this,
      this.data.get("playercordX") || 250,
      this.data.get("playercordY") || 200,
      "character"
    ).setScale(0.25);

    // Set player HP  to 3
    this.player.setHp();

    //Collisions
    groundLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, groundLayer);

    npcLayer.setCollisionByProperty({ collide: true });

    this.physics.add.collider(
      this.player,
      npcLayer,
      () => {
        this.data.set("playercordX", this.player.x);
        this.data.set("playercordY", this.player.y);

        // this.scene.start("Transition");

        this.bgMusic.stop();
        this.time.delayedCall(4000, this.scene.switch("BattleScene"));
      },
      null,
      this
    );

    interactiveLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, interactiveLayer);
    this.player.setDepth(0);
    overheadLayer.setDepth(10);

    // Placeholder Camera
    const camera = this.cameras.main;
    camera.setZoom(2);
    camera.startFollow(this.player, true);
    // Inventory
    this.rocks = this.physics.add.group({
      key: "rock",
      allowGravity: false,
      repeat: 30,
    });
    var emptyTiles = interactiveLayer.filterTiles(function (tile) {
      return tile.index === -1;
    });
    this.rocks.children.iterate(function (child) {
      var randomTile = Phaser.Utils.Array.GetRandom(emptyTiles);

      child.setPosition(randomTile.pixelX, randomTile.pixelY);
      child.setOrigin(0, 0);
      child.setScale(0.25);
      child.enableBody(true, child.x, child.y, true, true);
    });
    this.hearts = this.physics.add.group({
      key: "heart",
      allowGravity: false,
      repeat: 15,
    });

    this.hearts.children.iterate(function (child) {
      var randomTile = Phaser.Utils.Array.GetRandom(emptyTiles);

      child.setPosition(randomTile.pixelX, randomTile.pixelY);
      child.setOrigin(0, 0);
      child.setScale(0.25);
      child.enableBody(true, child.x, child.y, true, true);
    });



    this.paper = new Items(this, 150, 180, "paper").setScale(0.25);
    this.scissors = new Items(this, 150, 160, "scissors").setScale(0.25);

    this.physics.add.collider(
      this.player,
      this.rocks,
      (player, item) => {
        this.inventory.addItem(item.texture.key, 1);
        console.log("item", item);
        item.destroy();
      },

      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.hearts,
      (player, item) => {
        this.heart = this.scene.get("Heart");
        this.heart.gainHp(item.texture.key, 1);

        item.destroy();
      },

      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.paper,
      () => {
        this.inventory.addItem(this.paper.texture.key, 1);
        this.paper.destroy();
      },
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.scissors,
      () => {
        this.inventory.addItem(this.scissors.texture.key, 1);

        this.scissors.destroy();
      },
      null,
      this
    );

    // WASD KEYS FOR MOVEMENT
    this.keys = this.input.keyboard.addKeys("W,S,A,D");
  }

  update() {
    this.player.update(this.keys);
  
  }
}
