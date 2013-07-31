/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Game = function ( )
{
    this.screen = new GameScreen ( );
    
    return this;
};

Game.prototype =
{
    constructor: Game,
            
    update: function ( delta )
    {
        this.screen.update ( delta );
    },
            
    getCurrentScene: function ( )
    {
        return this.screen.scene;
    },
            
    swapScreens: function ( screen )
    {
        this.game.screen.onLeave ( );
        this.game.screen = screen;
        this.game.screen.onResume ( );
    }
};



