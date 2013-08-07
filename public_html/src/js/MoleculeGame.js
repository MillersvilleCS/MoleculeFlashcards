
MoleculeGame = function ( )
{
    var gameScreen = new GameScreen ( );
    var loadingScreen = new LoadingScreen ( );
    var menuScreen = new MenuScreen ( );
    var scoreScreen = new HighScoreScreen ( );

    this.screenMap.put ( 'game', gameScreen );
    this.screenMap.put ( 'loading', loadingScreen );
    this.screenMap.put ( 'menu', menuScreen );
    this.screenMap.put ( 'score', scoreScreen );

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
