ScoreManager = function ( )
{

};

ScoreManager.prototype = {
    constructor: ScoreManager,
    score: 0,
    streak: 0,
    multiplier: 1,

    correct: function ( addition )
    {
        this.score += addition;

        ++this.streak;
        if ( this.streak == 3 )
        {
            this.multiplier = 2;
        }
        if ( this.streak == 6 )
        {
            this.multiplier = 3;
        }
    },

    incorrect: function ( deduction )
    {
        this.score += deduction;

        this.streak = 0;
        this.multiplier = 1;
    },

    getScore: function ( )
    {
        return this.score;
    },

    getStreak: function ( )
    {
        return this.streak;
    },

    getMultiplier: function ( )
    {
        return this.multiplier;
    },

    text: function ( )
    {
        console.log(this.score);
        var response = this.score * this.multiplier;
        console.log(response);

        if ( this.score > 0 )
        {
            response = '+' + response;
        }

        if ( this.multiplier == 2 )
        {
            response += ' x2 COBMO';
        }
        else if ( this.multiplier == 3 )
        {
            response += ' x3 COMBO';
        }
        else
        {
            /* Nothing */
        }

        return response;
    }
};