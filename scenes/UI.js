class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);



  }
  create() {
    this.Main = this.scene.get('playGame');
    this.header = this.add.image(game.config.width / 2, 0, 'blank').setOrigin(.5, 0).setTint(0x000000).setAlpha(.5);
    this.header.displayWidth = 900;
    this.header.displayHeight = 150;
    this.toggle = 0
    this.hits = 0
    this.shotsFired = 0
    this.clipCount = 3
    this.clip = []
    this.ammoBox = []
    this.canFire = true
    this.aimText = this.add.bitmapText(800, 1575, 'topaz', 'A', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(1).setInteractive();
    this.aimText.on('pointerdown', function () {
      this.scopeToggle()

    }, this)

    this.rifle = this.add.image(game.config.width, game.config.height, 'rifle').setOrigin(1).setInteractive()
    this.rifle.on('pointerdown', function () {
      this.scopeToggle()
    }, this)
    this.score = 0;

    this.guideTextGroup = this.add.container()
    var plusText = this.add.bitmapText(850, game.config.height / 2, 'topaz', '+', 80).setOrigin(.5).setTint(0xffffff).setAlpha(1);
    var minusText = this.add.bitmapText(50, game.config.height / 2, 'topaz', '-', 80).setOrigin(.5).setTint(0xffffff).setAlpha(1);
    this.guideTextGroup.add(plusText)
    this.guideTextGroup.add(minusText)
    this.guideTextGroup.setAlpha(0)

    //this.shotText = this.add.bitmapText(450, 175, 'topaz', ',', 80).setOrigin(.5).setTint(0x000000).setAlpha(1);
    this.scoreText = this.add.bitmapText(450, 40, 'topaz', '0', 40).setOrigin(.5).setTint(0xffffff).setAlpha(1);
    this.hitText = this.add.bitmapText(450, 110, 'topaz', '', 40).setOrigin(.5).setTint(0xffffff).setAlpha(1);

    this.windText = this.add.bitmapText(15, 75, 'topaz', '--', 80).setOrigin(0, .5).setTint(0xffffff).setAlpha(1);
    this.distanceEstimateText = this.add.bitmapText(885, 75, 'topaz', '--', 80).setOrigin(1, .5).setTint(0xffffff).setAlpha(1);
    this.fireText = this.add.bitmapText(650, 1150, 'topaz', 'F', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(0);
    this.fireText.on('pointerdown', function () {
      if (!this.canFire) { return }
      this.distance = 0;
      this.distanceText.setText(this.distance)
      this.windAdjust = 0
      this.windSetText.setText(this.windAdjust)
      //this.shotText.setText(this.Main.player.x + ', ' + this.Main.player.y)
      this.shotsFired++
      this.hitText.setText(this.hits + '/' + this.shotsFired)
      this.Main.fire(this.distance)

      var bullet = this.clip.pop()
      bullet.setAlpha(0)
      this.ammoBox.push(bullet)
      if (this.clip.length == 0) {
        this.canFire = false
        this.fireText.setAlpha(.2)
      }
    }, this)


    this.reloadText = this.add.bitmapText(250, 1150, 'topaz', 'R', 80).setOrigin(.5).setTint(0xcbf7ff).setAlpha(0);
    this.reloadText.on('pointerdown', function () {
      if (this.clip.length == this.clipCount) { return }
      var tween = this.tweens.add({
        targets: this.Main.player,
        y: '-=100',
        yoyo: true,
        duration: 300
      })
      for (var i = this.clip.length; i < this.clipCount; i++) {

        var bullet = this.ammoBox.pop()
        bullet.setPosition(50 + i * 25, 1525).setAlpha(1)
        this.clip.push(bullet)

      }

      this.canFire = true
      this.fireText.setAlpha(1)

    }, this)

    for (var i = 0; i < this.clipCount; i++) {
      console.log('bullet')
      var bullet = this.add.image(50 + i * 25, 1525, 'bullet').setScale(.8)
      this.clip.push(bullet)

    }


    //distance set
    this.distance = 0
    this.distanceContainer = this.add.container()
    var distanceDownText = this.add.bitmapText(850, game.config.height / 2 + 200, 'topaz', 'U', 80).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    distanceDownText.on('pointerdown', function () {
      this.changeDistance('lower')
    }, this)

    this.distanceText = this.add.bitmapText(850, game.config.height / 2 + 300, 'topaz', this.distance, 60).setOrigin(.5).setTint(0xffffff).setAlpha(1);

    var distanceUpText = this.add.bitmapText(850, game.config.height / 2 + 400, 'topaz', 'D', 80).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    distanceUpText.on('pointerdown', function () {
      this.changeDistance('raise')
    }, this)

    this.distanceContainer.add(distanceDownText)
    this.distanceContainer.add(this.distanceText)
    this.distanceContainer.add(distanceUpText)
    this.distanceContainer.setAlpha(0)


    //WIND SET
    this.windAdjust = 0
    this.windContainer = this.add.container()
    var windLeftText = this.add.bitmapText(game.config.width / 2 - 100, game.config.height / 2 - 450, 'topaz', 'L', 80).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    windLeftText.on('pointerdown', function () {
      this.changeWind('left')
    }, this)
    this.windSetText = this.add.bitmapText(game.config.width / 2, game.config.height / 2 - 450, 'topaz', this.windAdjust, 60).setOrigin(.5).setTint(0xffffff).setAlpha(1);
    var windRightText = this.add.bitmapText(game.config.width / 2 + 100, game.config.height / 2 - 450, 'topaz', 'R', 80).setOrigin(.5).setTint(0xffffff).setAlpha(1).setInteractive();
    windRightText.on('pointerdown', function () {
      this.changeWind('right')
    }, this)
    this.windContainer.add(this.windSetText)
    this.windContainer.add(windLeftText)
    this.windContainer.add(windRightText)
    this.windContainer.setAlpha(0)



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
    this.cursorDebugText = this.add.text(10, 300, '', { fontSize: '44px', color: '#000000' }).setAlpha(0);

    this.Main.events.on('hit', function (data) {
      console.log('acc ' + data.acc + ', dist ' + this.distanceFinal)
      this.hits += 1;
      //console.log('dots ' + string)
      this.score += Math.floor((10 * this.distanceFinal) - data.acc)
      this.scoreText.setText(this.score)
      this.hitText.setText(this.hits + '/' + this.shotsFired)
      if (this.hits == this.Main.targetCount) {
        alert('All Targets Dropped')
      }
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
    var windT = ''
    if (this.Main.wind > 0) {
      var windT = this.Main.wind + '>'
    } else if (this.Main.wind < 0) {
      var windT = '<' + this.Main.wind
    } else {
      var windT = '0'
    }
    this.windText.setText(windT)
    var row = Math.floor(this.Main.player.y / this.Main.gSize)
    this.distanceFinal = this.Main.rows - row
    this.distanceEstimateText.setText(this.distanceFinal)
  }
  changeWind(dir) {
    if (dir == 'left') {
      this.Main.player.x -= 1
      this.windAdjust -= 1
      this.windSetText.setText(this.windAdjust)
    } else {
      this.Main.player.x += 1
      this.windAdjust += 1
      this.windSetText.setText(this.windAdjust)
    }
  }
  changeDistance(dir) {
    if (dir == 'raise') {
      this.Main.player.y += 1
      this.distance += 1
      this.distanceText.setText(this.distance)
    } else {
      this.Main.player.y -= 1
      this.distance -= 1
      this.distanceText.setText(this.distance)
    }
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
      this.reloadText.setAlpha(1).setInteractive()
      this.guideTextGroup.setAlpha(1)
      this.distanceContainer.setAlpha(1)
      this.windContainer.setAlpha(1)
      this.toggle = 1
    } else {
      var tween = this.tweens.add({
        targets: this.rifle,
        scale: 1,
        delay: 100,
        duration: 300,
        alpha: 1
      })
      this.guideTextGroup.setAlpha(0)
      this.fireText.setAlpha(0).disableInteractive()
      this.reloadText.setAlpha(0).disableInteractive()
      this.distanceContainer.setAlpha(0)
      this.windContainer.setAlpha(0)
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
