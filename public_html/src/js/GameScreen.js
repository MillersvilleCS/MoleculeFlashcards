
GameScreen = function ( )
{
    this.timer = new Timer ( );
    this.score = 0;
    this.currentQuestion = 0;
    this.numberOfQuestions = 0;
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
    timeElement.innerHTML = game.getScreen ( 'game' ).getSecondsLeft ();

    var timeElement = document.getElementById ( "score" );
    timeElement.innerHTML = game.getScreen ( 'game' ).score;

    if ( MouseManager.leftButton.isPressed && this.currentMolecule !== undefined)
    {
        this.currentMolecule.mesh.rotation.x +=
                (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;
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
    $ ( 'canvas' ).fadeIn ( 1 );
    $ ( '#rightPanel' ).fadeIn ( 1 );
    
    //this.currentMolecule = this.createMolecule ( );
    this.nextQuestion ( );
    this.timer.start ( );
    this.score = 0;
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

GameScreen.prototype.createMolecule = function ( data )
{   
    if(this.currentMolecule !== undefined )
    {
        this.scene.remove ( this.currentMolecule.mesh );
    }
    this.currentMolecule = new Molecule ( data );
    this.scene.add ( this.currentMolecule.mesh );
};
GameScreen.prototype.nextQuestion = function ( )
{
    TextLoader.loadText ( 'res/models/first.pdb', this.createMolecule.bind ( this ) );
    ++this.currentQuestion;
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