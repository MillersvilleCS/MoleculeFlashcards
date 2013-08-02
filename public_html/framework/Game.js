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
        this.screen.onLeave ( );
        this.screen = screen;
        this.screen.onResume ( );
    }
};



