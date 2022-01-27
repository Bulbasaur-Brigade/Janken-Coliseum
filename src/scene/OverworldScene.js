import Phaser from "phaser";

export default class OverworldScene extends Phaser.Scene {
  constructor() {
    super("OverworldScene");
  }
  preload() {
    this.load.image(
        "tiles",
        "assets/maps/tilemap.png"
    );
    this.load.tilemapTiledJSON(
        "tilemap",
        "assets/maps/overworldMap.json"
    );
  }
  create() {
      // Creating Map using Tile Set
      const map = this.make.tilemap({key: "tilemap"})
      // "characters" comes from name in Tiled software
      const tileset = map.addTilesetImage("characters","tiles",16,16)
      
      // Layers
      const waterLayer = map.createLayer("Water",tileset,0,0)
      const groundLayer = map.createLayer("Ground",tileset,0,0)
      const interactiveLayer = map.createLayer("Interactive",tileset,0,0)
      const overheadLayer = map.createLayer("Overhead",tileset,0,0)

      // Placeholder Camera
      const camera = this.cameras.main
      camera.setZoom(2)
  }
  update() {}
}
