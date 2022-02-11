import Phaser from "phaser";
import Player from "../../entity/Player";
import { createCharacterAnims } from "../../anims/CharacterAnims";
import NPC from "../../entity/NPC";
import Items from "../../entity/Items";
import store from "../../redux/store";

export default class RoomOne extends Phaser.Scene {
    constructor() {
      super("RoomOne");
    }

    preload() {
        this.load.image("roomOne", "assets/maps/tilemap.png");
        this.load.tilemapTiledJSON("roomOneMap", "assets/maps/roomOne.json");

        // Music
        this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
    }

    create() {
        createCharacterAnims(this.anims);

        // Creating Map using Tile Set
        const map = this.make.tilemap({ key: "roomOneMap" });
        // "characters" comes from name in Tiled software
        const tileset = map.addTilesetImage("tilemap", "roomOne", 16, 16);

        const roomOneLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);

        this.player = new Player(
            this,
            this.data.get("playercordX") || 160,
            this.data.get("playercordY") || 240,
            "character"
          ).setScale(0.25);

        const objectsLayer = map.getObjectLayer("Objects");
        console.log(objectsLayer.objects);
        objectsLayer.objects.forEach(object => {
            if(object.name === "mac") {
                const newNPC = new NPC(
                    this,
                    object.x,
                    object.y,
                    object.name
                ).setScale(0.25);
                this.physics.add.collider(this.player, newNPC);
            }
            if(object.name === "stairsUp") {
                const newItem = new Items(
                    this,
                    object.x,
                    object.y,
                    object.name
                ).setScale(1);
                this.physics.add.collider(this.player, newItem, () => {this.scene.switch("RoomTwo")});
            }
        })

        roomOneLayer.setCollisionByProperty({ collisions: true });
        this.physics.add.collider(this.player, roomOneLayer);

        const camera = this.cameras.main;
        camera.setZoom(3);
        camera.startFollow(this.player, true);

        this.keys = this.input.keyboard.addKeys("W,S,A,D");
    }

    update() {
        this.player.update(this.keys);
    }
}
