import Phaser from 'phaser';
import SceneTransition from './SceneTransition';
import store from '../redux/store';
import { addHp, loseHp } from '../redux/hpReducer';
import { addItem, loseItem } from '../redux/inventoryReducer';
import { isDefeated } from '../redux/npcBoard';
// MODES
// Means the player doesn't have anything
const NOTHING_SELECTION_MODE = 'NOTHING_SELECTED';
//  Means player needs click shoot to finalize selection
const BEFORE_SHOT_MODE = 'BEFORE_SHOOT';
//  Means that shooting is in progress
const SHOOTING_MODE = 'SHOOTING';

// OUTCOMES
// Player Won
const OUTCOME_PLAYER_WON = 'OUTCOME_PLAYER_WON';
// Computer Won
const OUTCOME_COMPUTER_WON = 'OUTCOME_COMPUTER_WON';
// Its a Tie
const OUTCOME_TIE = 'OUTCOME_TIE';

// RULES SET
// Key for rock
const ROCK = 'rock';
// Key for paper
const PAPER = 'paper';
// Key for scissors
const SCISSORS = 'scissors';

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  init() {
    //Battle NPC
    this.computer = store.getState();
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
    this.computerHearts = 3;
    // Getting DATA
    const data = store.getState();
    this.hp = data.hpReducer;
    this.items = data.inventoryReducer.itemArray;
    this.npcComputer = data.npcBoardReducer.singleNPC;
  }
  preload() {
    this.load.bitmapFont(
      'carrier_command',
      'assets/fonts/carrier_command.png',
      'assets/fonts/carrier_command.xml'
    );
    this.load.image('battleScene', 'assets/backgrounds/battleScene.jpg');
    this.load.image(ROCK, 'assets/sprites/rock.png');
    this.load.image(PAPER, 'assets/sprites/paper.png');
    this.load.image(SCISSORS, 'assets/sprites/scissors.png');
    // Battle Music
    this.load.audio('Battle', 'assets/audio/Battle.mp3');
  }
  gainHp() {
    if (this.hp < 10) {
      store.dispatch(addHp(1));
    } else {
      store.dispatch(addHp(0));
    }
  }

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
    } else {
      store.dispatch(loseHp(0));
    }
  }
  gameLoss() {
    if (this.hp === 0) {
      this.scene.switch('LossScene');
      this.scene.stop('NpcHearts');
      this.battleMusic.stop();
    }
  }
  gameWin() {
    if (this.computerHearts === 2) {
      store.dispatch(isDefeated(this.computer.npcBoardReducer.singleNPC));
      this.scene.switch('SinglePlayerMapScene');
      this.scene.stop();
      this.scene.stop('NpcHearts');
      this.battleMusic.stop();
      this.music = this.scene.get('SinglePlayerMapScene');
      this.music.bgMusic.play();
    }
  }
  playerHasNoItems() {
    let counter = 0;
    if (this.items.every((item) => item.amount === 0)) {
      this.add.bitmapText(
        20,
        200,
        'carrier_command',
        'You lost your items \n\n\n Go collect some\n\n\n to Battle!',
        20
      );
      counter++;
    }
    if (counter === 1) {
      this.time.delayedCall(3000, () => {
        this.scene.switch('SinglePlayerMapScene');
        this.battleMusic.stop();
        this.scene.stop();
        this.scene.stop('NpcHearts');
        this.music = this.scene.get('SinglePlayerMapScene');
        this.music.bgMusic.play();
        counter = 0;
      });
    }
  }
  create() {
    // this.time.delayedCall(3500, () => {
    this.scene.run('NpcHearts');

    // });

    // super.create();

    // Bg Music
    this.battleMusic = this.sound.add('Battle', { volume: 0.15 }, true);
    this.battleMusic.play();

    this.add.image(0, 0, 'battleScene').setOrigin(0, 0).setScale(1);

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
      sprite.on('pointerdown', () => {
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

    this.add.bitmapText(50, 20, 'carrier_command', 'Player', 25);
    this.add.bitmapText(540, 20, 'carrier_command', this.npcComputer, 25);
    this.add.bitmapText(375, 300, 'carrier_command', 'Vs');

    // button to select after you make your choice
    this.gameStateText = this.add.bitmapText(
      275,
      530,
      'carrier_command',
      'Select Move',
      25
    );
    this.gameStateText.setInteractive({ useHandCursor: true });
    this.gameStateText.on('pointerdown', () => {
      this.shoot();
    });
  }

  selectMove(sprite) {
    if (this.mode === SHOOTING_MODE) return;
    this.resetAlphasOnPlayerSprites();
    // alpha is for opacity
    sprite.alpha = 0.5;
    this.gameStateText.setText('Shoot!');
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
      this.gainItems(computerSelectedSprite.texture.key);
      this.gainHp();
      this.winText = this.add.bitmapText(
        280,
        400,
        'carrier_command',
        'You Win!'
      );
      // this.gameStateText.setText("You Win");
      this.time.delayedCall(2000, () => {
        this.winText.visible = false;
        this.reset();
      });
      this.computerHearts--;
    }

    if (this.winner == OUTCOME_COMPUTER_WON) {
      this.selectedSprite.x = 300;
      this.selectedSprite.y = 300;
      computerSelectedSprite.x = 500;
      computerSelectedSprite.y = 300;
      this.loseHp();
      this.loseItems(this.selectedSprite.texture.key);
      this.loseText = this.add.bitmapText(
        280,
        400,
        'carrier_command',
        'You Lose!'
      );
      this.time.delayedCall(2000, () => {
        this.loseText.visible = false;
        this.reset();
      });
    }

    if (this.winner == OUTCOME_TIE) {
      this.selectedSprite.x = 300;
      this.selectedSprite.y = 300;
      computerSelectedSprite.x = 500;
      computerSelectedSprite.y = 300;

      this.tieText = this.add.bitmapText(
        280,
        400,
        'carrier_command',
        'Tie Game!'
      );

      this.time.delayedCall(2000, () => {
        this.tieText.visible = false;
        this.reset();
      });
    }
  }
  reset() {
    this.mode = NOTHING_SELECTION_MODE;
    this.selectedSprite = null;
    this.gameStateText.setText('Select Move');
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
    this.playerHasNoItems();
    this.gameWin();
    this.gameLoss();
  }
}
