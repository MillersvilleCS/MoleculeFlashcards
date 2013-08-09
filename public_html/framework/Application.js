Application = function (game, camera, title, width, height) {
    'use strict';
    /**@const*/
    this.game = game;
    /**@const*/
    this.camera = camera;
    /**@const*/
    this.renderer = new THREE.WebGLRenderer ({
        antialias: true
    });
    this.renderer.setSize (width, height);

    this.prevTime = Date.now ( );

    $ ('#container').append (this.renderer.domElement);
};

Application.prototype = {
    constructor: Application,
    performGameLoop: function (currTime) {
        'use strict';
        requestAnimationFrame (this.performGameLoop.bind (this));
        var delta = currTime - this.prevTime;
        this.game.update (delta);
        this.prevTime = currTime;

        this.renderer.render (this.game.getCurrentScene ( ), this.camera);
    }
};
