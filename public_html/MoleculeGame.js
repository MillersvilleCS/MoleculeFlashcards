
MoleculeGame = function ( )
{
    var gameScreen = new GameScreen ( );
    gameScreen.init();
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

MoleculeGame.prototype.buttonLogic = function( button )
{
    var screenID = this.getCurrentScreen ( ).buttonLogic ( button );
    if ( this.hasScreen ( screenID ) )
    {
        this.swapScreens ( screenID );
    }
};
