import Phaser from 'phaser';

const anims = Phaser.Animations.AnimationManager;

const createNpcAnims = (anims, npcName) => {
  const npcNames = {
    amber: 0,
    andrea: 12,
    danny: 24,
    devonne: 36,
    eric: 48,
    greg: 60,
    mac: 72,
    margarita: 84,
    omar: 96,
    savion: 108,
    sey: 120,
    zach: 132,
  };
  anims.create({
    key: `${npcName}Left`,
    frames: anims.generateFrameNumbers('npcSprites', {
      start: npcNames[npcName] + 3,
      end: npcNames[npcName] + 5,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: `${npcName}Right`,
    frames: anims.generateFrameNumbers('npcSprites', {
      start: npcNames[npcName] + 6,
      end: npcNames[npcName] + 8,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: `${npcName}Down`,
    frames: anims.generateFrameNumbers('npcSprites', {
      start: npcNames[npcName],
      end: npcNames[npcName] + 2,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: `${npcName}Up`,
    frames: anims.generateFrameNumbers('npcSprites', {
      start: npcNames[npcName] + 9,
      end: npcNames[npcName] + 11,
    }),
    frameRate: 6,
    repeat: -1,
  });
  anims.create({
    key: `${npcName}idle`,
    frames: [{ key: 'npcSprites', frame: npcNames[npcName] }],
    frameRate: 10,
  });
};

export { createNpcAnims };
