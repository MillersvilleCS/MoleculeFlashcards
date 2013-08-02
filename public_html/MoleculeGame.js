/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

MoleculeGame = function ( )
{
    var gameScreen = new GameScreen ( );
    var menuScreen = new MenuScreen ( );
    
    this.screenMap.put ( 'game', gameScreen );
    this.screenMap.put ( 'menu', menuScreen );
    
    this.screenID = 'menu';
};

MoleculeGame.prototype = new Game ( );   

MoleculeGame.prototype.update = function ( delta )
{
    this.getCurrentScreen ( ).onUpdate ( delta );
};

/*
    Handles game-to-game logic for buttons. Can be moved to another
    class if you need to.
*/
MoleculeGame.prototype.buttonLogic = function( button )
{
    var screenID = this.getCurrentScreen ( ).buttonLogic ( button );
    if ( screenID !== undefined )
    {
        this.swapScreens ( screenID );
    }
};