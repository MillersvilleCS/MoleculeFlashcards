/**
 * @public
 * @constructor
 * @param {Game} game
 * @param {THREE.Camera} camera
 * @param {String} title
 * @param {Integer} width
 * @param {Integer} height
 * @returns {Application}
 */
Application = function (game, camera, title, width, height) {
    'use strict';
    /**@private @const */
    this.game = game;
    /**@private @const */
    this.camera = camera;
    /**@private @const */
    this.prevTime = Date.now ( );
    /**@private @const */
    this.renderer = new THREE.WebGLRenderer ({ antialias: true });
    this.renderer.setSize (width, height);

    $ ('#container').append (this.renderer.domElement);
};

Application.prototype = {
    constructor: Application,
    /**
     * @private
     * @param {type} currTime
     * @returns {undefined}
     */
    performGameLoop: function (currTime) {
        'use strict';
        requestAnimationFrame (this.performGameLoop.bind (this));
        var delta = currTime - this.prevTime;
        this.game.update (delta);
        this.prevTime = currTime;

        this.renderer.render (this.game.getCurrentScene ( ), this.camera);
    }
};
