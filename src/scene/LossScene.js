import Phaser from "phaser";
import SceneTransition from "./SceneTransition";

export default class LossScene extends SceneTransition {
  constructor() {
    super("LossScene");
  }
  preload() {
    this.load.bitmapFont(
      "carrier_command",
      "assets/fonts/carrier_command.png",
      "assets/fonts/carrier_command.xml"
    );
    this.load.image("defeatBackground", "assets/backgrounds/defeat.png");
  }
  create() {
    super.create();
    this.lossMusic = this.sound.add("loss", { volume: 0.15 }, true);
    this.lossMusic.play();

    this.add.image(0, 0, "defeatBackground").setOrigin(0, 0).setScale(1.9);

    this.titleBorder = this.add.rectangle(400, 70, 350, 80, 0x520075);
    this.titleBorder.setDepth(2);
    this.titleBorder.setStrokeStyle(4, 0xffffff);

    this.title = this.add.bitmapText(257, 50, "carrier_command", "Defeat", 40);
    this.title.setDepth(2);

    this.homeScreenBorder = this.add.rectangle(400, 560, 700, 60, 0x520075);
    this.homeScreenBorder.visible = false;
    this.homeScreenBorder.setDepth(2);
    this.homeScreenBorder.setStrokeStyle(4, 0xffffff);

    // scene change buttons
    this.homeScreen = this.add.bitmapText(
      73,
      550,
      "carrier_command",
      "Return to Title Screen",
      25
    );
    this.homeScreen.setInteractive({ useHandCursor: true });
    this.homeScreen.setDepth(2);

    this.homeScreen.on('pointerover',function(pointer){
      this.homeScreenBorder.visible = true;
    },this)
    
    this.homeScreen.on('pointerout',function(pointer){
      this.homeScreenBorder.visible = false;
    },this)

    this.homeScreen.on("pointerdown", () => {
      this.lossMusic.stop();
      this.scene.transition({
        duration: 1500,
        target: "TitleScene",
      });
    });
  }

  update() {
    let randomEvent = Phaser.Math.RND.integerInRange(0,180);
    if(randomEvent == 1) {
      this.physicsImage = this.physics.add.image(Phaser.Math.RND.integerInRange(100,700), -100, "rock");
      this.physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-300,300), 300);
      this.physicsImage.setRotation(Phaser.Math.RND.integerInRange(0,360));
    }
    if(randomEvent == 2) {
      this.physicsImage = this.physics.add.image(Phaser.Math.RND.integerInRange(100,700), -100, "paper");
      this.physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-300,300), 300);
      this.physicsImage.setRotation(Phaser.Math.RND.integerInRange(0,360));
    }
    if(randomEvent == 3) {
      this.physicsImage = this.physics.add.image(Phaser.Math.RND.integerInRange(100,700), -100, "scissors");
      this.physicsImage.setVelocity(Phaser.Math.RND.integerInRange(-300,300), 300);
      this.physicsImage.setRotation(Phaser.Math.RND.integerInRange(0,360));
    }
  }
}
