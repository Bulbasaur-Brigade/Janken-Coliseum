
import Phaser from 'phaser';
import Player from '../entity/Player';
import NPC from '../entity/NPC';
import Items from '../entity/Items';
import SceneTransition from './SceneTransition';

export default class SinglePlayerMapScene extends SceneTransition {
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
    this.load.spritesheet(
      'npc-character',
      'assets/spriteSheets/characters.png',
      {
        frameWidth: 64,
        frameHeight: 64,
      }
    );
    //NPC charcters
    this.load.image('sey', 'assets/sprites/npcs/sey.png');
    this.load.image('greg', 'assets/sprites/npcs/greg.png');
    this.load.image('margarita', 'assets/sprites/npcs/margarita.png');
    this.load.image('danny', 'assets/sprites/npcs/danny.png');
    this.load.image('mac', 'assets/sprites/npcs/mac.png');
    this.load.image('savion', 'assets/sprites/npcs/savion.png');
    this.load.image('omar', 'assets/sprites/npcs/omar.png');
    this.load.image('amber', 'assets/sprites/npcs/amber.png');
    this.load.image('devonne', 'assets/sprites/npcs/devonne.png');
    this.load.image('eric', 'assets/sprites/npcs/eric.png');
    this.load.image('zach', 'assets/sprites/npcs/zach.png');
    // Heart
    this.load.image("heart", "assets/sprites/heart.png");
    //Items
    this.load.image("rock", "assets/sprites/rock.png");
    this.load.image("paper", "assets/sprites/paper.png");
    this.load.image("scissors", "assets/sprites/scissors.png");
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
    this.inventory = this.scene.get("Inventory");

    //  Hearts
    this.scene.run("Heart");

    super.create();
    // Start animations
    this.createAnimations();
    // Creating Map using Tile Set
    const map = this.make.tilemap({ key: "tilemap" });
    // "characters" comes from name in Tiled software
    const tileset = map.addTilesetImage("characters", "tiles", 16, 16);

    // Layers

    const waterLayer = map.createLayer('Water', tileset, 0, 0);
    const groundLayer = map.createLayer('Ground', tileset, 0, 0);
    const interactiveLayer = map.createLayer('Interactive', tileset, 0, 0);
    const overheadLayer = map.createLayer('Overhead', tileset, 0, 0);

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

    //NPC generation/collision
    const npcLayer = map.getObjectLayer('NPC');
    npcLayer.objects.forEach((npc) => {
      const text = this.add.text(npc.x - 100, npc.y + 100, '', {
        font: '12px Courier',
        fill: '#F0F8FF',
      });
      const newNPC = new NPC(this, npc.x, npc.y, npc.type).setScale(0.25);
      this.physics.add.collider(
        this.player,
        newNPC,
        () => {
          //Dialog
          text.setText(`${npc.name} accepts\nyour challenge!!!`);
          text.setDepth(30);

          this.data.set('playercordX', this.player.x);
          this.data.set('playercordY', this.player.y);
          this.scene.start('BattleScene');
          this.bgMusic.stop();
        },
        null,
        this
      );
    });

    //Item randomized/overlaps
    const itemLayer = map.getObjectLayer('ItemSpawns');
    const itemArray = ['rock', 'paper', 'scissors', 'heart', ''];
    itemLayer.objects.forEach((item) => {
      const randomItem =
        itemArray[Math.floor(Math.random() * itemArray.length)];
      if (randomItem) {
        item.name = randomItem;
        const newItem = new Items(this, item.x, item.y, item.name).setScale(
          0.25
        );
        this.physics.add.collider(this.player, newItem);
      }
    });

    this.player.setHp();

    // Set the registry Data for player
    // this.registry.set("playerData", this.player.playerData);


    this.cursors = this.input.keyboard.createCursorKeys();

    //Collisions


    groundLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, groundLayer);


//     npcLayer.setCollisionByProperty({ collide: true });
//     this.physics.add.collider(
//       this.player,
//       npcLayer,
//       () => {
//         this.data.set("playercordX", this.player.x);
//         this.data.set("playercordY", this.player.y);
//         this.scene.pause("SinglePlayerMapScene");

//         this.scene.run("BattleScene");
//         this.bgMusic.stop();
//       },
//       null,
//       this
//     );


    interactiveLayer.setCollisionByProperty({ collide: true });
    this.physics.add.collider(this.player, interactiveLayer);

    this.player.setDepth(0);
    overheadLayer.setDepth(10);

    // Placeholder Camera
    const camera = this.cameras.main;
    camera.setZoom(2);
    camera.startFollow(this.player, true);
    // Inventory Images

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
        this.inventory.addItem(this.rock.texture.key, 1);

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
        this.inventory.addItem(this.paper.texture.key, 1);
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
        this.inventory.addItem(this.scissors.texture.key, 1);

        this.scissors.destroy();
      },
      null,
      this
    );
  }


  update() {
    this.player.update(this.cursors;
  }
}
