/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Application = function ( game, title, width, height )
{
    this.game = game;
    this.game.init ( );
    
    this.renderer =  new THREE.WebGLRenderer ( );
    this.renderer.setSize ( width, height );
    
    $('#container').append( this.renderer.domElement );
    
    return this;
};

Application.prototype =
{
    constructor: Application,
    
    game: undefined,
    renderer: undefined,
    frameTimer: new Timer ( ),
            
    loop: function ( )
    {  
        this.game.update ( this.frameTimer.getElapsedTimeMili ( ) );
        this.frameTimer.reset ( );
        this.renderer.render ( this.game.getCurrentScene ( ), this.game.camera);
    },
            
    exit: function ( )
    {
        
    }
};
