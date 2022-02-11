import Phaser from "phaser";
import Player from "../../entity/Player";
import { createCharacterAnims } from "../../anims/CharacterAnims";
import NPC from "../../entity/NPC";
import Items from "../../entity/Items";

export default class RoomTwo extends Phaser.Scene {
    constructor() {
      super("RoomTwo");
    }

    preload() {
        this.load.image("roomTwo", "assets/maps/tilemap.png");
        this.load.tilemapTiledJSON("roomTwoMap", "assets/maps/roomTwo.json");
    
        // Music
        this.load.audio("Pallet", "assets/audio/PalletTown.mp3");
    }

    create() {
        createCharacterAnims(this.anims);

        // Creating Map using Tile Set
        const map = this.make.tilemap({ key: "roomTwoMap" });
        // "characters" comes from name in Tiled software
        const tileset = map.addTilesetImage("tilemap", "roomTwo", 16, 16);

        const roomTwoLayer = map.createLayer("Tile Layer 1", tileset, 0, 0);

        this.player = new Player(
            this,
            this.data.get("playercordX") || 240,
            this.data.get("playercordY") || 80,
            "character"
          ).setScale(0.25);

        const objectsLayer = map.getObjectLayer("Objects");
        console.log(objectsLayer.objects);
        objectsLayer.objects.forEach(object => {
            if(object.name === "zach") {
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
                this.physics.add.collider(this.player, newItem, () => {this.scene.switch("RoomThree")});
            }
            if(object.name === "stairsDown") {
                const newItem = new Items(
                    this,
                    object.x,
                    object.y,
                    object.name
                ).setScale(1);
                this.physics.add.collider(this.player, newItem, () => {this.scene.switch("RoomOne")});
            }
        })

        roomTwoLayer.setCollisionByProperty({ collisions: true });
        this.physics.add.collider(this.player, roomTwoLayer);

        const camera = this.cameras.main;
        camera.setZoom(3);
        camera.startFollow(this.player, true);

        this.keys = this.input.keyboard.addKeys("W,S,A,D");
    }

    update() {
        this.player.update(this.keys);
    }
}