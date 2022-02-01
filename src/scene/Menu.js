import Firebase  from "firebase/compat/app";
import 'firebase/compat/auth';



class Menu extends Phaser.Scene {
    constructor() {
        super({
            key: 'Menu'
        });

        this.user = Firebase.user
        this.displayName = ''
        this.registerElement
        this.userInfoElement
        this.headerText = Phaser.GameObjects.Text
    }
    hideRegisterElement() {
        this.registerElement.removeListener('click');
        this.scene.scene.tweens.add({ targets: this.registerElement.rotate3d, x: 1, w: 90, duration: 2000, ease: 'Power3' });
        let self = this;
        this.scene.tweens.add({
            targets: this.registerElement, scaleX: 2, scaleY: 2, y: 700, duration: 2000, ease: 'Power3',
            onComplete: function () {
                self.registerElement.setVisible(false);
            }
        });
    }

    showUserInfo() {
        if (this.user !== null) {
            let self = this;
            this.userInfoElement.setVisible(true);
            let inputDisplayName = this.userInfoElement.getChildByName("displayName");
            inputDisplayName.value = this.user.displayName;
            this.userInfoElement.addListener('click');
            this.userInfoElement.on('click', function (event) {
                if (event.target.id === 'closeSettings') {
                    self.userInfoElement.removeListener('click');
                    self.userInfoElement.setVisible(false);
                }

                if (event.target.id === 'saveSettings') {
                    //if name not changed then skip update to firebase
                    if (self.displayName != inputDisplayName.value) {
                        Firebase.auth().currentUser.updateProfile({ displayName: inputDisplayName.value }).then(
                            function (r) {
                                self.displayName = inputDisplayName.value;
                                //this doesn't work well on smaller screens
                                self.headerText.setText('Welcome ' + self.displayName);
                                let posX = self.cameras.main.centerX - (24 * (self.displayName.length / 2 + 8));
                                self.headerText.setPosition(posX, 25);
                            }
                        );
                    }
                    self.userInfoElement.removeListener('click');
                    self.userInfoElement.setVisible(false);
                }
            });
        }
    };

    preload() {
        this.load.svg('usericon', 'assets/user.svg');
        this.headerText = this.add.text(this.cameras.main.centerX - 35, 50, 'Welcome', { fontFamily: 'Verdana, "Times New Roman", Tahoma, serif', fontSize: 48, fill: '#1212FF' });
        let self = this;
        Firebase.auth().onAuthStateChanged(function (user) {
            self.user = user;
            if (user !== null) {
                self.hideRegisterElement();
                self.displayName = self.user.displayName !== null ? self.user.displayName : self.user.email;
                //duplicate code - move in future
                self.headerText.setText('Welcome ' + self.displayName);
                let posX = self.cameras.main.centerX - (24 * (self.displayName.length / 2 + 8));
                if (posX < 1) { posX = 1; }
                self.headerText.setPosition(posX, 25);
            }
        });
        this.load.html('register', 'assets/html/register.html');
        this.load.html('userinfo', 'assets/html/userinfo.html');
    };

    create() {
        let self = this;
        let userInfoButton = this.add.image(25, 25, 'usericon').setScale(.2).setInteractive();
        userInfoButton.setTintFill(0xFFFFFF);
        userInfoButton.on('pointerdown', this.showUserInfo, this);
        this.userInfoElement = this.add.dom(this.cameras.main.centerX, this.cameras.main.centerY).createFromCache('userinfo');
        this.userInfoElement.setVisible(false);
        if (this.user == null) {
            this.registerElement = this.add.dom(this.cameras.main.centerX, this.cameras.main.centerY).createFromCache('register');
            // this.registerElement.setPerspective(800); /* not quite sure what this does but found more info at https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.DOMElement.html */

            this.registerElement.addListener('click');
            this.registerElement.on('click', function (event) {

                let inputUsername = this.getChildByName('username');
                let inputPassword = this.getChildByName('password');
                if (inputUsername.value.length > 0 && inputPassword.value.length > 0) {
                    //todo
                    //handle various error results from Firebase
                    if (event.target.id === 'Rlogin') {

                        Firebase.auth().signInWithEmailAndPassword(inputUsername.value, inputPassword.value).then(
                            function (r) {
                                self.hideRegisterElement();
                            }).catch(function(error){
                                alert(error.message);
                            });
                    }
                    if (event.target.id === 'Rregister') {
                        try {
                            Firebase.auth().createUserWithEmailAndPassword(inputUsername.value, inputPassword.value).catch(function (error) {
                                console.log(error); 
                                alert(error.message);
                            });
                        }
                        catch (error) {
                            console.log(error);
                            alert(error.message);

                        }
                    }
                }
            });
        }
    }

}

export default Menu;
