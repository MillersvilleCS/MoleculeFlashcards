
MoleculeGame = function ( )
{
    var gameScreen = new GameScreen ( );
    var menuScreen = new MenuScreen ( );
    var scoreScreen = new HighScoreScreen ( );

    this.screenMap.put ( 'game', gameScreen );
    this.screenMap.put ( 'menu', menuScreen );
    this.screenMap.put ( 'score', scoreScreen );

    this.screenID = 'menu';
    this.getCurrentScreen ( ).onResume ( );
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
