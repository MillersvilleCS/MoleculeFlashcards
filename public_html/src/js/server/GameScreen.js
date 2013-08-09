

GameScreen = function ( )
{
    this.MOLECULE = 0;
    this.ANSWER = 1;
    this.WRONG_ANSWER_POINTS = -30;
    this.RIGHT_ANSWER_POINTS = 100;
    this.GAME_LENGTH = 10;

    this.timer = new Timer ( );
    this.scoreManager = new ScoreManager ( );
    this.communicationsManager = new CommunicationsManager ( );

    this.loadingState = 0;
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


    (function createScene ( )
    {
        var pointLight = new THREE.PointLight (0xFFFFFF);

        // set its position
        pointLight.position.x = 0;
        pointLight.position.y = 0;
        pointLight.position.z = 130;

        // add to the scene
        this.scene.add (pointLight);
    }) ();

};

GameScreen.prototype = new Screen ( );

GameScreen.prototype.onUpdate = function (delta)
{
    if (this.getSecondsLeft ( ) < 15)
    {
        $ ('#time').css ('color', 'red');
    }
    if (this.getSecondsLeft () === 0)
    {
        this.endGame ( );
    }

    var timeElement = document.getElementById ("time");
    timeElement.innerHTML = Timer.getDigitalRep (this.getSecondsLeft ( ));

    var scoreElement = document.getElementById ("score");
    scoreElement.innerHTML = this.scoreManager.score;

    if (MouseManager.leftButton.isPressed)
    {
        this.currentQuestion[this.MOLECULE].rotation.z -=
                (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;

        this.currentQuestion[this.MOLECULE].rotation.x +=
                (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
    }
};

GameScreen.prototype.onPause = function ( )
{

};

GameScreen.prototype.onLeave = function ( )
{
    $ ('#gameCompletedUI').fadeOut (500);
    $ ('#rightPanel').fadeOut (500);
    $ ('#gameCompletedReturnButton').fadeOut (500);

    this.scene.remove (this.currentQuestion[ this.MOLECULE ]);
    this.currentQuestion = undefined;
    this.timer.stop ( );
};

GameScreen.prototype.onResume = function ( )
{
    //start the loading screen
    $ ('#loadingUI').fadeIn (500);
    $ ('#rightPanel').fadeIn (500);

    this.timer.reset ( );
    this.questionList = [];
    TextLoader.loadText (this.modelList[0],
            this.loadAssets.bind (this));

};

GameScreen.prototype.startGame = function ( )
{
    $ ('#beginButton').fadeOut (500);
    $ ('#loadingUI').fadeOut (1);
    $ ('canvas').fadeIn (500);

    this.scoreManager.reset ( );
    this.questionIterator = new Iterator (this.questionList);
    if (this.questionIterator.hasNext ( ))
    {
        this.currentQuestion = this.questionIterator.next ( );
        this.scene.add (this.currentQuestion [ this.MOLECULE ]);
        this.timer.start ( );
    }
    else
    {
        this.endGame ( );
    }
};

GameScreen.prototype.endGame = function ( )
{
    $ ('#gameCompletedUI').fadeIn (500);
    $ ('#gameCompletedReturnButton').fadeIn (500);
};

GameScreen.prototype.nextQuestion = function ( )
{
    //TextLoader.loadText ( 'res/models/aspirin.pdb', this.createMolecule.bind ( this ) );
    if (this.questionIterator.hasNext ( ))
    {
        this.scene.remove (this.currentQuestion[ this.MOLECULE ]);
        this.currentQuestion = this.questionIterator.next ( );
        this.scene.add (this.currentQuestion[ this.MOLECULE ]);
        return true;
    }
    return false;
};

GameScreen.prototype.loadAssets = function (data)
{
    //update loading screen
    var loadingString = "Loading";
    ++this.loadingState;
    for (var i = 0; i < (this.loadingState / 2) % 3; ++i)
    {
        loadingString += '.';
    }
    $ ('#loadingMessage').html (loadingString);

    //create a new question
    var molecule = MoleculeGeometryBuilder.load (data);
    molecule.position.x = -2.5;
    molecule.scale.x = 0.5;
    molecule.scale.y = 0.5;
    molecule.scale.z = 0.5;

    this.questionList.push ([molecule, 'Option 1']);

    //check if all the molecules have been loaded
    var moleculeCount = this.questionList.length;
    if (moleculeCount === this.modelList.length)
    {
        $ ('#loadingMessage').html ('Ready');
        $ ('#loadingMessage').css ('padding-left', '0px');
        $ ('#loadingMessage').css ('text-align', 'center');
        $ ('#beginButton').fadeIn (500);

    }
    else
    {
        TextLoader.loadText (this.modelList[moleculeCount],
                this.loadAssets.bind (this));
    }
};

GameScreen.prototype.getSecondsLeft = function ( )
{
    var time = this.GAME_LENGTH - this.timer.getElapsedSec ( );

    if (time > 0)
    {
        return time;
    }
    return 0;
};

GameScreen.prototype.answerQuestion = function (userAnswer)
{
    if (this.currentQuestion [ this.ANSWER ] === userAnswer)
    {
        this.scoreManager.correct (this.RIGHT_ANSWER_POINTS);
        $ ('#scoreChange').html (this.scoreManager.text ( ));
        $ ('#scoreChange').css ('color', 'green');
        //Must use .animate, because .fadeIn/.fadeOut set display: none
        $ ('#scoreChange').animate ({
            opacity: 1.0
        },
        300);
        $ ('#scoreChange').delay (300).animate ({
            opacity: 0
        },
        500);
        this.nextQuestion ();
    }
    else
    {
        this.scoreManager.incorrect (this.WRONG_ANSWER_POINTS);
        $ ('#scoreChange').html (this.scoreManager.text ( ));
        $ ('#scoreChange').css ('color', 'red');
        $ ('#scoreChange').animate ({
            opacity: 1.0
        },
        300);
        $ ('#scoreChange').delay (300).animate ({
            opacity: 0
        },
        500);
    }
};

GameScreen.prototype.buttonLogic = function (button)
{
    switch (button)
    {
        case 'Option 1':
            this.answerQuestion ('Option 1');
            break;

        case 'Option 2':
            this.answerQuestion ('Option 2');
            break;

        case 'Option 3':
            this.answerQuestion ('Option 3');
            break;

        case 'Option 4':
            this.answerQuestion ('Option 4');
            break;

        case 'Begin Game':
            this.startGame ( );
            break;

        case 'Game Return':
            return 'menu';

        default:
            //alert( 'Not Yet Implemented!' );
    }
};

