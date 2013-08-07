
GameScreen = function ( )
{
    //////////temporary/////////////
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
    ////////////////////
    this.timer = new Timer ( );
    this.score = 0;
    this.GAME_LENGTH = 120;

    var pointLight = new THREE.PointLight ( 0xFFFFFF );

    // set its position
    pointLight.position.x = 0;
    pointLight.position.y = 0;
    pointLight.position.z = 130;

    // add to the scene
    this.scene.add ( pointLight );
};

GameScreen.prototype = new Screen ( );

GameScreen.prototype.onUpdate = function ( delta )
{
    var timeElement = document.getElementById ( "time" );
    timeElement.innerHTML = Timer.getDigitalRep ( this.getSecondsLeft  ( ) );
    
    var scoreElement = document.getElementById ( "score" );
    scoreElement.innerHTML = this.score;

    if ( MouseManager.leftButton.isPressed && 
            this.moleculeList[this.currentQuestion] !== undefined)
    {
        this.moleculeList[this.currentQuestion].mesh.rotation.z -=
                (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;
        
        this.moleculeList[this.currentQuestion].mesh.rotation.x +=
                (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
    }
};

GameScreen.prototype.onPause = function ( )
{

};

GameScreen.prototype.onLeave = function ( )
{
    this.timer.reset ( );
};

GameScreen.prototype.onResume = function ( )
{
     $ ( '#loadingUI' ).fadeIn( 1 );
    TextLoader.loadText ( this.modelList[this.moleculeCount], this.pushMolecule.bind ( this ) );
    
};

GameScreen.prototype.getSecondsLeft = function ( )
{
    var time = this.GAME_LENGTH - this.timer.getElapsedSec ( );
    
    if ( time > 0 )
    {
        return time;
    }
    return 0;
};

GameScreen.prototype.startGame = function  ( )
{
    
    
    $ ( '#loadingUI' ).fadeOut ( 1 );
    $ ( 'canvas' ).fadeIn ( 500 );
    $ ( '#rightPanel' ).fadeIn ( 500 );
    
    //this.currentMolecule = this.createMolecule ( );
    this.nextQuestion ( );
    this.timer.start ( );
    this.score = 0;
};

GameScreen.prototype.nextQuestion = function ( )
{
    //TextLoader.loadText ( 'res/models/aspirin.pdb', this.createMolecule.bind ( this ) );
    if ( this.moleculeList[this.currentQuestion] !== undefined )
    {
        this.scene.remove ( this.moleculeList[this.currentQuestion].mesh );
        ++this.currentQuestion;  
    }
    
    this.scene.add ( this.moleculeList[this.currentQuestion].mesh );
};

GameScreen.prototype.buttonLogic = function ( button )
{
    switch ( button )
    {
        case 'Option 1':
            this.nextQuestion ();
            break;

        case 'Option 2':
            alert ( 'Not Yet Implemented!' );
            break;

        case 'Option 3':
            alert ( 'Not Yet Implemented!' );
            break;

        case 'Option 4':
            alert ( 'Not Yet Implemented!' );
            break;

        default:
            //alert( 'Not Yet Implemented!' );
    }
};

LoadingScreen.prototype.pushMolecule = function ( data )
{
    var molecule = new Molecule ( data );
    molecule.setPosition ( -2.5, 0, 0 );
    molecule.setUniformScale ( 0.5 );

    this.moleculeList.push(molecule);
    ++this.moleculeCount;

    if( this.moleculeCount === this.modelList.length )
    {
        $ ( '#loadingMessage' ).fadeIn( 500 );
        $ ( '#beginButton' ).fadeIn ( 500 );
    }
    else
    {
        TextLoader.loadText ( this.modelList[this.moleculeCount], this.pushMolecule.bind ( this ) );
    }
};