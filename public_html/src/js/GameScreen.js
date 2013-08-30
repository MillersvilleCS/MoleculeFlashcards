(function (window, $) {
    'use strict';

    var GameScreen = function ($element) {
        Screen.apply (this, [$element]);
        
        this.timer = new Timer ( );
        this.userAnswers = new Map ( );
        
        this.gameLength = 120;
       
        this.scoreManager = new ScoreManager ( );
        
        this.defaultHTML = $('#gameButtons').html();
        
        //variables redfined when the game starts
        this.loadingState = undefined;
        this.questionList = undefined;
        this.gameData = undefined;
        this.currentQuestion = undefined;
        this.questionIterator = undefined;
        
        //add light to the scene
        var pointLight = new THREE.PointLight (0xFFFFFF);
        pointLight.position.set (0, 0, 130);
        this.scene.add (pointLight);
        
        this.timer.start ( );
    };

    //constants
    var BUTTON_HTML = '<div ' +
                            'class = \'button\'' +
                            'data-logic = \'$id\'>' +
                            '$text' +
                      '</div>';
    var QUESTION_MOLECULE = 0;
    var QUESTION_TEXT = 1;
    var QUESTION_ID = 2;
    var QUESTION_ANSWERS = 3;
    var WRONG_ANSWER_POINTS = -350;
    var RIGHT_ANSWER_POINTS = 1000;

    GameScreen.prototype = Object.create (Screen.prototype);
    GameScreen.prototype.constructor = GameScreen;

    GameScreen.prototype.onUpdate = function (delta) {
        //update the this.timer
        if (this.getSecondsLeft () === 0) {
            this.endGame ( );
        }
        if (this.getSecondsLeft ( ) < 15) {
            $ ('#time').css ('color', 'red');
        }

        $ ('#time').html (Timer.getDigitalRep (this.getSecondsLeft ( )));
        $ ('#score').html (this.scoreManager.score);

        //update the molecule
        if (MouseManager.leftButton.isPressed && this.currentQuestion !== undefined) {
            this.currentQuestion[QUESTION_MOLECULE].rotation.z -=
                    (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;

            this.currentQuestion[QUESTION_MOLECULE].rotation.x +=
                    (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
        }
    };

    GameScreen.prototype.onPause = function ( ) {

    };

    GameScreen.prototype.onLeave = function ( ) {
        disableReturnButton( );
        $ ('#gameButtons').html(this.defaultHTML);
        $ ('#gameCompletedUI').fadeOut (500);
        $('#rightPanel').removeClass('in');
        $ ('#gameCompletedReturnButton').fadeOut (500);
        $ ('#time').css ('color', '#F8F8FE');
        $ ('#time').html ('2:00');
        $ ('#score').html ('0');

        this.scoreManager.reset ( );
    };

    GameScreen.prototype.onResume = function ( ) {
        function receiveQuestionList ( data ) {
            /* Receives list of questions */
            this.gameData = data;
            this.loadingState = -1;
            /* Assumes at least 1 question */
            FCCommunicationManager.getMedia(
                    this.gameData.game_session_id,
                    FCCommunicationManager.MEDIA_PDB,
                    this.gameData.questions[this.loadingState + 1].id,
                    this.createPDB.bind(this) );
        };
        
        $ ('#loadingUI').fadeIn (500);
        $('#rightPanel').addClass('in');

        this.timer.reset ( );
        this.questionList = [];
        this.loadingState = 0;

        FCCommunicationManager.loadFlashcardGame( UserData.auth, UserData.gameID, receiveQuestionList.bind(this) );
    };

    GameScreen.prototype.startGame = function ( ) {
        $ ('#beginButton').fadeOut (500);
        $ ('#loadingUI').fadeOut (1);
        $ ('canvas').fadeIn (500);

        this.gameLength = UserData.gameTimeLimit / 1000;
        this.questionIterator = new Iterator (this.questionList);
        this.nextQuestion ( );
    };

    GameScreen.prototype.endGame = function ( ) {
        function allowExit ( response ) {
            $('#finalScore').html('Final Score: ' + response.final_score);
            $('#rank').html('Rank: #' + response.rank);
            $('#gameCompletedUI').fadeIn (500);
            $('#gameCompletedReturnButton').fadeIn (500);
        };
        disableButtons( );
        this.scene.remove (this.currentQuestion[ QUESTION_MOLECULE ]);
        this.currentQuestion = undefined;
        this.timer.stop ( );
        $('#questionPanel').fadeOut( 300 );
        $('#scoreChange').stop (true, true);
        $('#scoreChange').animate ({
            opacity: 0
        },
        300);
        FCCommunicationManager.endFlashcardGame( UserData.auth,
                                                 this.gameData.game_session_id,
                                                 this.timer.getElapsedMs(),
                                                 allowExit.bind(this) );
    };

    GameScreen.prototype.nextQuestion = function ( ) {
        function insertInfo ( keys, values, base, location ) {
            /* Should be it's own class? Also used in MenuScreen */
            var workingHTML = base;
            for(var i = 0; i < keys.length; ++i) {
                workingHTML = workingHTML.replace( keys[i], values[i] );
            }

            $( location ).append( workingHTML );
        };
        
        function setQuestionText ( screen ) {
            if (screen.currentQuestion[QUESTION_TEXT] !== '') {
                $('#questionPanel').html(screen.currentQuestion[QUESTION_TEXT]);
                $('#questionPanel').fadeIn( 300 );
            } else {
                $('#questionPanel').html('');
                $('#questionPanel').fadeOut( 300 );
            }
        };
        
        function setButtons ( screen ) {
            $('#gameButtons').html('');
            for(var i = 0; i < screen.currentQuestion[QUESTION_ANSWERS].length; ++i) {
                var keys = ['$id', '$text'];
                var values = [
                    screen.currentQuestion[QUESTION_ANSWERS][i].id,
                    screen.currentQuestion[QUESTION_ANSWERS][i].text
                ];
                insertInfo( keys, values, BUTTON_HTML, '#gameButtons' );
            }
        };
        
        this.userAnswers = new Map ( );
        if (this.questionIterator.hasNext ( )) {
            if (this.questionIterator.index !== -1)
                this.scene.remove (this.currentQuestion[ QUESTION_MOLECULE ]);
            this.currentQuestion = this.questionIterator.next ( );
            this.scene.add (this.currentQuestion[ QUESTION_MOLECULE ]);
            setQuestionText( this );
            setButtons( this );
        } else {
            this.endGame ( );
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
            var molecule = MoleculeGeometryBuilder.load (data, 0.25, 5, 1, 0);
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

    

    GameScreen.prototype.getSecondsLeft = function () {
        var time = this.gameLength - this.timer.getElapsedSec ();

        if (time > 0) {
            return time;
        }
        return 0;
    };

    GameScreen.prototype.answerQuestion = function ( data ) {
        if ( data.correct === 'true' ) {
            this.scoreManager.correct (RIGHT_ANSWER_POINTS);
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
            this.scoreManager.incorrect (WRONG_ANSWER_POINTS);
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
                                    this.currentQuestion[QUESTION_ID],
                                    userAnswer,
                                    this.timer.getElapsedMs(),
                                    this.answerQuestion.bind(this) );
    };

    function enableButtons ( gameScreen ) {
        $('#gameUI .button[data-logic=\'return\']').on('click', function () {
            $(this).trigger(new ScreenChangeEvent('menu'));
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
}) (window, jQuery);