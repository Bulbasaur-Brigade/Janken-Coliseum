import Phaser from "phaser";
export default class Inventory extends Phaser.GameObjects.Group {
  constructor() {
    super(null);
    this.items = [];
  }
  addItem(id, amount) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        this.items[i].amount += amount;
        return;
      }
    }
    this.items.push({ id: id, amount: amount });
  }
  removeItem(id, amount) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        this.items[i].amount -= amount;
        if (self.items[i].amount <= 0) {
          this.items.splice(i, 1);
        }
        return;
      }
    }
    this.items.push({ id: id, amount: amount });
  }
}
