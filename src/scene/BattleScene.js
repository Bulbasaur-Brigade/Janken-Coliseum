import Phaser from "phaser";
import { sceneEvents } from "../Events/EventsCenter";
// MODES
// Means the player has not anything
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
  init(data) {
    // this.data = data;
    // console.log("this.data", this.data);
    // Rule Set
    this.rules = {
      rock: SCISSORS,
      paper: ROCK,
      scissors: PAPER,
    };
    // initial mode where nothing is selected
    this.mode = NOTHING_SELECTION_MODE;
    this.selectedSprite = null;
    // Score  for player and computer
    this.playerWins = 0;
    this.computerWins = 0;
  }
  preload() {
    this.load.bitmapFont(
      "carrier_command",
      "assets/fonts/carrier_command.png",
      "assets/fonts/carrier_command.xml"
    );
    this.load.image("battleScene", "assets/backgrounds/battleScene.jpg");
    this.load.image(ROCK, "assets/sprites/rock.png");
    this.load.image(PAPER, "assets/sprites/paper.png");
    this.load.image(SCISSORS, "assets/sprites/scissors.png");
    // Battle Music
    this.load.audio("Battle", "assets/audio/Battle.mp3");
  }
  gainHp() {
    let data = localStorage.getItem("hp");
    let hp = data ? JSON.parse(data) : "";
    if (hp < 3) {
      hp += 1;
    } else {
      hp += 0;
    }

    localStorage.setItem("hp", JSON.stringify(hp));
    console.log("localStorage", localStorage);
  }
  getAndSetItems() {
    let data = localStorage.getItem("items");
    let items = data ? JSON.parse(data) : [];
    return items;
  }

  loseHp() {
    let data = localStorage.getItem("hp");
    let hp = data ? JSON.parse(data) : "";

    hp -= 1;
    localStorage.setItem("hp", JSON.stringify(hp));
    console.log("localStorage", localStorage);
  }
  create() {
    this.playerItems = this.getAndSetItems();
    console.log("this.playerItems", this.playerItems);
    // this.playerData = this.registry.get("playerData");
    // console.log("playerData", this.playerData);
    // Bg Music
    this.battleMusic = this.sound.add("Battle", { volume: 0.15 }, true);
    this.battleMusic.play();

    this.add.image(0, 0, "battleScene").setOrigin(0, 0).setScale(1);

    // Player Sprites
    const rock = this.add.sprite(100, 150, ROCK).setScale(1.5);
    const paper = this.add.sprite(100, 300, PAPER).setScale(1.5);
    const scissors = this.add.sprite(100, 450, SCISSORS).setScale(1.5);

    this.playerSprites = [
      { name: rock, amount: 0 },
      { name: paper, amount: 0 },
      { name: scissors, amount: 0 },
    ];
    this.filteredPlayerSprites = [];

    for (let i = 0; i < this.playerItems.length; i++) {
      console.log(this.playerItems);
      if (this.playerItems[i].name === this.playerSprites[i].name.texture.key) {
        this.filteredPlayerSprites.push(this.playerSprites[i].name);
      }

      if (this.playerItems[i].amount === 0) {
        this.playerSprites[i].name.setVisible(false);
      }
    }
    console.log("this.filteredPlayerSprites", this.filteredPlayerSprites);

    // for (let i = 0; i < this.playerSprites.length; i++) {
    //   this.playerSprites[i].amount;
    //   if (this.playerSprites[i].amount === 0) {

    //   }
    // }

    //Make the Player Sprites interactive
    this.filteredPlayerSprites.forEach((sprite) => {
      sprite.setInteractive({ useHandCursor: true });
      sprite.on("pointerdown", () => {
        this.selectMove(sprite);
      });
    });
    // Computer sprites
    this.aiRock = this.add.sprite(675, 150, ROCK).setScale(1.5);
    this.aiPaper = this.add.sprite(675, 300, PAPER).setScale(1.5);
    this.aiScissors = this.add.sprite(675, 450, SCISSORS).setScale(1.5);
    this.aiSprites = [this.aiRock, this.aiPaper, this.aiScissors];

    // all sprites
    this.sprites = [
      rock,
      paper,
      scissors,
      this.aiRock,
      this.aiPaper,
      this.aiScissors,
    ];

    this.add.bitmapText(50, 20, "carrier_command", "Player", 25);
    this.add.bitmapText(540, 20, "carrier_command", "Computer", 25);
    this.add.bitmapText(375, 300, "carrier_command", "Vs");

    // button to select after you make your choice
    this.gameStateText = this.add.bitmapText(
      275,
      530,
      "carrier_command",
      "Select Move",
      25
    );
    this.gameStateText.setInteractive({ useHandCursor: true });

    this.scoreText = this.add.bitmapText(
      320,
      20,
      "carrier_command",
      "0 - 0",
      25
    );

    this.gameStateText.on("pointerdown", () => {
      this.shoot();
    });
    // .on("pointerover", () => this.gameStateText)
    // .on("pointerout", () => this.gameStateText.setStyle({ fill: "#111" }));
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
      this.gainHp();
      this.winText = this.add.bitmapText(
        280,
        400,
        "carrier_command",
        "You Win!"
      );
      // this.gameStateText.setText("You Win");
      this.time.delayedCall(2500, () => {
        this.winText.visible = false;
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
      this.loseHp();
      this.loseText = this.add.bitmapText(
        280,
        400,
        "carrier_command",
        "You Lose!"
      );
      this.time.delayedCall(2500, () => {
        this.loseText.visible = false;
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

      this.tieText = this.add.bitmapText(
        280,
        400,
        "carrier_command",
        "Tie Game!"
      );

      this.time.delayedCall(2500, () => {
        this.tieText.visible = false;
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
  updateScore() {
    this.scoreText.setText(this.playerWins + " - " + this.computerWins);
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
    if (this.playerWins === 1 || this.computerWins === 1) {
      this.scene.start("SinglePlayerMapScene");
      this.battleMusic.stop();
      this.playerWins = 0;
      this.computerWins = 0;
    }
  }
}
