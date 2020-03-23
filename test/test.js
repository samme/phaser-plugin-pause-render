const { assert, spy } = chai;

assert.called = function (fun) {
  chai.assert.isTrue(fun.__spy.called, `${fun.__spy.name} was called`);
};

assert.notCalled = function (fun) {
  chai.assert.isFalse(fun.__spy.called, `${fun.__spy.name} was not called`);
};

mocha.setup('bdd');

describe('Phaser', function () {
  it('is an object', function () {
    assert.isObject(Phaser);
  });

  it('is v3.22.0', function () {
    assert.propertyVal(Phaser, 'VERSION', '3.22.0');
  });
});

describe('PhaserPauseRenderPlugin', function () {
  it('is a function', function () {
    assert.isFunction(PhaserPauseRenderPlugin);
  });
});

describe('New Phaser game with plugin, destroy game', function () {
  beforeEach(function () {
    console.debug('test begin');
    // console.group('test ' + n++);
  });

  afterEach(function () {
    console.debug('test complete');
    // console.groupEnd();
  });

  it('should pass many assertions', function (done) {
    new Phaser.Game({
      type: Phaser.CANVAS,
      canvasStyle: 'display: none',
      plugins: {
        global: [
          { key: 'PhaserPauseRenderPlugin', plugin: PhaserPauseRenderPlugin, mapping: 'rendering', data: { paused: false } }
        ]
      },
      callbacks: {
        postBoot: function (_game) {
          for (const e of Object.values(Phaser.Core.Events)) {
            _game.events.on(e, () => console.debug(e));
          }

          assert.isObject(_game.plugins.getEntry('PhaserPauseRenderPlugin'), 'Plugin manager has entry for "PhaserPauseRenderPlugin"');
          assert.instanceOf(_game.plugins.getEntry('PhaserPauseRenderPlugin').plugin, PhaserPauseRenderPlugin, 'Entry `plugin` is instantiated PhaserPauseRenderPlugin');
          assert.isTrue(_game.plugins.isActive('PhaserPauseRenderPlugin'), 'Plugin is active (because `mapping`');

          const plugin = _game.plugins.get('PhaserPauseRenderPlugin');

          assert.isFalse(plugin.paused, 'Render not paused');

          let preRender;
          let postRender;

          preRender = spy.on(_game.renderer, 'preRender');
          postRender = spy.on(_game.renderer, 'postRender');

          _game.step(0, 0);
          assert.called(preRender);
          assert.called(postRender);
          spy.restore();

          plugin.pause();
          assert.isTrue(plugin.paused, 'Render paused (after pause)');
          plugin.resume();
          assert.isFalse(plugin.paused, 'Render not paused (after resume)');
          plugin.paused = true;
          assert.isTrue(plugin.paused, 'Render paused (after paused = true)');
          plugin.paused = false;
          assert.isFalse(plugin.paused, 'Render not paused (after paused = false)');

          preRender = spy.on(_game.renderer, 'preRender');
          postRender = spy.on(_game.renderer, 'postRender');

          plugin.pause();
          _game.step(0, 0);
          assert.notCalled(preRender);
          assert.notCalled(postRender);
          spy.restore();

          _game.plugins.removeGlobalPlugin('PhaserPauseRenderPlugin');

          assert.isUndefined(_game.plugins.getEntry('PhaserPauseRenderPlugin'), 'Plugin manager has no entry for "PhaserPauseRenderPlugin" (after removing)');

          _game.events.on('destroy', done);
          _game.destroy(true);
        }
      }
    });
  });
});

mocha.checkLeaks();
mocha.globals(['Phaser']);
mocha.run();
