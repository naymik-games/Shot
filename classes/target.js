class Target extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture, sway) {
    super(scene, x, y, texture);
    // ...
    scene.add.existing(this);
    scene.targets.push(this)
    if (sway) {
      var tween = scene.tweens.add({
        targets: this,
        x: '+= 8',
        duration: 2500,
        yoyo: true,
        loop: -1
      })
    }

  }
  // ...

  // preUpdate(time, delta) {}
}