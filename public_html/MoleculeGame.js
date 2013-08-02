/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

MoleculeGame = function ( )
{
    this.gameScreen = new GameScreen ( );
    this.menuScreen = new MenuScreen ( );
    this.screen = this.menuScreen;
};

MoleculeGame.prototype = new Game ( );   

MoleculeGame.prototype.update = function ( delta )
{
    this.screen.onUpdate ( delta );
};

/*
    Handles game-to-game logic for buttons. Can be moved to another
    class if you need to.
*/
MoleculeGame.prototype.buttonLogic = function( button )
{
    var screenID = this.screen.buttonLogic ( button );
    this.changeScreen ( screenID );
};

MoleculeGame.prototype.changeScreen = function ( screenID )
{
    switch ( screenID )
    {
        case undefined:
            return;
        
        case 'game':
            this.swapScreens ( this.gameScreen );
            break;
            
        case 'menu':
            this.swapScreens ( this.menuScreen );
            break;
            
        default:
            alert( 'No such Screen!' );
            
    }
};