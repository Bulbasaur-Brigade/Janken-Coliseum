import Phaser from "phaser";
// import Player from "../entity/player";
/**
 * Means the player has not anything
 */
const NOTHING_SELECTION_MODE = "NOTHING_SELECTTED";

/**
 * Means player needs click shoot to finalize selection
 */
const BEFORE_SHOT_MODE = "BEOFRE_SHOOT";

/**
 * Means that shooting is in progress
 */
const SHOOTING_MODE = "SHOOTING";

/**
 * This means the player one
 */
const OUTCOME_PLAYER_WON = "player_won";

/**
 * This means computer won
 */
const OUTCOME_COMPUTER_WON = "computer_won";

/**
 * This means that the tie
 */
const OUTCOME_TIE = "tie";
/**
 * This is the key for rock
 */
const ROCK = "rock";

/**
 * This is the key for paper
 */
const PAPER = "paper";

/**
 * This is the key for scissors
 */
const SCISSORS = "scissors";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("BattleScene");
  }
  init() {
    this.rules = {
      rock: SCISSORS,
      paper: ROCK,
      scissors: PAPER,
    };
    this.mode = NOTHING_SELECTION_MODE;
    this.selectedSprite = null;
    this.playerWins = 0;
    this.computerWins = 0;
  }
  preload() {
    this.load.image("battleScene", "assets/backgrounds/battleScene.jpg");
    this.load.image(ROCK, "assets/sprites/rock.jpg");
    this.load.image(PAPER, "assets/sprites/paper.jpg");
    this.load.image(SCISSORS, "assets/sprites/scissors.jpg");
  }
  create() {
    // this.add.text(100, 100, "Hello world");
    this.add.image(0, 0, "battleScene").setOrigin(0, 0);

    this.playerRock = this.add.sprite(100, 160, ROCK).setScale(0.1);
    this.playerPaper = this.add.sprite(100, 250, PAPER).setScale(0.1);
    this.playerScissors = this.add.sprite(100, 350, SCISSORS).setScale(0.1);
    // Player Sprites
    this.playerSprites = [
      this.playerRock,
      this.playerPaper,
      this.playerScissors,
    ];

    this.playerSprites.forEach((sprite) => {
      sprite.setInteractive();
      sprite.on("pointerdown", (pointer, localX, localY) => {
        this.selectMove(sprite);
      });
    });

    this.aiRock = this.add.sprite(600, 160, ROCK).setScale(0.1);
    this.aiPaper = this.add.sprite(600, 250, PAPER).setScale(0.1);
    this.aiScissors = this.add.sprite(600, 350, SCISSORS).setScale(0.1);
    // Computer sprites
    this.aiSprites = [this.aiRock, this.aiPaper, this.aiScissors];

    // all sprites
    this.sprites = [
      this.playerRock,
      this.playerPaper,
      this.playerScissors,
      this.aiRock,
      this.aiPaper,
      this.aiScissors,
    ];

    this.add.text(50, 20, "Player").setScale(2);
    this.add.text(550, 20, "Computer").setScale(2);

    this.gameStateText = this.add.text(300, 550, "Select Move").setScale(2);
    this.gameStateText.setInteractive();

    this.scoreText = this.add.text(320, 20, "0 / 0").setScale(2);

    this.gameStateText.on("pointerdown", (pointer, localX, localY) => {
      this.shoot();
    });
  }
  // selectMove(sprite){
  //   if()
  // }
  // update() {}
}
