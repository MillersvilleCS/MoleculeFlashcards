
MoleculeGame = function ( )
{
    var gameScreen = new GameScreen ( );
    var menuScreen = new MenuScreen ( );
    var scoreScreen = new HighScoreScreen ( );

    this.addScreen ( 'game', gameScreen );
    this.addScreen ( 'menu', menuScreen );
    this.addScreen ( 'score', scoreScreen );

    this.init ( 'menu' );
};

MoleculeGame.prototype = new Game ( );

MoleculeGame.prototype.update = function ( delta )
{
    this.getCurrentScreen ( ).onUpdate ( delta );
};

MoleculeGame.prototype.buttonLogic = function ( button )
{
    var screenID = this.getCurrentScreen ( ).buttonLogic ( button );
    if ( this.hasScreen ( screenID ) )
    {
        this.swapScreens ( screenID );
    }
};
