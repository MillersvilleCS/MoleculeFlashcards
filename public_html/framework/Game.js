/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Game = function ( )
{

};

Game.prototype =
{
    constructor: Game,
            
    screne: undefined,
            
    update: function ( delta )
    {
       throw new UnimplementedFunctionException ( "update" );
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



