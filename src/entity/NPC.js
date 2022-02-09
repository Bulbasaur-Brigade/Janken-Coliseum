import Phaser from 'phaser';

export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setImmovable(true);
    this.isDefeated = false;
    this.dialog = '';
  }

  createSpeechBubble(x, y, width, height, quote, name) {
    let bubbleWidth = width;
    let bubbleHeight = height;
    let bubblePadding = 10;
    let arrowHeight = bubbleHeight / 4;

    let bubble = this.scene.add.graphics({ x: x - 20, y: y - 75 });

    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(3, 3, bubbleWidth, bubbleHeight, 16);

    //  Bubble color
    bubble.fillStyle(0xffffff, 1);

    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);

    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);

    //  Calculate arrow coordinates
    let point1X = Math.floor(bubbleWidth / 8);
    let point1Y = bubbleHeight;
    let point2X = Math.floor((bubbleWidth / 8) * 2);
    let point2Y = bubbleHeight;
    let point3X = Math.floor(bubbleWidth / 8);
    let point3Y = Math.floor(bubbleHeight + arrowHeight);

    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);

    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    let content = this.scene.add.text(0, 0, quote, {
      fontFamily: 'Courier',
      fontSize: 10,
      color: '#000000',
      align: 'center',
      wordWrap: { width: bubbleWidth - bubblePadding * 2 },
    });

    let npcName = this.scene.add.text(0, 0, name.toUpperCase(), {
      fontFamily: 'Courier',
      fontSize: 10,
      color: '#000000',
      align: 'center',
    });

    let b = content.getBounds();

    content.setPosition(
      bubble.x + bubbleWidth / 2 - b.width / 2,
      bubble.y + bubbleHeight / 2 - b.height / 2
    );

    npcName.setPosition(x - 10, y - 90);
  }
}
