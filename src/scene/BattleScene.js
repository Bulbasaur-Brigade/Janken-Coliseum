import Phaser from "phaser";
// import Player from "../entity/player";
/**
 * Means the player has not anything
 */
const NOTHING_SELECTION_MODE = "NOTHING_SELECTED";

/**
 * Means player needs click shoot to finalize selection
 */
const BEFORE_SHOT_MODE = "BEFORE_SHOOT";

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
  selectMove(sprite) {
    if (this.mode === SHOOTING_MODE) return;
    this.resetAlphasOnPlayerSprites();
    // alpha is for opacity
    sprite.alpha = 0.5;
    this.gameStateText.setText("Saishowaguu!(Shoot!)");
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
      this.gameStateText.setText("You Win");
      this.time.delayedCall(1500, () => {
        this.reset();
      });
      this.playerWins += 1;
      this.updateScore();
    }

    if (this.winner == OUTCOME_COMPUTER_WON) {
      this.gameStateText.setText("You Lose");
      this.time.delayedCall(1500, () => {
        this.reset();
      });
      this.computerWins += 1;
      this.updateScore();
    }

    if (this.winner == OUTCOME_TIE) {
      this.gameStateText.setText("Tie Game");
      this.time.delayedCall(1500, () => {
        this.reset();
      });
    }
  }
  reset() {
    this.mode = NOTHING_SELECTION_MODE;
    this.selectedSprite = null;
    this.gameStateText.setText("Select Move");

    this.aiSprites.forEach((sprite, index) => {
      sprite.x = 540;
      sprite.y = 100 * (index + 1);
      // alpha controls the opacity
      sprite.alpha = 1;
    });

    this.playerSprites.forEach((sprite, index) => {
      sprite.x = 100;
      sprite.y = 100 * (index + 1);
      sprite.alpha = 1;
    });
  }
  whoWon(playerKey, computerKey) {
    // this.rules = {
    //   rock: SCISSORS,
    //   paper: ROCK,
    //   scissors: PAPER,
    // };
    if (this.rules[playerKey] == computerKey) {
      return OUTCOME_PLAYER_WON;
    }

    if (this.rules[computerKey] == playerKey) {
      return OUTCOME_COMPUTER_WON;
    }

    return OUTCOME_TIE;
  }
  updateScore() {
    this.scoreText.setText(this.playerWins + " / " + this.computerWins);
  }
  resetAlphasOnPlayerSprites() {
    this.playerSprites.forEach((sprite) => {
      sprite.alpha = 1;
    });
  }
  // update() {}
}
