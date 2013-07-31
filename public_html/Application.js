/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Application = function ( game, camera, title, width, height )
{
    this.game = game;
    this.camera = camera;
    
    this.renderer =  new THREE.WebGLRenderer ( );
    this.renderer.setSize ( width, height );
    
    this.frameTimer = new Timer ( );
    this.frameTimer.start ( );
    
    $('#container').append( this.renderer.domElement );
    
    return this;
};

Application.prototype =
{
    constructor: Application,
            
    loop: function ( )
    {
        
        this.game.update ( this.frameTimer.getElapsedTimeMili ( ) );
        this.frameTimer.reset ( );
        this.renderer.render ( this.game.getCurrentScene ( ), this.camera);
    },
            
    exit: function ( )
    {
        
    }
};
