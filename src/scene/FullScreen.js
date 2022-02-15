import Phaser from 'phaser';

export default class FullScreen extends Phaser.Scene {
  constructor() {
    super('FullScreen');
  }

  create() {
    this.fullScreen = this.add
      .image(790, 555, 'fullscreen')
      .setScale(0.025)
      .setAlpha(0.5)
      .setOrigin(1, 0)
      .setInteractive({ useHandCursor: true });

    this.fullScreen.on(
      'pointerup',
      function () {
        if (this.scale.isFullscreen) {
          // this.fullScreen.setFrame(0);

          this.scale.stopFullscreen();
        } else {
          // this.fullScreen.setFrame(1);

          this.scale.startFullscreen();
        }
      },
      this
    );
  }
}
