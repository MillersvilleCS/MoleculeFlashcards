
GameScreen = function ( )
{
    this.timer = new Timer ( );
    this.nextMolecule = undefined;
    this.score = 0;
    this.GAME_LENGTH = 120;

    /*
     this.moleculeTest = new Molecule ( molStr );
     this.moleculeTest.setUniformScale ( 0.5 );
     
     this.moleculeTest.addPosition ( -2.5, 0, 0 ) ;
     this.scene.add ( this.moleculeTest.mesh );
     */

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

    if ( MouseManager.leftButton.isPressed )
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
    this.currentMolecule = this.createMolecule ( );
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

GameScreen.prototype.createMolecule = function ( )
{
    var moleculeData;
    TextLoader.loadText ( 'models/aspirin.pdb', moleculeData );
    return new Molecule ( moleculeData );
};
GameScreen.prototype.nextQuestion = function ( )
{
    this.currentMolecule = this.nextMolecule;
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
