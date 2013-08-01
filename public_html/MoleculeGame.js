/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

MoleculeGame = function ( )
{
    this.screen = new GameScreen ( );
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
    switch ( button )
    {
        case 'START':
            $('#mainMenuUI').fadeOut(500);
            break;

        case 'HIGH SCORES':
            $('canvas').css('display', 'none');
            $('#mainMenuUI').fadeOut(500);
            $('#gameUI').fadeOut(500);
            $('#highScoreUI').css('display', 'block');
            break;
            
        case 'Main Menu':
            $('#mainMenuUI').fadeIn(500);
            $('#gameUI').fadeIn(500);
            $('#highScoreUI').delay(500).fadeOut(1);
            $('canvas').delay(500).fadeIn(1);
            break;
        default:
            alert('Not Yet Implemented!');
    }
};
