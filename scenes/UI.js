class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);



  }
  create() {
    this.Main = this.scene.get('playGame');
    //this.header = this.add.image(game.config.width / 2, game.config.height, 'blank').setOrigin(.5, 1).setTint(0x3e5e71);
    // this.header.displayWidth = 900;
    //this.header.displayHeight = 150;
    this.toggle = 0


    this.scoreText = this.add.bitmapText(800, 1575, 'topaz', 'A', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1).setInteractive();
    this.scoreText.on('pointerdown', function () {
      this.scopeToggle()

    }, this)

    this.rifle = this.add.image(game.config.width, game.config.height, 'rifle').setOrigin(1).setInteractive()
    this.rifle.on('pointerdown', function () {
      this.scopeToggle()
    }, this)
    this.score = 0;


    this.shotText = this.add.bitmapText(450, 175, 'topaz', ',', 80).setOrigin(.5).setTint(0x000000).setAlpha(1);


    this.fireText = this.add.bitmapText(650, 1150, 'topaz', 'F', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1);
    this.fireText.on('pointerdown', function () {
      this.shotText.setText(this.Main.player.x + ', ' + this.Main.player.y)
      this.Main.fire()
    }, this)

    this.staticXJsPos = 450
    this.staticYJsPos = 1200
    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: this.staticXJsPos,
      y: this.staticYJsPos,
      radius: 100,
      //base: baseGameObject,
      //thumb: thumbGameObject,
      dir: '4dir',
      // forceMin: 16,
      // fixed: true,
      // enable: true
    }).on('update', this.updateJoystickState, this);
    this.cursorKeys = this.joyStick.createCursorKeys();
    this.cursorDebugText = this.add.text(10, 300, '', { fontSize: '44px', color: '#000000' });

    this.Main.events.on('score', function () {

      this.score += 1;
      //console.log('dots ' + string)
      this.scoreText.setText(this.score)
    }, this);

    /*  this.input.on('pointerdown', pointer => {
       this.joyStick.x = pointer.x;
       this.joyStick.y = pointer.y;
       this.joyStick.base.x = pointer.x;
       this.joyStick.base.y = pointer.y;
       this.joyStick.thumb.x = pointer.x;
       this.joyStick.thumb.y = pointer.y;
     });
     this.input.on('pointerup', pointer => {
       this.joyStick.x = this.staticXJsPos;
       this.joyStick.y = this.staticYJsPos;
       this.joyStick.base.x = this.staticXJsPos;
       this.joyStick.base.y = this.staticYJsPos;
       this.joyStick.thumb.x = this.staticXJsPos;
       this.joyStick.thumb.y = this.staticYJsPos;
       this.lastCursorDirection = "center";
       //this.setCursorDebugInfo();
     }); */
  }

  update() {
    this.updateJoystickState();
  }
  scopeToggle() {
    this.Main.toggleScope()
    if (this.toggle == 0) {
      var tween = this.tweens.add({
        targets: this.rifle,
        scale: 3,
        duration: 300,
        alpha: 0
      })
      this.fireText.setAlpha(1).setInteractive()
      this.toggle = 1
    } else {
      var tween = this.tweens.add({
        targets: this.rifle,
        scale: 1,
        delay: 100,
        duration: 300,
        alpha: 1
      })
      this.fireText.setAlpha(0).disableInteractive()
      this.toggle = 0
    }
  }
  updateJoystickState() {
    let direction = '';
    for (let key in this.cursorKeys) {
      if (this.cursorKeys[key].isDown) {
        direction += key;
      }
    }

    // If no direction if provided then stop 
    // the player animations and exit the method
    if (direction.length === 0) {
      //  this.stopPlayerAnimations();
      return;
    }

    // If last cursor direction is different
    //  the stop all player animations
    if (this.lastCursorDirection !== direction) {
      //this.stopPlayerAnimations();
    }

    // Set the new cursor direction
    this.lastCursorDirection = direction;
    // console.log(this.lastCursorDirection)
    // Handle the player moving
    var force = Math.floor(this.joyStick.force * 100) / 100
    this.Main.movePlayer(this.lastCursorDirection, force);

    // Set debug info about the cursor
    this.setCursorDebugInfo();
  }
  setCursorDebugInfo() {
    const force = Math.floor(this.joyStick.force * 100) / 100;
    const angle = Math.floor(this.joyStick.angle * 100) / 100;
    let text = `Direction: ${this.lastCursorDirection}\n`;
    text += `Force: ${force}\n`;
    text += `Angle: ${angle}\n`;
    text += `FPS: ${this.sys.game.loop.actualFps}\n`;
    this.cursorDebugText.setText(text);
  }

}