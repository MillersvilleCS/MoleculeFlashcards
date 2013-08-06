Application = function ( game, camera, title, width, height )
{
    this.game = game;
    this.camera = camera;

    this.renderer = new THREE.WebGLRenderer ( );
    this.renderer.setSize ( width, height );

    this.frameTimer = new Timer ( );
    this.frameTimer.start ( );

    this.prevTime = Date.now ( );

    $ ( '#container' ).append ( this.renderer.domElement );
};

Application.prototype = {
    constructor: Application,
    performGameLoop: function ( currTime )
    {
        requestAnimationFrame ( this.performGameLoop.bind ( this ) );
        var delta = currTime - this.prevTime;
        this.game.update ( delta );
        this.prevTime = currTime;

        this.renderer.render ( this.game.getCurrentScene ( ), this.camera );
    }
};
