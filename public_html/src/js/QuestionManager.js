
QuestionManager = function ( )
{
    
};

QuestionManager.prototype = {
    constructor: QuestionManager,
    questions: new List ( ),
    
    addQuestion: function ( molecule, answer )
    {
        questions.add ( new Pair ( molecule, answer ) );
    }
};
