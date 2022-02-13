import Phaser from "phaser";
import SceneTransition from "./SceneTransition";
import store from "../redux/store";
import { addHp, loseHp } from "../redux/hpReducer";
import { addItem, loseItem } from "../redux/inventoryReducer";
import { isDefeated } from "../redux/npcBoard";
// MODES
// Means the player doesn't have anything
const NOTHING_SELECTION_MODE = "NOTHING_SELECTED";
//  Means player needs click shoot to finalize selection
const BEFORE_SHOT_MODE = "BEFORE_SHOOT";
//  Means that shooting is in progress
const SHOOTING_MODE = "SHOOTING";

// OUTCOMES
// Player Won
const OUTCOME_PLAYER_WON = "OUTCOME_PLAYER_WON";
// Computer Won
const OUTCOME_COMPUTER_WON = "OUTCOME_COMPUTER_WON";
// Its a Tie
const OUTCOME_TIE = "OUTCOME_TIE";

// RULES SET
// Key for rock
const ROCK = "rock";
// Key for paper
const PAPER = "paper";
// Key for scissors
const SCISSORS = "scissors";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("BattleScene");
  }

  init() {
    //Battle NPC
    this.computer = store.getState();
    this.npcName = this.computer.npcBoardReducer.singleNPC;

    // Rule Set
    this.rules = {
      rock: SCISSORS,
      paper: ROCK,
      scissors: PAPER,
    };
    // initial mode where nothing is selected
    this.mode = NOTHING_SELECTION_MODE;
    this.selectedSprite = null;
    // Computer Hearts

    if (
      this.npcName === "mac" ||
      this.npcName === "zach" ||
      this.npcName === "omar"
    ) {
      this.computerHearts = 5;
    } else {
      this.computerHearts = 2;
    }
    // Getting DATA

    const data = store.getState();
    this.hp = data.hpReducer;
    this.items = data.inventoryReducer.itemArray;
    this.npcComputer = data.npcBoardReducer.singleNPC;
  }
  preload() {
    this.load.image(ROCK, "assets/sprites/rock.png");
    this.load.image(PAPER, "assets/sprites/paper.png");
    this.load.image(SCISSORS, "assets/sprites/scissors.png");
  }
  // gainHp() {
  //   if (this.hp < 10) {
  //     store.dispatch(addHp(1));
  //   } else {
  //     store.dispatch(addHp(0));
  //   }
  // }

  loseItems(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].amount > 0) {
        if (this.items[i].name === item) {
          store.dispatch(loseItem(item));
        }
        if (this.items[i].amount === 0) {
          this.playerSprites[i].name.setVisible(false);
        }
      }
    }
  }
  gainItems(item) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === item) {
        store.dispatch(addItem(item));
      }
      if (this.items[i].amount > 0) {
        this.playerSprites[i].name.setVisible(true);
      }
    }
  }
  loseHp() {
    if (this.hp > 0) {
      store.dispatch(loseHp(1));
    }
  }
  gameLoss() {
    const data = store.getState();
    let hp = data.hpReducer;

    if (hp === 0) {
      this.time.delayedCall(3800, () => {
        this.scene.start("LossScene");
        this.scene.stop("Heart");
        this.scene.stop("NpcHearts");
        this.scene.stop("Inventory");
        this.scene.stop("QuestUi");
        this.scene.stop("SinglePlayerMapScene");
        this.music = this.scene.get("SinglePlayerMapScene");
        this.music.bgMusic.stop();
        this.battleMusic.stop();
      });
    }
  }

  gameWin() {
    if (this.computerHearts < 6) {
      const data = store.getState();

      const scene = data.sceneReducer;

      store.dispatch(isDefeated(this.computer.npcBoardReducer.singleNPC));

      if (scene === "SinglePlayerMapScene") {
        this.time.delayedCall(4000, () => {
          this.scene.switch("SinglePlayerMapScene");
          this.scene.start("QuestUi");
          this.scene.stop();
          this.scene.stop("NpcHearts");
          this.battleMusic.stop();
          this.music = this.scene.get("SinglePlayerMapScene");
          this.music.bgMusic.play();
        });
      } else if (scene === "RoomOne") {
        {
          this.time.delayedCall(4000, () => {
            this.scene.switch("RoomOne");
            this.scene.start("QuestUi");
            this.scene.stop();
            this.scene.stop("NpcHearts");
            this.battleMusic.stop();
            this.music = this.scene.get("SinglePlayerMapScene");
            this.music.bgMusic.play();
          });
        }
      } else if (scene === "RoomTwo") {
        {
          this.time.delayedCall(4000, () => {
            this.scene.switch("RoomTwo");
            this.scene.start("QuestUi");
            this.scene.stop();
            this.scene.stop("NpcHearts");
            this.battleMusic.stop();
            this.music = this.scene.get("SinglePlayerMapScene");
            this.music.bgMusic.play();
          });
        }
      } else if (scene === "RoomThree") {
        {
          this.time.delayedCall(4000, () => {
            this.scene.switch("RoomThree");
            this.scene.start("QuestUi");
            this.scene.stop();
            this.scene.stop("NpcHearts");
            this.battleMusic.stop();
            this.music = this.scene.get("SinglePlayerMapScene");
            this.music.bgMusic.play();
          });
        }
      }
    }
  }
  dynamicText() {
    const data = store.getState();
    let hp = data.hpReducer;

    if (
      this.computerHearts === 0 ||
      (this.hp === 0 && this.items.every((item) => item.amount === 0)) ||
      this.items.every((item) => item.amount === 0) ||
      hp === 0
    ) {
      this.time.delayedCall(1300, () => {
        this.sprites.forEach((sprite) => sprite.setVisible(false));
      });
      this.time.delayedCall(1400, () => {
        this.textBorder.setVisible(true);
      });
    }
    if (this.computerHearts === 0) {
      // You win
      this.time.delayedCall(1400, () => {
        this.text.setVisible(true);
      });
    }
    // if you lose and also lose your items
    if (this.hp === 0 && this.items.every((item) => item.amount === 0)) {
      this.time.delayedCall(1400, () => {
        this.text.setText("You LOSE!").setVisible(true);
      });
    }

    // You lost your items
    if (this.items.every((item) => item.amount === 0)) {
      this.time.delayedCall(1400, () => {
        this.text
          .setText("YOU LOST  \n\nYOUR ITEMS!\n\nGO FIND SOME!")
          .setVisible(true);
      });
    }
    // You lose
    if (hp === 0) {
      this.time.delayedCall(1400, () => {
        this.text.setText("YOU LOSE!").setVisible(true);
      });
    }
  }
  playerHasNoItems() {
    const data = store.getState();
    const scene = data.sceneReducer;

    if (this.items.every((item) => item.amount === 0)) {
      if (scene === "SinglePlayerMapScene") {
        this.time.delayedCall(4000, () => {
          this.scene.switch("SinglePlayerMapScene");
          this.scene.start("QuestUi");
          this.battleMusic.stop();

          this.scene.stop("NpcHearts");
          this.music = this.scene.get("SinglePlayerMapScene");
          this.music.bgMusic.play();
        });
      } else if (scene === "RoomOne") {
        {
          this.time.delayedCall(4000, () => {
            this.scene.switch("RoomOne");
            this.scene.start("QuestUi");
            this.scene.stop();
            this.scene.stop("NpcHearts");
            this.battleMusic.stop();
            this.music = this.scene.get("SinglePlayerMapScene");
            this.music.bgMusic.play();
          });
        }
      } else if (scene === "RoomTwo") {
        {
          this.time.delayedCall(4000, () => {
            this.scene.switch("RoomTwo");
            this.scene.start("QuestUi");
            this.scene.stop();
            this.scene.stop("NpcHearts");
            this.battleMusic.stop();
            this.music = this.scene.get("SinglePlayerMapScene");
            this.music.bgMusic.play();
          });
        }
      } else {
        {
          this.time.delayedCall(4000, () => {
            this.scene.switch("RoomThree");
            this.scene.start("QuestUi");
            this.scene.stop();
            this.scene.stop("NpcHearts");
            this.battleMusic.stop();
            this.music = this.scene.get("SinglePlayerMapScene");
            this.music.bgMusic.play();
          });
        }
      }
    }

    //
  }
  create() {
    this.scene.run("NpcHearts");

    this.textBorder = this.add
      .rectangle(400, 280, 400, 300, 0xe34234)
      .setDepth(2)
      .setStrokeStyle(4, 0xffffff)
      .setVisible(false);
    this.text = this.add
      .bitmapText(
        250,
        230,
        "carrier_command",
        `You defeated\n\n\n ${this.npcName}!`,
        20
      )
      .setVisible(false)
      .setDepth(2);
    // Particle effects
    this.particles = this.add.particles("explosion").setDepth(2);

    this.explode = this.sound.add("explode", { volume: 0.3 });
    this.particles.createEmitter({
      frame: ["smoke-puff", "cloud", "smoke-puff", "smoke0"],
      angle: { min: 240, max: 300 },
      speed: { min: 200, max: 300 },
      quantity: 6,
      lifespan: 2000,
      alpha: { start: 1, end: 0 },
      scale: { start: 1.5, end: 0.5 },
      on: false,
    });

    this.particles.createEmitter({
      frame: "stone",
      angle: { min: 240, max: 300 },
      speed: { min: 400, max: 600 },
      quantity: { min: 2, max: 10 },
      lifespan: 4000,
      alpha: { start: 1, end: 0 },
      scale: { min: 0.05, max: 0.4 },
      rotate: { start: 0, end: 360, ease: "Back.easeOut" },
      gravityY: 800,
      on: false,
    });

    this.particles.createEmitter({
      frame: "muzzleflash2",
      lifespan: 200,
      scale: { start: 2, end: 0 },
      rotate: { start: 0, end: 180 },
      on: false,
    });

    // Bg Music
    this.battleMusic = this.sound.add("Battle", { volume: 0.1, loop: true });
    this.battleMusic.play();

    this.add.image(0, 0, "battleScene").setOrigin(0, 0).setScale(1);

    // Player Sprites
    const rock = this.physics.add.sprite(100, 150, ROCK).setScale(1.5);
    const paper = this.physics.add.sprite(100, 300, PAPER).setScale(1.5);
    const scissors = this.physics.add.sprite(100, 450, SCISSORS).setScale(1.5);

    this.playerSprites = [
      { name: rock, amount: 0 },
      { name: paper, amount: 0 },
      { name: scissors, amount: 0 },
    ];
    this.filteredPlayerSprites = [];

    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name === this.playerSprites[i].name.texture.key) {
        this.filteredPlayerSprites.push(this.playerSprites[i].name);
      }

      if (this.items[i].amount === 0) {
        this.playerSprites[i].name.setVisible(false);
      }
    }

    //Make the Player Sprites interactive
    this.filteredPlayerSprites.forEach((sprite) => {
      sprite.setInteractive({ useHandCursor: true });

      sprite.on("pointerdown", () => {
        this.selectMove(sprite);
      });
    });
    // Computer sprites
    this.aiRock = this.physics.add.sprite(675, 150, ROCK).setScale(1.5);
    this.aiPaper = this.physics.add.sprite(675, 300, PAPER).setScale(1.5);
    this.aiScissors = this.physics.add.sprite(675, 450, SCISSORS).setScale(1.5);
    this.aiSprites = [this.aiRock, this.aiPaper, this.aiScissors];

    // all sprites
    this.sprites = [
      ...this.filteredPlayerSprites,
      this.aiRock,
      this.aiPaper,
      this.aiScissors,
    ];

    this.add.bitmapText(50, 20, "carrier_command", "Player", 25);
    this.add.bitmapText(530, 20, "carrier_command", this.npcComputer, 25);

    // button to select after you make your choice
    this.gameStateText = this.add.bitmapText(
      275,
      530,
      "carrier_command",
      "Select Move",
      25
    );
    this.gameStateText.setInteractive({ useHandCursor: true });
    this.gameStateText.on("pointerdown", () => {
      this.shoot();
    });
  }

  selectMove(sprite) {
    if (this.mode === SHOOTING_MODE) return;
    this.resetAlphasOnPlayerSprites();
    // alpha is for opacity
    sprite.alpha = 0.5;
    this.gameStateText.setText("Shoot!");
    this.mode = BEFORE_SHOT_MODE;
    this.selectedSprite = sprite;
  }

  shoot() {
    if (this.mode !== BEFORE_SHOT_MODE) return;
    this.mode = SHOOTING_MODE;
    this.selectedSprite.alpha = 1;
    let computerSelectedSprite = this.aiSprites[Phaser.Math.Between(0, 2)];

    this.winner = this.whoWon(
      this.selectedSprite.texture.key,
      computerSelectedSprite.texture.key
    );

    if (this.winner == OUTCOME_PLAYER_WON) {
      this.physics.moveTo(this.selectedSprite, 400, 300, 160, 1200);
      this.physics.moveTo(computerSelectedSprite, 400, 300, 160, 1200);
      this.physics.add.overlap(
        this.selectedSprite,
        computerSelectedSprite,
        () => {
          this.selectedSprite.body.stop();
          computerSelectedSprite.body.stop();
        }
      );

      this.time.delayedCall(950, () => {
        this.particles.emitParticleAt(400, 300);
        this.explode.play();
        this.computerHearts--;
      });
      this.time.delayedCall(1500, () => {
        this.gainItems(computerSelectedSprite.texture.key);
        this.reset();
      });
    }

    if (this.winner == OUTCOME_COMPUTER_WON) {
      this.physics.moveTo(this.selectedSprite, 400, 300, 160, 1200);
      this.physics.moveTo(computerSelectedSprite, 400, 300, 160, 1200);
      this.physics.add.overlap(
        this.selectedSprite,
        computerSelectedSprite,
        () => {
          this.selectedSprite.body.stop();
          computerSelectedSprite.body.stop();
        }
      );

      this.time.delayedCall(950, () => {
        this.particles.emitParticleAt(400, 300);
        this.explode.play();
      });
      this.time.delayedCall(1500, () => {
        this.loseHp();
        this.loseItems(this.selectedSprite.texture.key);
        this.reset();
      });
    }

    if (this.winner == OUTCOME_TIE) {
      this.physics.moveTo(this.selectedSprite, 400, 300, 160, 1200);
      this.physics.moveTo(computerSelectedSprite, 400, 300, 160, 1200);
      this.physics.add.overlap(
        this.selectedSprite,
        computerSelectedSprite,
        () => {
          this.selectedSprite.body.stop();
          computerSelectedSprite.body.stop();
        }
      );

      this.time.delayedCall(950, () => {
        this.particles.emitParticleAt(400, 300);
        this.explode.play();
      });
      this.time.delayedCall(1500, () => {
        this.reset();
      });
    }
  }
  reset() {
    this.mode = NOTHING_SELECTION_MODE;
    this.selectedSprite = null;
    this.gameStateText.setText("Select Move");
    // reset the location of the sprites and change the opacity back to 1
    this.filteredPlayerSprites.forEach((sprite, index) => {
      sprite.x = 100;
      sprite.y = 150 * (index + 1);
      sprite.alpha = 1;
    });

    this.aiSprites.forEach((sprite, index) => {
      sprite.x = 675;
      sprite.y = 150 * (index + 1);
      sprite.alpha = 1;
    });
  }
  whoWon(playerKey, computerKey) {
    // this.rules = {
    //   rock: SCISSORS,
    //   paper: ROCK,
    //   scissors: PAPER,
    // };
    if (this.rules[playerKey] === computerKey) {
      return OUTCOME_PLAYER_WON;
    }

    if (this.rules[computerKey] === playerKey) {
      return OUTCOME_COMPUTER_WON;
    }

    return OUTCOME_TIE;
  }
  // Resets the Opacity of the Sprites
  resetAlphasOnPlayerSprites() {
    this.filteredPlayerSprites.forEach((sprite) => {
      sprite.alpha = 1;
    });
  }

  // What happens after a player wins or loses
  // Scene End
  update() {
    //   if (this.hp === 2) {
    //   }
    //   if (this.computerHearts === 0) {
    //     this.gameWin();
    //   }
    //   if (this.counter === 1 && this.hp > 0) {
    this.dynamicText();
    this.gameLoss();
    this.playerHasNoItems();
    this.gameWin();
    //   }
  }
}
