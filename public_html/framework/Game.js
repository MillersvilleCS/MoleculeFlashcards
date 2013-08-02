/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Game = function ( )
{
    this.screenMap = new Map ( )
    this.screenID = undefined;
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
        return this.getCurrentScreen ( ).scene;
    },
            
    getCurrentScreen: function ( )
    {
        return this.screenMap.get ( this.screenID );
    },
            
    swapScreens: function ( screenID )
    {
        this.getCurrentScreen ( ).onLeave ( );
        this.screenID = screenID;
        this.getCurrentScreen ( ).onResume ( );
    }
};



