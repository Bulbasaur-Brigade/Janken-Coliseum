import Phaser from "phaser";
import Player from "../entity/Player";
import Items from "../entity/Items";
// import Inventory from "../entity/Inventory";

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");

    this.playerData = { hp: 0, items: [] };
  }
  addItem(name, amount) {
    for (let i = 0; i < this.playerData.items.length; i++) {
      if (this.playerData.items[i].name === name) {
        this.playerData.items[i].amount += amount;
        return;
      }
    }
    this.playerData.items.push({ name: name, amount: amount });
  }
  removeItem(name, amount) {
    for (let i = 0; i < this.playerData.items.length; i++) {
      if (this.playerData.items[i].name === name) {
        this.playerData.items[i].amount -= amount;
        if (this.playerData.items[i].amount <= 0) {
          this.playerData.items.splice(i, 1);
        }
        return;
      }
    }
    this.playerData.items.push({ name: name, amount: amount });
  }
  // init() {}
  preload() {
    this.load.image("tiles", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("tilemap", "assets/maps/overworldMap.json");
    this.load.spritesheet("character", "assets/spriteSheets/characters.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
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
  createPlayer() {
    this.playerData.hp += 3;
    this.registry.set("playerData", this.playerData);
  }
  create() {
    //  Hearts
    this.scene.run("Heart");

    this.createPlayer();
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

    this.cursors = this.input.keyboard.createCursorKeys();

    //Collisions
    //waterLayer.setCollisionByProperty({ collides: true });
    //this.physics.add.collider(this.player, waterLayer);

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
        this.scene.launch("BattleScene");
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

    // Inventory
    // this.inventory = new Inventory();
    // this.registry.set("inventory", this.player.inventory);

    this.graphics = this.add.graphics();
    this.graphics.lineStyle(1);
    this.graphics.strokeRect(210, 410, 75, 25).setScrollFactor(0, 0);

    // for (let i = 0; i < 10; i++) {
    //   let xx = Phaser.Math.Between(100, 200);
    //   let yy = Phaser.Math.Between(0, 400);
    //   this.rock = new Items(this, xx, yy, "rock", i).setScale(0.25);
    //   this.items.push(this.rock);
    //   // console.log("this.items", this.items);
    // this.rockStatic = new Items(this, 210, 410, "rock")

    this.rock = new Items(this, 150, 200, "rock").setScale(0.25);
    this.physics.add.collider(
      this.player,
      this.rock,
      () => {
        this.addItem(this.rock, 1);
        // this.registry.set("inventory", this.player.inventory);
        console.log("this.player.inventory", this.playerData);

        this.staticRock = new Items(this, 220, 420, "rock")
          .setScale(0.25)
          .setScrollFactor(0, 0);
        this.rock.destroy();
        // this.rockText.setText("Rock-" + this.rockCounter);
      },
      null,
      this
    );

    this.paper = new Items(this, 150, 180, "paper").setScale(0.25);
    this.scissors = new Items(this, 150, 160, "scissors").setScale(0.25);

    // this.rockText = this.add
    //   .text(200, 400, "Rock-0")
    //   .setScrollFactor(0, 0)
    //   .setScale(1);
    // this.paperText = this.add
    //   .text(200, 380, "Paper-0")
    //   .setScrollFactor(0, 0)
    //   .setScale(1);
    // this.scissorsText = this.add
    //   .text(200, 360, "Scissors-0")
    //   .setScrollFactor(0, 0)
    //   .setScale(1);

    // this.rockText.setScrollFactor(100, 100);
    // this.staticRock = this.physics.add
    //   .staticImage(0, 325, "rock")
    //   .setScrollFactor(0, 0);

    this.physics.add.collider(
      this.player,
      this.paper,
      () => {
        this.addItem(this.paper, 1);
        // this.registry.set("inventory", this.player.inventory);
        console.log(this.playerData);
        this.staticPaper = new Items(this, 245, 420, "paper")
          .setScale(0.25)
          .setScrollFactor(0, 0);
        this.paper.destroy();
      },
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      this.scissors,
      () => {
        this.addItem(this.scissors, 1);
        console.log(this.playerData);
        this.staticScissors = new Items(this, 270, 420, "scissors")
          .setScale(0.25)
          .setScrollFactor(0, 0);
        this.scissors.destroy();
      },
      null,
      this
    );
  }
  // createRock(x, y) {
  //   this.rockGroup.create(x, y, "rock");
  // }
  update() {
    this.player.update(this.cursors, this.walkSound);
  }
}
