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


    //this.cameras.main.setBackgroundColor(0x000000);
    this.cameras.main.setBounds(0, 0, 4200, 4200);
    this.physics.world.setBounds(0, 0, 4200, 4200);
    this.cameras.main.setZoom(.5)
    /* this.add.image(-1024, -1024, 'bg').setOrigin(0);
    this.add.image(0, -1024, 'bg').setOrigin(0);
    this.add.image(-1024, 0, 'bg').setOrigin(0); */
    var pic = this.add.image(0, 0, 'sky').setOrigin(0).setScale(3);
    var bounds = this.cameras.main.getBounds();
    this.gSize = 40
    var g1 = this.add.grid(0, 0, bounds.width, bounds.height, this.gSize, this.gSize, 0x333333, 0, 0xcccccc, .5).setOrigin(0);



    this.target = this.add.image(13 * this.gSize, 0, 'target')
    this.setTarget(52, 52, 3)



    this.cursors = this.input.keyboard.createCursorKeys();
    this.spot = this.add.image(0, 0, 'particle').setTint(0xff0000).setAlpha(0)

    this.player = this.physics.add.image(2100, 2100, 'scope').setScale(.5).setAlpha(.1)

    this.player.setCollideWorldBounds(true);

    this.cameras.main.startFollow(this.player, true);
    this.playerSpeed = 5

    spotlight = this.make.sprite({
      x: 0,
      y: 0,
      scale: 1,
      key: 'mask',
      add: false
    });

    //pic.mask = new Phaser.Display.Masks.BitmapMask(this, spotlight);

    this.text = this.add.text(32, 86).setScrollFactor(0).setFontSize(62).setColor('#000000');
    /* this.input.on("pointerdown", this.gemSelect, this);
     this.input.on("pointermove", this.drawPath, this);
     this.input.on("pointerup", this.removeGems, this);
    */
    //this.check = this.add.image(725, 1000, 'check').setScale(.7);



  }
  update() {
    // spotlight.x = this.player.x;
    // spotlight.y = this.player.y;




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
  setTarget(col, row, distance) {
    var xpos = col * this.gSize
    var ypos = row * this.gSize
    this.target.setPosition(xpos, ypos).setScale(distance)
    var tbound = this.target.getBounds()
    this.rect = new Phaser.Geom.Rectangle(tbound.x, tbound.y, tbound.width, tbound.height)
  }
  toggleScope() {
    if (this.cameras.main.zoom == .5) {
      this.cameras.main.setZoom(3)
      //this.player.setAlpha(.8)
      var tween = this.tweens.add({
        targets: this.player,
        delay: 100,
        duration: 300,
        alpha: 1
      })
      this.cameras.main.setBounds(0, 0, 4200 * 3, 4200 * 3);
      this.physics.world.setBounds(0, 0, 4200 * 3, 4200 * 3);
    } else {
      this.cameras.main.setZoom(.5)
      //this.player.setAlpha(.2)
      var tween = this.tweens.add({
        targets: this.player,
        duration: 300,
        alpha: .1
      })
      this.cameras.main.setBounds(0, 0, 4200, 4200);
      this.physics.world.setBounds(0, 0, 4200, 4200);
    }
  }
  fire() {
    var tween = this.tweens.add({
      targets: this.player,
      y: '-=8',
      yoyo: true,
      duration: 100
    })
    //this.sound.play('shot')
    this.spot.setAlpha(1)
    this.spot.setPosition(this.player.x, this.player.y)
    if (Phaser.Geom.Rectangle.ContainsPoint(this.rect, this.spot)) {
      console.log('HIT')
      this.setTarget(56, 52)
    }

  }
  movePlayer(direction, force) {
    if (force > 50) {
      this.playerSpeed = 10
    } else {
      this.playerSpeed = 1
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
  addScore() {
    this.events.emit('score');
  }
}
