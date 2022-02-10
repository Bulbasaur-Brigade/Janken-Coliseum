import Phaser from 'phaser';

export default class WaitingRoom extends Phaser.Scene {
  constructor() {
    super('WaitingRoom');
    this.state = {};
    this.hasBeenSet = false;
  }
}
