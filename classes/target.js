class Target extends Phaser.GameObjects.Image {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    // ...
    scene.add.existing(this);
    scene.targets.push(this)
  }
  // ...

  // preUpdate(time, delta) {}
}