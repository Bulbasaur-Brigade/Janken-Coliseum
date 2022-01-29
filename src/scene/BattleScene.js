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
    this.load.image(ROCK, "assets/sprites/rock.png");
    this.load.image(PAPER, "assets/sprites/paper.png");
    this.load.image(SCISSORS, "assets/sprites/scissors.png");
  }
  create() {
    this.add.image(0, 0, "battleScene").setOrigin(0, 0).setScale(0.8);

    this.playerRock = this.add.sprite(100, 150, ROCK).setScale(1.5);
    this.playerPaper = this.add.sprite(100, 300, PAPER).setScale(1.5);
    this.playerScissors = this.add.sprite(100, 450, SCISSORS).setScale(1.5);
    // Player Sprites
    this.playerSprites = [
      this.playerRock,
      this.playerPaper,
      this.playerScissors,
    ];

    this.playerSprites.forEach((sprite) => {
      sprite.setInteractive();
      sprite.on("pointerdown", () => {
        this.selectMove(sprite);
      });
    });

    this.aiRock = this.add.sprite(675, 150, ROCK).setScale(1.5);
    this.aiPaper = this.add.sprite(675, 300, PAPER).setScale(1.5);
    this.aiScissors = this.add.sprite(675, 450, SCISSORS).setScale(1.5);
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
    this.add.text(575, 20, "Computer").setScale(2);
    this.add.text(375, 300, "Vs").setScale(3);

    this.gameStateText = this.add.text(300, 550, "Select Move").setScale(2);
    this.gameStateText.setInteractive();

    this.scoreText = this.add.text(320, 20, "0 - 0").setScale(2);

    this.gameStateText.on("pointerdown", () => {
      this.shoot();
    });

    // this.input.keyboard.on("keydown-SPACE", function () {}, this);
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
      this.selectedSprite.x = 300;
      this.selectedSprite.y = 300;
      computerSelectedSprite.x = 500;
      computerSelectedSprite.y = 300;

      this.gameStateText.setText("You Win");
      this.time.delayedCall(1500, () => {
        this.reset();
      });
      this.playerWins += 1;
      this.updateScore();
    }

    if (this.winner == OUTCOME_COMPUTER_WON) {
      this.selectedSprite.x = 300;
      this.selectedSprite.y = 300;
      computerSelectedSprite.x = 500;
      computerSelectedSprite.y = 300;
      this.gameStateText.setText("You Lose");
      this.time.delayedCall(1500, () => {
        this.reset();
      });
      this.computerWins += 1;
      this.updateScore();
    }

    if (this.winner == OUTCOME_TIE) {
      this.selectedSprite.x = 300;
      this.selectedSprite.y = 300;
      computerSelectedSprite.x = 500;
      computerSelectedSprite.y = 300;
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
    // reset the location of the sprites and change the opacity back to 1
    this.playerSprites.forEach((sprite, index) => {
      sprite.x = 100;
      sprite.y = 150 * (index + 1);
      sprite.alpha = 1;
    });

    this.aiSprites.forEach((sprite, index) => {
      sprite.x = 675;
      sprite.y = 150 * (index + 1);
      // alpha controls the opacity
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
    this.scoreText.setText(this.playerWins + " - " + this.computerWins);
  }
  resetAlphasOnPlayerSprites() {
    this.playerSprites.forEach((sprite) => {
      sprite.alpha = 1;
    });
  }
  update() {
    if (this.playerWins === 2 || this.computerWins === 2) {
      this.scene.start("OverworldScene");
      this.playerWins = 0;
      this.computerWins = 0;
    }
  }
}
