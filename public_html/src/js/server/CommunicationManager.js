CommunicationManager = function () {

};

CommunicationManager.REQUEST_HANDLER_URL = 'http://exscitech.gcl.cis.udel.edu/exscitech_sam/request_handler.php';
CommunicationManager.GAME_SESSION_URL = 'http://exscitech.gcl.cis.udel.edu/exscitech_sam/game_session.php';

CommunicationManager.parse = function ( text ) {
    try {
        return JSON.parse ( text );
    }
    catch (err) {
        var ret = {};
        ret.success = false;
        ret.error = 'JSON syntax error, invalid server response';
        return ret;
    }
}

CommunicationManager.post = function ( requestUrl, requestObject, callback ) {
    var response = $.ajax
            ({
                url: requestUrl,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'html',
                type: 'POST',
                data: JSON.stringify (requestObject),
                async: true
            }).done (
                function () {
                    callback (CommunicationManager.parse(response.responseText));
                }
            );
}

CommunicationManager.get = function ( requestUrl, requestObject, callback ) {
    var response = $.ajax
            ({
                url: requestUrl,
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'html',
                type: 'GET',
                data: JSON.stringify (requestObject),
                async: true
            }).done (
                function () {
                    callback (CommunicationManager.parse(response.responseText));
                }
            );
}

CommunicationManager.login = function ( email, password , callback) {
    email = email.toLowerCase ();
    var passwordHash = hex_md5 (password + email);

    var requestObject = {};
    requestObject.request_type = 'login';
    requestObject.email = email;
    requestObject.hash = passwordHash;

    CommunicationManager.post ( CommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
}

CommunicationManager.availableGames = function ( auth, callback ) {
    var requestObject = {};
    requestObject.request_type = 'get_avail_flashcard_games';
    requestObject.auth = auth;

    CommunicationManager.post ( CommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
}

CommunicationManager.loadFlashcardGame = function ( auth, callback ) {
    var requestObject = {};
    requestObject.request_type = 'load_flashcard_game';
    requestObject.auth = auth;

    CommunicationManager.post ( CommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
}

CommunicationManager.endFlashcardGame = function ( auth, gameSessionID, callback ) {
    var requestObject = {};
    requestObject.request_type = 'end_flashcard_game';
    requestObject.auth = auth;

    CommunicationManager.post ( CommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
}

CommunicationManager.submitFlashcardAnswer = function ( auth, gameSessionID, questionID, answer, gameTime, callback ) {
    var requestObject = {};
    requestObject.request_type = 'submit_flashcard_answer';
    requestObject.auth = auth;
    requestObject.game_session_id = gameSessionID;
    requestObject.question_id = questionID;
    requestObject.answer = answer;
    requestObject.game_time = gameTime;

    CommunicationManager.post ( CommunicationManager.REQUEST_HANDLER_URL, requestObject, callback );
}

CommunicationManager.getMedia = function ( gameSessionID, mediaType, questionID, callback ) {
    var requestObject = {};
    requestObject.request_type = 'get_media';
    requestObject.gsi = gameSessionID;
    requestObject.mt = mediaType;
    requestObject.qid = questionID;

    CommunicationManager.get ( CommunicationManager.GAME_SESSION_URL, requestObject, callback );
}