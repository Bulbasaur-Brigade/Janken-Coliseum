import Phaser from 'phaser';

const createCharacterAnims = (anims = Phaser.Animations.AnimationManager) => {
  anims.create({
    key: 'runLeft',
    frames: anims.generateFrameNumbers('character', {
      start: 0,
      end: 2,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: 'runRight',
    frames: anims.generateFrameNumbers('character', {
      start: 9,
      end: 11,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: 'runDown',
    frames: anims.generateFrameNumbers('character', {
      start: 3,
      end: 5,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: 'runUp',
    frames: anims.generateFrameNumbers('character', {
      start: 6,
      end: 8,
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'idle',
    frames: [{ key: 'character', frame: 3 }],
    frameRate: 10,
  });

  anims.create({
    key: 'runLeftApril',
    frames: anims.generateFrameNumbers('character', {
      start: 60,
      end: 62,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: 'runRightApril',
    frames: anims.generateFrameNumbers('character', {
      start: 69,
      end: 71,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: 'runDownApril',
    frames: anims.generateFrameNumbers('character', {
      start: 63,
      end: 65,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: 'runUpApril',
    frames: anims.generateFrameNumbers('character', {
      start: 66,
      end: 68,
    }),
    frameRate: 6,
    repeat: -1,
  });

  anims.create({
    key: 'idleApril',
    frames: [{ key: 'character', frame: 63 }],
    frameRate: 10,
  });
  anims.create({
    key: 'blueBirdFly',
    frames: anims.generateFrameNumbers('blueBird', {
      start: 0,
      end: 8,
    }),
    frameRate: 5,
    repeat: -1,
    suffix: '.png',
  });
  anims.create({
    key: 'greenBirdFly',
    frames: anims.generateFrameNumbers('greenBird', {
      start: 0,
      end: 8,
    }),
    frameRate: 5,
    repeat: -1,
    suffix: '.png',
  });
};

export { createCharacterAnims };
