
GameScreen = function ( )
{
    this.timer = new Timer ( );
    this.score = 0;
    this.currentQuestion = 0;
    this.numberOfQuestions = 0;
    this.moleculeList = [];
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
    console.log('ran time: ' + Date.now());

    var timeElement = document.getElementById ( "time" );
    timeElement.innerHTML = game.getScreen ( 'game' ).getSecondsLeft ();

    var timeElement = document.getElementById ( "score" );
    timeElement.innerHTML = game.getScreen ( 'game' ).score;

    if ( MouseManager.leftButton.isPressed && this.moleculeList[this.currentMolecule] !== undefined)
    {
        this.moleculeList[this.currentMolecule].mesh.rotation.z -=
                (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;
        
        this.moleculeList[this.currentMolecule].mesh.rotation.x +=
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
    $ ( 'canvas' ).fadeIn ( 500 );
    $ ( '#rightPanel' ).fadeIn ( 500 );
    
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

/*
GameScreen.prototype.createMolecule = function ( data )
{   
    if ( this.currentMolecule !== undefined )
    {
        this.scene.remove ( this.currentMolecule.mesh );
    }
    this.currentMolecule = new Molecule ( data );
    this.currentMolecule.setPosition ( -2.5, 0, 0 );
    this.currentMolecule.setUniformScale ( 0.5 );
    this.scene.add ( this.currentMolecule.mesh );
};
*/

GameScreen.prototype.pushMolecules = function  ( molecule )
{
    this.moleculeList.push(molecule);
};

GameScreen.prototype.nextQuestion = function ( )
{
    //TextLoader.loadText ( 'res/models/aspirin.pdb', this.createMolecule.bind ( this ) );
    if ( this.moleculeList[this.currentQuestion] != undefined )
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
