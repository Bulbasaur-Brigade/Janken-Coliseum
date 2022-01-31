import Phaser from "phaser";
import Player from "../entity/Player";

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");
  }

  preload() {
    this.load.image("tiles", "assets/maps/tilemap.png");
    this.load.tilemapTiledJSON("tilemap", "assets/maps/overworldMap.json");
    this.load.spritesheet("character", "assets/spriteSheets/characters.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
    //player
    this.load.image("player", "assets/sprites/sensei.png");
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
  create() {
    // Start animations
    this.createAnimations();
    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: "tilemap" });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage("characters", "tiles", 16, 16);

    // Layers
    const waterLayer = map.createLayer("Water", tileset, 0, 0);
    const groundLayer = map.createLayer("Ground", tileset, 0, 0);
    const npcLayer = map.createLayer("NPC", tileset, 0, 0);
    const interactiveLayer = map.createLayer("Interactive", tileset, 0, 0);
    const overheadLayer = map.createLayer("Overhead", tileset, 0, 0);

    // Music
    this.bgMusic = this.sound.add("Pallet", { volume: 0.15 }, true);
    this.bgMusic.play();
    this.walkSound = this.sound.add("Walk", { volume: 0.4 });
    //Player
    this.player = new Player(
      this,
      this.data.get("playercordX") || 200,
      this.data.get("playercordY") || 200,
      "character"
    ).setScale(0.25);
    // this.player.setPipeline("Light2D");

    // var light = this.lights.addLight(200, 200, 200);
    // this.lights.enable().setAmbientColor(0x555555);

    this.cursors = this.input.keyboard.createCursorKeys();

    //Collisions
    waterLayer.setCollisionByProperty({ collides: true });
    this.physics.add.collider(this.player, waterLayer);

    groundLayer.setCollisionFromCollisionGroup({ collide: true });
    this.physics.add.collider(this.player, groundLayer);

    npcLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(
      this.player,
      npcLayer,
      () => {
        this.data.set("playercordX", this.player.x);
        this.data.set("playercordY", this.player.y);
        this.scene.start("BattleScene");
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
  }
  update() {
    this.player.update(this.cursors, this.walkSound);
  }
}
