(function () {
    'use strict'; /* Only need to 'use strict' once in new system*/

    var GameScreen = function ($element) {
        Screen.apply (this, [$element]);
        //constants
        this.QUESTION_MOLECULE = 0;
        this.QUESTION_TEXT = 1;
        this.QUESTION_ID = 2;
        this.QUESTION_ANSWERS = 3;
        this.WRONG_ANSWER_POINTS = -350;
        this.RIGHT_ANSWER_POINTS = 1000;
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
        this.loadingState = -1;
        this.questionList = [];
        this.currentQuestion = undefined;
        this.questionIterator = undefined;
        this.userAnswers = new Map ( );

        var pointLight = new THREE.PointLight (0xFFFFFF);
        pointLight.position.set (0, 0, 130);
        this.scene.add (pointLight);

        //this.scene.add ( new THREE.Mesh( new THREE.CubeGeometry( 200, 200, 200 ), new THREE.MeshNormalMaterial() ) );
    };

    var BUTTON_HTML = '<div ' +
                            'class = \'button\'' +
                            'data-logic = \'$id\'>' +
                            '$text' +
                        '</div>'

    GameScreen.prototype = Object.create (Screen.prototype);
    GameScreen.prototype.constructor = GameScreen;

    GameScreen.prototype.onUpdate = function (delta) {
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
            this.currentQuestion[this.QUESTION_MOLECULE].rotation.z -=
                    (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;

            this.currentQuestion[this.QUESTION_MOLECULE].rotation.x +=
                    (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
        }
    };

    GameScreen.prototype.onPause = function ( ) {

    };

    GameScreen.prototype.onLeave = function ( ) {

    };

    GameScreen.prototype.onLeave = function ( ) {
        disableReturnButton( );
        $ ('#gameCompletedUI').fadeOut (500);
        $ ('#rightPanel').fadeOut (500);
        $ ('#gameCompletedReturnButton').fadeOut (500);
        $ ('#time').css ('color', '#F8F8FE');
        $ ('#time').html ('2:00');
        $ ('#score').html ('0');

        this.scoreManager.reset ( );
    };

    GameScreen.prototype.onResume = function ( ) {
        //start the loading screen
        $ ('#loadingUI').fadeIn (500);
        $ ('#rightPanel').fadeIn (500);

        this.timer.reset ( );
        this.questionList = [];
        this.loadingState = 0;

        /* TextLoader.loadText (this.modelList[0],
                this.loadAssets.bind (this)); */
        FCCommunicationManager.loadFlashcardGame( UserData.auth, UserData.gameID, this.receiveQuestionList.bind(this) );
    };

    GameScreen.prototype.startGame = function ( ) {
        $ ('#beginButton').fadeOut (500);
        $ ('#loadingUI').fadeOut (1);
        $ ('canvas').fadeIn (500);

        this.questionIterator = new Iterator (this.questionList);
        if (this.questionIterator.hasNext ()) {
            this.currentQuestion = this.questionIterator.next ( );
            this.scene.add (this.currentQuestion [this.QUESTION_MOLECULE]);
            this.setButtons ( );
            this.timer.start ( );
        } else {
            this.endGame ();
        }
    };

    GameScreen.prototype.endGame = function ( ) {
        disableButtons( );
        this.scene.remove (this.currentQuestion[ this.QUESTION_MOLECULE ]);
        this.currentQuestion = undefined;
        this.timer.stop ( );
        $('#scoreChange').stop (true, true);
        $('#scoreChange').animate ({
            opacity: 0
        },
        300);
        FCCommunicationManager.endFlashcardGame( UserData.auth, 
                                                 this.gameData.game_session_id, 
                                                 120,//temp! 
                                                 this.allowExit.bind(this) );
    };

    GameScreen.prototype.allowExit = function ( response ) {
        //console.log(response);
        $('#gameCompletedUI').fadeIn (500);
        $('#gameCompletedReturnButton').fadeIn (500);
    };

    GameScreen.prototype.insertInfo = function ( keys, values, base, location ) {
        /* Should be it's own class? Also used in MenuScreen */
        var workingHTML = base;
        for(var i = 0; i < keys.length; ++i) {
            workingHTML = workingHTML.replace( keys[i], values[i] );
        }

        $( location ).append( workingHTML );
    };

    GameScreen.prototype.nextQuestion = function ( ) {
        //TextLoader.loadText ( 'res/models/aspirin.pdb', this.createMolecule.bind ( this ) );
        this.userAnswers = new Map ( );
        if (this.questionIterator.hasNext ( )) {
            this.scene.remove (this.currentQuestion[ this.QUESTION_MOLECULE ]);
            this.currentQuestion = this.questionIterator.next ( );
            this.scene.add (this.currentQuestion[ this.QUESTION_MOLECULE ]);
            this.setButtons( );
        } else {
            this.endGame ( );
        }
    };

    GameScreen.prototype.setButtons = function ( ) {
        $('#gameButtons').html('');
        for(var i = 0; i < this.currentQuestion[this.QUESTION_ANSWERS].length; ++i) {
            var keys = [
                '$id',
                '$text'
            ];
            var values = [
                this.currentQuestion[this.QUESTION_ANSWERS][i].id,
                this.currentQuestion[this.QUESTION_ANSWERS][i].text
            ];
            this.insertInfo( keys, values, BUTTON_HTML, '#gameButtons' );
        }
    };

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

            this.questionList.push ([ molecule, 
                                      this.gameData.questions[this.loadingState].text,
                                      this.gameData.questions[this.loadingState].id,
                                      this.gameData.questions[this.loadingState].answers ]);

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
        this.loadingState = -1;
        /* Assumes at least 1 question */
        FCCommunicationManager.getMedia( this.gameData.game_session_id, 
                                         FCCommunicationManager.MEDIA_PDB, 
                                         this.gameData.questions[this.loadingState + 1].id,
                                         this.createPDB.bind(this) );
    };

    GameScreen.prototype.getSecondsLeft = function () {
        var time = this.GAME_LENGTH - this.timer.getElapsedSec ();

        if (time > 0) {
            return time;
        }
        return 0;
    };

    GameScreen.prototype.answerQuestion = function ( data ) {
        if ( data.correct == 'true' ) {
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
            this.nextQuestion ();
        } else {
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

    GameScreen.prototype.pollAnswer = function ( userAnswer, currentQuestion ) {
        FCCommunicationManager.submitFlashcardAnswer( 
                                    UserData.auth, 
                                    this.gameData.game_session_id, 
                                    this.currentQuestion[this.QUESTION_ID],
                                    userAnswer, 
                                    60, //temp
                                    this.answerQuestion.bind(this) );
    };

    function enableButtons ( gameScreen ) {
        $('#gameUI .button[data-logic=\'return\']').on('click', function () {
            var screenChangeEvent = jQuery.Event('screenChange');
            screenChangeEvent.screenID = 'menu';
            gameScreen.$element.trigger(screenChangeEvent);
        });

        $('#gameButtons').on('click', '.button[data-logic]', function () {
            var answer = $(this).data('logic');
            if( !gameScreen.userAnswers.contains ( answer ) ) {
                gameScreen.pollAnswer( answer );
                gameScreen.userAnswers.put( answer );
            }
        });

        $('#loadingUI .button[data-logic=\'begin\']').on('click', function () {
            $('#loadingUI .button').off('click');
            gameScreen.startGame( );
        });        
    }

    function disableButtons ( ) {
        $('#gameButtons').off('click');
        $('#loadingUI .button').off('click');
    }

    function disableReturnButton ( ) {
        $('#gameUI .button').off('click');
    }
    
    window.GameScreen = GameScreen;
}) ();