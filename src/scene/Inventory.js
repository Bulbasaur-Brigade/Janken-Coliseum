import Items from '../entity/Items';
// import SceneTransition from "./SceneTransition";
import { addItem, loseItem } from '../redux/inventoryReducer';
import store from '../redux/store';

export default class Inventory extends Phaser.Scene {
  constructor() {
    super('Inventory');
  }
  // transformItem(item) {}
  addItem(name, amount) {
    let getStore = store.getState();
    let items = getStore.inventoryReducer;
    let itemsArray = items.itemArray;

    for (let i = 0; i < itemsArray.length; i++) {
      if (itemsArray[i].name === name) {
        store.dispatch(addItem(name, amount));
      }
      if (itemsArray[i].name === 'rock') {
        this.rockText.setText(itemsArray[i].amount);
      }

      if (itemsArray[i].name === 'paper') {
        this.paperText.setText(itemsArray[i].amount);
      }
      if (itemsArray[i].name === 'scissors') {
        this.scissorsText.setText(itemsArray[i].amount);
      }
    }
  }

  create() {
    this.inventory = new Items(this, 85, 560, 'inventory').setScale(1.2);
    this.rock = new Items(this, 41, 560, 'rock').setScale(0.55);
    this.paper = new Items(this, 85, 560, 'paper').setScale(0.55);
    this.scissors = new Items(this, 128, 560, 'scissors').setScale(0.55);

    this.rockText = this.add.text(48, 562, '0');
    this.paperText = this.add.text(96, 562, '0');
    this.scissorsText = this.add.text(142, 562, '0');
  }
  update() {
    this.addItem();
  }
}
