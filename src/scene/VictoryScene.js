import Phaser from "phaser";
import SceneTransition from "./SceneTransition";

export default class VictoryScene extends SceneTransition {
  constructor() {
    super("VictoryScene");
  }
  preload() {
    this.load.bitmapFont(
      "carrier_command",
      "assets/fonts/carrier_command.png",
      "assets/fonts/carrier_command.xml"
    );
    this.load.image("victoryBackground", "assets/backgrounds/victory.png");
    // Music
    //this.load.audio('music', 'assets/audio/PalletTown.mp3');
  }
  create() {
    super.create();
    // Music
    this.winMusic = this.sound.add("win", { volume: 0.15 }, true);
    this.winMusic.play();

    this.add.image(0, 0, "victoryBackground").setOrigin(0, 0).setScale(2);

    this.titleBorder = this.add.rectangle(400, 70, 360, 80, 0x520075);
    this.titleBorder.setDepth(2);
    this.titleBorder.setStrokeStyle(4, 0xffffff);

    this.title = this.add.bitmapText(234, 50, "carrier_command", "Victory", 40);
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
      this.scene.transition({
        duration: 2500,
        target: "TitleScene",
      });
      this.winMusic.stop();
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
