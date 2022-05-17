let game;
let spotlight;


window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },
    physics: {
      default: 'arcade',
    },
    scene: [preloadGame, startGame, playGame, UI]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////
class playGame extends Phaser.Scene {
  constructor() {
    super("playGame");
  }
  preload() {


  }
  create() {

    this.wideZoom = .5
    this.scopeZoom = 4
    /* 1400 = 3
    2048 = 4 */
    this.imageScale = 4
    //this.cameras.main.setBackgroundColor(0x000000);
    var pic = this.add.image(0, 0, 'sky').setOrigin(0).setScale(this.imageScale);
    this.camBoundW = pic.displayWidth
    this.camBoundH = pic.displayHeight
    this.cameras.main.setBounds(0, 0, this.camBoundW, this.camBoundH);
    this.physics.world.setBounds(-450, -820, 8192 + 900, 8192 + 1640);
    this.cameras.main.setZoom(this.wideZoom)
    this.easy = false;
    /* this.add.image(-1024, -1024, 'bg').setOrigin(0);
    this.add.image(0, -1024, 'bg').setOrigin(0);
    this.add.image(-1024, 0, 'bg').setOrigin(0); */
    this.targets = []


    var bounds = this.cameras.main.getBounds();
    this.gSize = 40
    this.rows = Math.floor(this.camBoundH / this.gSize)
    console.log('rows ' + this.rows)
    var g1 = this.add.grid(0, 0, bounds.width, bounds.height, this.gSize, this.gSize, 0x333333, 0, 0xcccccc, 0).setOrigin(0);



    //this.target = this.add.image(13 * this.gSize, 0, 'target')
    //this.target = new Target(this, 13 * this.gSize, 0, 'target')
    //  this.setTarget(50, 50, 1)

    var positions = [{ col: 96, row: 156 }, { col: 104, row: 12 }, { col: 172, row: 160 }, { col: 136, row: 148 }, { col: 60, row: 56 }, { col: 184, row: 188 }, { col: 97, row: 156 }]
    this.targetCount = positions.length
    //var positions = [{ col: 27, row: 33 }, { col: 60, row: 30 }, { col: 84, row: 12 }, { col: 45, row: 57 }, { col: 45, row: 0 }, { col: 87, row: 30 }, { col: 0, row: 27 },]
    for (var i = 0; i < positions.length; i++) {
      var sway = false
      if (Phaser.Math.Between(1, 10) > 5) {
        sway = true
      }
      let target = new Target(this, 13 * this.gSize, 0, 'target', sway)
      var scale = (positions[i].row / (this.rows * .1)) + .5
      var dis = this.rows - positions[i].row

      this.setTarget(target, positions[i].col, positions[i].row, scale, dis)
    }
    /* for (var i = 0; i < 20; i++) {
      let target = new Target(this, 13 * this.gSize, 0, 'target')
      // var col = Phaser.Math.Between(5, 100)
      var col = 75
      //var row = Phaser.Math.Between(5, 100)
      var row = 0 + i * 10
      //var scale = .5 + i * .5
      var scale = (row / 20) + .5
      //var dis = 10 - i * .5
      var dis = 200 - row
      //console.log(dis)
      this.setTarget(target, col, row, scale, dis)
    }
 */
    //console.log(this.targets)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spot = this.add.image(0, 0, 'particle').setTint(0xff0000).setAlpha(0).setScale(.5)

    this.player = this.physics.add.image(pic.displayWidth / 2, pic.displayHeight / 2, 'scope', 1).setScale(.5).setAlpha(1)

    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player, true);
    this.playerSpeed = 5


    //pic.mask = new Phaser.Display.Masks.BitmapMask(this, spotlight);

    this.text = this.add.text(32, 86).setScrollFactor(0).setFontSize(62).setColor('#000000').setAlpha(0);
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);
    if (this.easy) {
      this.wind = 0

    } else {
      this.wind = Phaser.Math.Between(-30, 30)
      this.windAdjust = this.time.addEvent({ delay: 2000, callback: this.adjustWind, callbackScope: this, loop: true });
      this.windAdjust2 = this.time.addEvent({ delay: 30000, callback: this.adjustWind2, callbackScope: this, loop: true });
    }

    this.drop = 0


  }
  update() {


    var cam = this.cameras.main;
    this.text.setText([
      'ScrollX: ' + cam.scrollX,
      'ScrollY: ' + cam.scrollY,
      'MidX: ' + cam.midPoint.x,
      'MidY: ' + cam.midPoint.y,
      'Player' + this.player.x + ', ' + this.player.y,
    ]);
    this.player.setVelocity(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-300);
    }
    else if (this.cursors.down.isDown) {
      this.player.setVelocityY(300);
    }
  }
  adjustWind() {
    if (Phaser.Math.Between(1, 100) < 50) {
      if (Phaser.Math.Between(1, 100) < 50) {
        this.wind += Phaser.Math.Between(0, 5)
      } else {
        this.wind -= Phaser.Math.Between(0, 5)
      }
    }
  }
  adjustWind2() {
    if (Phaser.Math.Between(1, 100) < 50) {
      if (Phaser.Math.Between(1, 100) < 50) {
        this.wind = Phaser.Math.Between(0, 30)
      } else {
        this.wind = Phaser.Math.Between(-30, 0)
      }
    }
  }
  setTarget(target, col, row, scale, distance) {
    var xpos = col * this.gSize
    var ypos = row * this.gSize
    target.setPosition(xpos, ypos).setScale(scale)
    target.distance = distance
    console.log(col + ', ' + row + ' d: ' + distance + ' scale: ' + scale)

  }
  toggleScope() {
    if (this.cameras.main.zoom == this.wideZoom) {
      this.cameras.main.setZoom(this.scopeZoom)
      this.player.setFrame(0)
      //this.player.setAlpha(.8)
      var tween = this.tweens.add({
        targets: this.player,
        delay: 100,
        duration: 300,
        alpha: 1
      })
      // this.cameras.main.setBounds(0, 0, 4200 * 3, 4200 * 3);
      // this.physics.world.setBounds(0, 0, 4200 * 3, 4200 * 3);
    } else {
      this.cameras.main.setZoom(this.wideZoom)
      this.player.setFrame(1)
      //this.player.setAlpha(.2)
      var tween = this.tweens.add({
        targets: this.player,
        duration: 300,
        alpha: 1
      })
      this.cameras.main.setBounds(0, 0, this.camBoundW, this.camBoundH);
      this.physics.world.setBounds(-450, -820, 8192 + 900, 8192 + 1640);
    }
  }
  fire(d) {
    var tween = this.tweens.add({
      targets: this.player,
      y: '-=8',
      yoyo: true,
      duration: 100
    })
    //this.sound.play('shot')
    this.spot.setAlpha(1)
    //var coo = {x: this.spot.x + 3, this.spot.y}
    //var drop = this.drop + d * 5
    var row = this.player.y / this.gSize
    var dis = this.rows - row
    if (dis < Math.floor(this.rows * .15)) {
      var drop = 0
    } else {
      var drop = dis * .4
    }
    if (this.easy) {
      drop = 0
    }
    console.log('drop in px ' + drop)
    this.spot.setPosition(this.player.x + this.wind, this.player.y + drop)


    this.targets.forEach(function (target) {
      var tbound = target.getBounds()
      //target.rect = new Phaser.Geom.Rectangle(tbound.x, tbound.y, tbound.width, tbound.height)
      target.rect = new Phaser.Geom.Circle(tbound.x + tbound.width / 2, tbound.y + tbound.width / 2, tbound.width / 2)
      if (Phaser.Geom.Circle.ContainsPoint(target.rect, this.spot)) {

        //console.log('X' + Math.abs(target.x - this.spot.x))
        //console.log('Y' + Math.abs(target.y - this.spot.y))
        var numX = target.x - this.spot.x
        var numY = target.y - this.spot.y
        console.log('X' + (numX * -1))
        console.log('Y' + (numY * -1))
        if (!this.easy) {
          if (Math.abs(numX) > 10 || Math.abs(numY) > 10) {
            return
          }
        }

        //numX = (numX < 0) ? numX * -1 : numX;
        console.log('HIT')
        console.log(target.distance)
        var acc = Math.abs(numX) + Math.abs(numY)
        this.addHit(acc, dis)
        var tween = this.tweens.add({
          targets: target,
          scaleY: 0,
          yoyo: true,
          duration: 50,
          callbackScope: this,
          onComplete: function () {
            target.setAlpha(.2)
            // target.setPosition(-50, -50)
            /* var col = Phaser.Math.Between(5, 100)
            var row = Phaser.Math.Between(5, 100)
            this.setTarget(target, col, row, 2) */
          }
        })
      }

    }.bind(this));



  }
  movePlayer(direction, force) {
    if (this.cameras.main.zoom == 3) {
      this.playerSpeed = 1

    } else {


      if (force > 90) {
        this.playerSpeed = 10
      } else {
        this.playerSpeed = 1
      }
    }
    if (direction === "up") {
      this.player.y -= this.playerSpeed;

    } else if (direction === "down") {
      this.player.y += this.playerSpeed;

    } else if (direction === "right") {
      this.player.x += this.playerSpeed;

    } else if (direction === "left") {
      this.player.x -= this.playerSpeed;

    } else if (direction === "upright") {
      this.player.x += this.playerSpeed;
      this.player.y -= this.playerSpeed;

    } else if (direction === "downright") {
      this.player.x += this.playerSpeed;
      this.player.y += this.playerSpeed;

    } else if (direction === "downleft") {
      this.player.x -= this.playerSpeed;
      this.player.y += this.playerSpeed;

    } else if (direction === "upleft") {
      this.player.x -= this.playerSpeed;
      this.player.y -= this.playerSpeed;

    } else {
      this.player.x = 0;
      this.player.y = 0;
    }
  }
  addHit(acc, dis) {
    var data = { acc: acc, dis: dis }
    this.events.emit('hit', data);
  }
}
