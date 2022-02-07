import Items from "../entity/Items";
// import SceneTransition from "./SceneTransition";

export default class Inventory extends Phaser.Scene {
  constructor() {
    super("Inventory");
  }
  preload() {
    // Inventory
    this.load.image("inventory", "assets/sprites/inventory.png");

    //Items
    this.load.image("rock", "assets/sprites/rock.png");
    this.load.image("paper", "assets/sprites/paper.png");
    this.load.image("scissors", "assets/sprites/scissors.png");
    this.load.image("diamond", "assets/sprites/diamond.png");
  }
  setItems() {
    let items = [
      { name: "rock", amount: 0 },
      { name: "paper", amount: 0 },
      { name: "scissors", amount: 0 },
    ];
    localStorage.setItem("items", JSON.stringify(items));
  }
  // transformItem(item) {}
  addItem(name, amount) {
    let data = localStorage.getItem("items");
    let items = data ? JSON.parse(data) : [];

    for (let i = 0; i < items.length; i++) {
      if (items[i].name === name) {
        items[i].amount += amount;
      }
      if (items[i].name === "rock") {
        this.rockText.setText(items[i].amount);
      }

      if (items[i].name === "paper") {
        this.paperText.setText(items[i].amount);
      }
      if (items[i].name === "scissors") {
        this.scissorsText.setText(items[i].amount);
      }
    }

    localStorage.setItem("items", JSON.stringify(items));
  }

  create() {
    this.setItems();

    this.inventory = new Items(this, 85, 560, "inventory").setScale(1.2);
    this.rock = new Items(this, 41, 560, "rock").setScale(0.55);
    this.paper = new Items(this, 85, 560, "paper").setScale(0.55);
    this.scissors = new Items(this, 128, 560, "scissors").setScale(0.55);

    this.rockText = this.add.text(48, 562, "0");
    this.paperText = this.add.text(96, 562, "0");
    this.scissorsText = this.add.text(142, 562, "0");
  }
  update() {
    this.addItem();
  }
}
