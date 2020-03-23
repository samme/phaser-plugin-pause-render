console.assert(Phaser);
console.assert(Phaser.VERSION === '3.22.0');
console.assert(PhaserPauseRenderPlugin);

var text;

var scene = {
  preload: function () {
    this.load.image('sky', 'assets/space2.png');
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('spark', 'assets/yellow.png');
  },

  create: function () {
    this.add.image(400, 300, 'sky');

    text = this.add.text(10, 10, 'Phaser v' + Phaser.VERSION);

    var particles = this.add.particles('spark');

    var emitter = particles.createEmitter({
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    var logo = this.physics.add.image(400, 100, 'logo');

    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
  },

  update: function () {
    this.render.paused = !this.input.activePointer.isDown;

    text.setText(`Frame: ${this.game.loop.frame}`);
  }
};

// eslint-disable-next-line no-new
new Phaser.Game({
  width: 800,
  height: 600,
  plugins: {
    global: [
      { key: 'PhaserPauseRenderPlugin', plugin: PhaserPauseRenderPlugin, mapping: 'render', start: true, data: { paused: false } }
    ]
  },
  scene: scene,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 }
    }
  }
});
