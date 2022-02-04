const MASK_MIN_SCALE = 0;
const MASK_MAX_SCALE = 2;

export default class SceneTransition extends Phaser.Scene {

    create () {
        const maskShape = new Phaser.Geom.Circle(
            this.sys.game.config.width / 2,
            this.sys.game.config.height / 2,
            this.sys.game.config.height / 2
        );
        const maskGfx = this.add.graphics()
            .fillCircleShape(maskShape)
            .generateTexture('mask')
        ;
        this.mask = this.add.image(0, 0, 'mask')
            .setPosition(
                this.sys.game.config.width / 2,
                this.sys.game.config.height / 2,
            )
        ;

        this.cameras.main.setMask(new Phaser.Display.Masks.BitmapMask(this, this.mask));

        this.events.on(Phaser.Scenes.Events.CREATE, () => {
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: MASK_MIN_SCALE,
                start: MASK_MIN_SCALE,
                to: MASK_MAX_SCALE,
            };

            this.tweens.add({
                delay: 2750,
                duration: 1500,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets: this.mask,
            });
        });

        this.events.on(Phaser.Scenes.Events.TRANSITION_OUT, () => {
            const propertyConfig = {
                ease: 'Expo.easeInOut',
                from: MASK_MAX_SCALE,
                start: MASK_MAX_SCALE,
                to: MASK_MIN_SCALE,
            };

            this.tweens.add({
                duration: 2500,
                scaleX: propertyConfig,
                scaleY: propertyConfig,
                targets: this.mask,
            });
        });
    }

}