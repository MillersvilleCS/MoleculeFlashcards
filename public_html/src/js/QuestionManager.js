
QuestionManager = function ( )
{
    
};

QuestionManager.prototype = {
    constructor: QuestionManager,
    questions: new List ( ),
    
    add: function ( molecule, answer )
    {
        this.questions.add ( new Pair ( molecule, answer ) );
    },
    
    numberOfQuestions: function ( )
    {
        return this.questions.size;
    },
    getIterator: function ( )
    {
        return this.questions.getIterator ( );
    }
};
