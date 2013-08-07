
LoadingScreen = function ( )
{
    this.moleculeCount = 0;

    this.modelList = 
    [
        'res/models/first.pdb',
        'res/models/aspirin.pdb',
        'res/models/0.pdb',
        'res/models/1.pdb',
        'res/models/2.pdb',
        'res/models/4.pdb',
        'res/models/5.pdb'
    ];
};

LoadingScreen.prototype = new Screen ( );


LoadingScreen.prototype.onUpdate = function ( delta )
{

};

LoadingScreen.prototype.onPause = function ( )
{

};

LoadingScreen.prototype.onLeave = function ( )
{
    $ ( '#loadingUI' ).fadeOut ( 1 );
};

LoadingScreen.prototype.onResume = function ( )
{
    $ ( '#loadingUI' ).fadeIn( 1 );
    TextLoader.loadText ( this.modelList[this.moleculeCount], this.pushMolecule.bind ( this ) );
};

LoadingScreen.prototype.pushMolecule = function ( data )
{
    var molecule = new Molecule ( data );
    molecule.setPosition ( -2.5, 0, 0 );
    molecule.setUniformScale ( 0.5 );

    game.getScreen ( 'game' ).pushMolecules( molecule );
    ++this.moleculeCount;

    if( this.moleculeCount == this.modelList.length )
    {
        $ ( '#loadingMessage' ).fadeIn( 500 );
        $ ( '#beginButton' ).fadeIn ( 500 );
    }
    else
    {
        TextLoader.loadText ( this.modelList[this.moleculeCount], this.pushMolecule.bind ( this ) );
    }
};

LoadingScreen.prototype.buttonLogic = function ( button )
{
    switch ( button )
    {
        case 'Begin':
            return 'game';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};
