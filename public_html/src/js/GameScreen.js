
GameScreen = function ( ) {
    'use strict';
    Screen.apply (this, arguments);

    this.MOLECULE = 0;
    this.ANSWER = 1;
    this.WRONG_ANSWER_POINTS = -30;
    this.RIGHT_ANSWER_POINTS = 100;
    this.GAME_LENGTH = 120;

    this.timer = new Timer ( );
    this.scoreManager = new ScoreManager ( );

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
    this.questionList = [];
    this.currentQuestion = undefined;
    this.questionIterator = undefined;
    this.wrongAnswers = new Map ( );

    var pointLight = new THREE.PointLight (0xFFFFFF);

    // set its position
    pointLight.position.set (0, 0, 130);

    // add to the scene
    this.scene.add (pointLight);
};

GameScreen.prototype = Object.create (Screen.prototype);
GameScreen.prototype.constructor = GameScreen;

GameScreen.prototype.onUpdate = function (delta) {
    'use strict';
    if (this.getSecondsLeft ( ) < 15) {
        $ ('#time').css ('color', 'red');
    }
    if (this.getSecondsLeft () === 0) {
        this.endGame ( );
    }

    $ ('#time').html (Timer.getDigitalRep (this.getSecondsLeft ( )));
    $ ('#score').html (this.scoreManager.score);

    if (MouseManager.leftButton.isPressed && this.active) {

        this.currentQuestion[this.MOLECULE].rotation.z -=
                (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;

        this.currentQuestion[this.MOLECULE].rotation.x +=
                (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
    }
};

GameScreen.prototype.onPause = function ( ) {
    'use strict';
};

GameScreen.prototype.onLeave = function ( ) {
    'use strict';
    $ ('#gameCompletedUI').fadeOut (500);
    $ ('#rightPanel').fadeOut (500);
    $ ('#gameCompletedReturnButton').fadeOut (500);
    $ ('#time').css ('color', '#F8F8FE');
    $ ('#time').html ('2:00');
    $ ('#score').html ('0');

    this.scoreManager.reset ( );
};

GameScreen.prototype.onResume = function ( ) {
    'use strict';
    //start the loading screen
    $ ('#loadingUI').fadeIn (500);
    $ ('#rightPanel').fadeIn (500);

    this.timer.reset ( );
    this.questionList = [];
    this.loadingState = 0;
    this.active = false;
    TextLoader.loadText (this.modelList[0],
            this.loadAssets.bind (this));

};

GameScreen.prototype.startGame = function ( ) {
    'use strict';
    $ ('#beginButton').fadeOut (500);
    $ ('#loadingUI').fadeOut (1);
    $ ('canvas').fadeIn (500);

    this.active = true;
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

GameScreen.prototype.endGame = function ( ) {
    'use strict';
    this.active = false;
    this.scene.remove (this.currentQuestion[ this.MOLECULE ]);
    this.currentQuestion = undefined;
    this.timer.stop ( );
    $ ('#scoreChange').stop (true, true);
    $ ('#scoreChange').animate ({
        opacity: 0
    },
    300);
    $ ('#gameCompletedUI').fadeIn (500);
    $ ('#gameCompletedReturnButton').fadeIn (500);
};

GameScreen.prototype.nextQuestion = function ( ) {
    'use strict';
    //TextLoader.loadText ( 'res/models/aspirin.pdb', this.createMolecule.bind ( this ) );
    if (this.questionIterator.hasNext ( )) {
        this.scene.remove (this.currentQuestion[ this.MOLECULE ]);
        this.currentQuestion = this.questionIterator.next ( );
        this.scene.add (this.currentQuestion[ this.MOLECULE ]);
        this.active = true;
    } else {
        this.endGame ( );
    }
};

GameScreen.prototype.loadAssets = function (data) {
    'use strict';
    //update loading screen
    var loadingString = "Loading";
    ++this.loadingState;
    for (var i = 0; i < (this.loadingState / 2) % 3; ++i) {
        loadingString += '.';
    }
    $ ('#loadingMessage').html (loadingString);

    //create a new question
    var molecule = MoleculeGeometryBuilder.load (data);
    molecule.position = new THREE.Vector3 (-2.5, -1, 0);
    molecule.scale = new THREE.Vector3 (0.5, 0.5, 0.5);

    this.questionList.push ([molecule, 'Option 1']);

    //check if all the molecules have been loaded
    var moleculeCount = this.questionList.length;
    if (moleculeCount === this.modelList.length) {
        $ ('#loadingMessage').html ('Ready');
        $ ('#loadingMessage').css ('padding-left', '0px');
        $ ('#loadingMessage').css ('text-align', 'center');
        $ ('#beginButton').fadeIn (500);

    } else {
        TextLoader.loadText (this.modelList[moleculeCount],
                this.loadAssets.bind (this));
    }
};

GameScreen.prototype.getSecondsLeft = function ( ) {
    'use strict';
    var time = this.GAME_LENGTH - this.timer.getElapsedSec ( );

    if (time > 0) {
        return time;
    }

    return 0;
};

GameScreen.prototype.answerQuestion = function (userAnswer)
{
    'use strict';
    //prevents answering a question correctly multiple times (lock)
    if (!this.active) {
        return;
    }

    if (this.currentQuestion [ this.ANSWER ] === userAnswer) {
        this.active = false;
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
        this.wrongAnswers = new Map ( );
        this.nextQuestion ();
    } else {
        if (!this.wrongAnswers.contains (userAnswer)) {
            this.wrongAnswers.put (userAnswer);
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
            if (this.wrongAnswers.size === 3) {
                this.active = false;
                this.wrongAnswers = new Map ( );
                this.nextQuestion ( );
            }
        }
    }
};

GameScreen.prototype.buttonLogic = function (button) {
    'use strict';
    switch (button) {
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
            alert ('Not Yet Implemented!');
    }
};