import Phaser from "phaser";
import Player from "../entity/Player";
import Items from "../entity/Items";
import { sceneEvents } from "../Events/EventsCenter";

export default class SinglePlayerMapScene extends Phaser.Scene {
  constructor() {
    super("SinglePlayerMapScene");
  }

  // init() {}
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
    // Music
    this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
    this.load.audio("Walk", "assets/audio/walk.mp3");
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
  setHp() {
    let hp = parseInt(localStorage.getItem("hp")) || 3;

    localStorage.setItem("hp", JSON.stringify(hp));
  }
  setItems() {
    let items = [
      { name: "rock", amount: 0 },
      { name: "paper", amount: 0 },
      { name: "scissors", amount: 0 },
    ];
    localStorage.setItem("items", JSON.stringify(items));
  }
  addItem(name, amount) {
    let data = localStorage.getItem("items");
    let items = data ? JSON.parse(data) : [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].name === name) {
        items[i].amount += amount;
      }
    }

    localStorage.setItem("items", JSON.stringify(items));
    console.log("localStorage", items);
  }

  create() {
    // local Storage
    this.setHp();
    this.setItems();

    //  Hearts
    this.scene.run("Heart");

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
    this.walkSound = this.sound.add("Walk", { volume: 0.2 });
    //Player
    this.player = new Player(
      this,
      this.data.get("playercordX") || 250,
      this.data.get("playercordY") || 200,
      "character"
    ).setScale(0.25);

    // Set the registry Data for player
    // this.registry.set("playerData", this.player.playerData);

    this.cursors = this.input.keyboard.createCursorKeys();

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
        this.scene.pause();
        this.scene.run("BattleScene");
        this.bgMusic.stop();
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
    // Inventory Images
    this.staticRock = new Items(this, 220, 420, "rock")
      .setScale(0.25)
      .setScrollFactor(0, 0);
    this.staticPaper = new Items(this, 245, 420, "paper")
      .setScale(0.25)
      .setScrollFactor(0, 0);
    this.staticPaper = new Items(this, 245, 420, "paper")
      .setScale(0.25)
      .setScrollFactor(0, 0);
    this.rockText = this.add.text(220, 420, "0", 4).setScrollFactor(0, 0);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1);
    this.graphics.strokeRect(210, 410, 75, 25).setScrollFactor(0, 0);

    this.rock = new Items(this, 150, 200, "rock").setScale(0.25);

    this.paper = new Items(this, 150, 180, "paper").setScale(0.25);
    this.scissors = new Items(this, 150, 160, "scissors").setScale(0.25);

    // sceneEvents.on("update-hearts", this.test, this);
    // this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
    //   sceneEvents.off("update-hearts", this.test, this);
    // });

    this.physics.add.collider(
      this.player,
      this.rock,
      () => {
        this.addItem(this.rock.texture.key, 1);

        this.rock.destroy();
        // this.rockText.setText("Rock-" + this.rockCounter);
      },
      null,
      this
    );

    this.physics.add.collider(
      this.player,
      this.paper,
      () => {
        this.addItem(this.paper.texture.key, 1);
        // this.registry.set("inventory", this.player.inventory);
        console.log(this.playerData);

        this.paper.destroy();
      },
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.scissors,
      () => {
        this.addItem(this.scissors.texture.key, 1);

        this.scissors.destroy();
      },
      null,
      this
    );
  }

  update() {
    this.player.update(this.cursors, this.walkSound);
  }
}
