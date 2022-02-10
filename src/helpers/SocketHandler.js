import { io } from 'socket.io-client';

export default class SocketHandler {
  constructor(scene) {
    scene.socket = io('http://localhost:3000');

    scene.socket.on('connect', () => {
      console.log('Connected user: ', scene.socket.id);
    });
  }
}
