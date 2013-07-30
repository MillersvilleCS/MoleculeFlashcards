/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Game = function ( camera )
{
    this.camera = camera;
    this.screen = new GameScreen ( );
    
    return this;
};

Game.prototype =
{
    constructor: Game,
    
    camera: undefined,
    screen: undefined,
    
    init: function ( )
    {
        this.screen.init( );
    },
            
    update: function ( )
    {
        this.screen.update ( 0 );
    },
    getCamera: function ( )
    {
        return this.camera;
    },
            
    getCurrentScene: function ( )
    {
        return this.screen.scene;
    }
    
    
};



