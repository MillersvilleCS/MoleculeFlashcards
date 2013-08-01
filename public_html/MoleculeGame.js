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
    this.screen.update ( delta );
};
