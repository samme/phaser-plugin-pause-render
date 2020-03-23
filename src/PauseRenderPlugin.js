import Phaser from 'phaser';

const { PRE_STEP, STEP, POST_STEP, PRE_RENDER, POST_RENDER, DESTROY } = Phaser.Core.Events;

const _origStep = Phaser.Game.prototype.step;

let paused = false;

const _step = function (time, delta) {
  if (this.pendingDestroy) {
    return this.runDestroy();
  }

  const { events, renderer } = this;

  events.emit(PRE_STEP, time, delta);
  events.emit(STEP, time, delta);
  this.scene.update(time, delta);
  events.emit(POST_STEP, time, delta);

  if (paused) return;

  renderer.preRender();
  events.emit(PRE_RENDER, renderer, time, delta);
  this.scene.render(renderer);
  renderer.postRender();
  events.emit(POST_RENDER, renderer, time, delta);
};

export default class PauseRenderPlugin extends Phaser.Plugins.BasePlugin {
  init (data) {
    console.debug('init');
    console.debug('data', data);

    this.paused = (data && data.paused) || false;
  }

  start () {
    console.debug('start');

    this.game.events.once(DESTROY, this.destroy, this);

    this.game.step = _step;
  }

  stop () {
    console.debug('stop');

    this.resume();
    this.game.step = _origStep;
  }

  destroy () {
    console.debug('destroy');

    this.stop();

    super.destroy();
  }

  pause () {
    paused = true;
  }

  resume () {
    paused = false;
  }

  get paused () {
    return paused;
  }

  set paused (val) {
    return (paused = val);
  }
}
