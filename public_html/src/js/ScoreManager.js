ScoreManager = function ( )
{
    this.questionTimer = new Timer ( );
    this.questionTimer.start ( );
};

ScoreManager.prototype = {
    constructor: ScoreManager,
    score: 0,
    streak: 0,
    multiplier: 1,
    change: 0,
    
    correct: function ( addition )
    {
        this.change = addition;

        ++this.streak;
        if ( this.streak === 3 )
        {
            this.multiplier = 2;
        }
        if ( this.streak === 6 )
        {
            this.multiplier = 3;
        }

        this.score += addition * this.multiplier;
        this.questionTimer.reset ( );
    },
    incorrect: function ( deduction )
    {
        this.change = deduction;
        this.score += deduction;

        this.streak = 0;
        this.multiplier = 1;
    },
    text: function( )
    {
        var response = this.change * this.multiplier;

        if ( this.change > 0 )
        {
            response = '+' + response;
        }

        if ( this.multiplier === 2 )
        {
            response += ' x2 COMBO';
        }
        else if ( this.multiplier === 3 )
        {
            response += ' x3 COMBO';
        }

        return response;
    },
    getTimeMSOnQuestion: function ( )
    {
        return this.questionTimer.getElapsedMs ( );
    }
};