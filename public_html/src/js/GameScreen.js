
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

    if ( MouseManager.leftButton.isPressed )
    {
        this.currentQuestion.value1.mesh.rotation.z -=
                (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;
        
        this.currentQuestion.value1.mesh.rotation.x +=
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
    //start the loading screen
     $ ( '#loadingUI' ).fadeIn( 1 );
     this.questionManager = new QuestionManager ( );
     
    TextLoader.loadText ( this.modelList[0], 
        this.createQuestion.bind ( this ) );
    
};

GameScreen.prototype.startGame = function  ( )
{
    $ ( '#loadingUI' ).fadeOut ( 1 );
    $ ( 'canvas' ).fadeIn ( 500 );
    $ ( '#rightPanel' ).fadeIn ( 500 );
    
    this.questionIterator = this.questionManager.getIterator ( );
    if ( this.questionIterator.hasNext ( ) )
    {
        this.currentQuestion = this.questionIterator.next ( );
        this.scene.add ( this.currentQuestion.value1.mesh );
        this.timer.start ( );
        this.score = 0;
    }
    else
    {
        //exit the game;
    }
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



GameScreen.prototype.nextQuestion = function ( )
{
    //TextLoader.loadText ( 'res/models/aspirin.pdb', this.createMolecule.bind ( this ) );
    if ( this.questionIterator.hasNext ( ) )
    {
        this.scene.remove ( this.currentQuestion.value1.mesh );
        this.currentQuestion = this.questionIterator.next ( );
        this.scene.add ( this.currentQuestion.value1.mesh );
        return true;
    } 
    return false;
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

GameScreen.prototype.createQuestion = function ( data )
{
    var molecule = new Molecule ( data );
    molecule.setPosition ( -2.5, 0, 0 );
    molecule.setUniformScale ( 0.5 );

    this.questionManager.add (molecule, "Option 1");
    var moleculeCount = this.questionManager.numberOfQuestions ( );
    if( moleculeCount === this.modelList.length )
    {
        this.startGame ( );
        //$ ( '#loadingMessage' ).fadeIn( 500 );
        //$ ( '#beginButton' ).fadeIn ( 500 );
    }
    else
    {
        TextLoader.loadText ( this.modelList[moleculeCount], 
            this.createQuestion.bind ( this ) );
    }
};