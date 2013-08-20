(function () {
    'use strict';

    var GameScreen = function ($element) {
        'use strict';
        Screen.apply (this, [$element]);
        //constants
        this.MOLECULE = 0;
        this.ANSWER = 1;
        this.WRONG_ANSWER_POINTS = -30;
        this.RIGHT_ANSWER_POINTS = 100;
        this.GAME_LENGTH = 120;

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
        this.scoreManager = new ScoreManager ( );
        this.gameData = undefined;
        this.loadingState = 0;
        this.questionList = [];
        this.currentQuestion = undefined;
        this.questionIterator = undefined;
        this.wrongAnswers = new Map ( );
        this.answerPoll = [];

        var pointLight = new THREE.PointLight (0xFFFFFF);
        pointLight.position.set (0, 0, 130);
        this.scene.add (pointLight);


        //this.scene.add ( new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() ) );
    };

    GameScreen.prototype = Object.create (Screen.prototype);
    GameScreen.prototype.constructor = GameScreen;

    GameScreen.prototype.onUpdate = function (delta) {
        
        if (this.answerPoll.length > 0) {
            for (var i = 0; i < this.answerPoll.length; ++i) {
                this.answerQuestion (this.answerPoll [i]);
            }
            this.answerPoll = [];
        }
        
        
        //update the timer
        if (this.getSecondsLeft () === 0) {
            this.endGame ( );
        }
        if (this.getSecondsLeft ( ) < 15) {
            $ ('#time').css ('color', 'red');
        }

        $ ('#time').html (Timer.getDigitalRep (this.getSecondsLeft ( )));
        $ ('#score').html (this.scoreManager.score);

        //update the molecule
        if (MouseManager.leftButton.isPressed) {

            this.currentQuestion[this.MOLECULE].rotation.z -=
                    (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;

            this.currentQuestion[this.MOLECULE].rotation.x +=
                    (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
        }
    };

    GameScreen.prototype.onPause = function ( ) {

    };

    GameScreen.prototype.onLeave = function ( ) {

    };

    GameScreen.prototype.onLeave = function ( ) {
        disableButtons( );
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
        this.answerPoll = [];
        this.loadingState = 0;

        /* TextLoader.loadText (this.modelList[0],
                this.loadAssets.bind (this)); */
        FCCommunicationManager.loadFlashcardGame( UserData.auth, UserData.gameID, this.receiveQuestionList.bind(this) );
    };

    GameScreen.prototype.startGame = function ( ) {
        'use strict';

        $ ('#beginButton').fadeOut (500);
        $ ('#loadingUI').fadeOut (1);
        $ ('canvas').fadeIn (500);

        this.questionIterator = new Iterator (this.questionList);
        if (this.questionIterator.hasNext ()) {
            this.currentQuestion = this.questionIterator.next ( );
            this.scene.add (this.currentQuestion [this.MOLECULE]);
            this.timer.start ();
        } else {
            this.endGame ();
        }
    };

    GameScreen.prototype.endGame = function ( ) {
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
        //TextLoader.loadText ( 'res/models/aspirin.pdb', this.createMolecule.bind ( this ) );
        if (this.questionIterator.hasNext ( )) {
            this.scene.remove (this.currentQuestion[ this.MOLECULE ]);
            this.currentQuestion = this.questionIterator.next ( );
            this.scene.add (this.currentQuestion[ this.MOLECULE ]);
        } else {
            this.endGame ( );
        }
    };

    /*
    GameScreen.prototype.loadAssets = function ( data ) {
        var loadingString = 'Loading';
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
    */

    GameScreen.prototype.createPDB = function ( data ) {
        /* Pulls in PDB's for each question and builds them */
        this.loadingState++;
        if(this.loadingState < this.gameData.questions.length) {
            /* Update Loading Text */
            var loadingString = 'Loading';
            for (var i = 0; i < (this.loadingState / 2) % 3; ++i) {
                loadingString += '.';
            }
            $('#loadingMessage').html (loadingString);
            /* Build Molecule */
            var molecule = MoleculeGeometryBuilder.load (data);
            molecule.position = new THREE.Vector3 (-2.5, -1, 0);
            molecule.scale = new THREE.Vector3 (0.5, 0.5, 0.5);

            this.questionList.push ([molecule, this.gameData.questions[this.loadingState].answers ]);

            FCCommunicationManager.getMedia( this.gameData.game_session_id, 
                                             FCCommunicationManager.MEDIA_PDB, 
                                             this.gameData.questions[this.loadingState].id,
                                             this.createPDB.bind(this) ); 
        } else {
            enableButtons( this );
            $ ('#loadingMessage').html ('Ready');
            $ ('#loadingMessage').css ('padding-left', '0px');
            $ ('#loadingMessage').css ('text-align', 'center');
            $ ('#beginButton').fadeIn (500);
        }
    };

    GameScreen.prototype.receiveQuestionList = function ( data ) {
        /* Receives list of questions */
        this.gameData = data;
        this.loadingState = 0;
        /* Assumes at least 1 question */
        FCCommunicationManager.getMedia( this.gameData.game_session_id, 
                                         FCCommunicationManager.MEDIA_PDB, 
                                         this.gameData.questions[this.loadingState].id,
                                         this.createPDB.bind(this) );
    };

    GameScreen.prototype.getSecondsLeft = function () {
        var time = this.GAME_LENGTH - this.timer.getElapsedSec ();

        if (time > 0) {
            return time;
        }
        return 0;
    };

    GameScreen.prototype.answerQuestion = function (userAnswer) {
        if (this.currentQuestion [ this.ANSWER ] === userAnswer || true) {
            this.scoreManager.correct (this.RIGHT_ANSWER_POINTS);
            $ ('#scoreChange').html (this.scoreManager.text ());
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
                    this.wrongAnswers = new Map ( );
                    this.nextQuestion ( );
                }
            }
        }
    };
    
    GameScreen.prototype.nextQuestion = function () {
        if (this.questionIterator.hasNext ()) {
            this.scene.remove (this.currentQuestion[ this.MOLECULE ]);
            this.currentQuestion = this.questionIterator.next ();
            this.scene.add (this.currentQuestion[ this.MOLECULE ]);
        } else {
            this.endGame ();
        }
    };

    /*
    GameScreen.prototype.buttonLogic = function (button) {
        switch (button) {
            case 'Option 1':
                this.answerPoll.push ('Option 1');

                break;

            case 'Option 2':
                this.answerPoll.push ('Option 2');

                break;

            case 'Option 3':
                this.answerPoll.push ('Option 3');
                break;

            case 'Option 4':
                this.answerPoll.push ('Option 4');
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
    */

    function enableButtons ( gameScreen ) {
        $('#gameUI .button[data-logic=\'return\']').on('click', function () {
            var screenChangeEvent = jQuery.Event('screenChange');
            screenChangeEvent.screenID = 'menu';
            gameScreen.$element.trigger(screenChangeEvent);
        });

        $('#gameUI .button[data-logic=\'1\']').on('click', function () {
            gameScreen.answerQuestion( 1 );
        });

        $('#gameUI .button[data-logic=\'2\']').on('click', function () {
            gameScreen.answerQuestion( 2 );
        });

        $('#gameUI .button[data-logic=\'3\']').on('click', function () {
            gameScreen.answerQuestion( 3 );
        });

        $('#gameUI .button[data-logic=\'4\']').on('click', function () {
            gameScreen.answerQuestion( 4 );
        });

        $('#loadingUI .button[data-logic=\'begin\']').on('click', function () {
            $('#loadingUI .button').off('click');
            gameScreen.startGame( );
        });        
    }

    function disableButtons ( ) {
        $('#gameUI .button').off('click');
    }
    
    window.GameScreen = GameScreen;
}) ();