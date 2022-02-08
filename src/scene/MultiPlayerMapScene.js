import Phaser from 'phaser';
import io from 'socket.io-client';

export default class MultiPlayerMapScene extends Phaser.Scene {
  constructor() {
    super('MultiPlayerMapScene');
  }

  create() {
    this.socket = io('http://localhost:3000', { transports: ['websocket'] });

    this.socket.on('connect', () => {
      console.log('Connected');
    });
  }
}
