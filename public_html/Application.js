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
            
    loop: function ( )
    {
         this.game.update ( );
         this.renderer.render ( this.game.getCurrentScene ( ), this.game.getCamera ( ));
    },
            
    exit: function ( )
    {
        
    }
};
