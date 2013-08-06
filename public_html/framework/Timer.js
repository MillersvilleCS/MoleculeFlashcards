
Timer = function ( )
{
    this.startTime = 0,
    this.stopTime =  0,
    this.running =   false;
};

Timer.prototype = {
    constructor: Timer,

    start: function ( )
    {
        this.running = true;
        this.startTime = Date.now ( );
    },

    stop: function ( )
    {
        this.running = false;
        this.stopTime = Date.now ( );
    },

    reset: function ( )
    {
        var time = Date.now ( );
        this.startTime = time;
        this.stopTime = time;
    },

    getElapsedMs: function ( )
    {
        if ( this.running )
        {
<<<<<<< HEAD
            return Date.now ( ) - this.startTime;
=======
            return Date.now () - this.startTime;
>>>>>>> 4237afd73ad1da0455443b132a500cf3ade363e4
        }

        return this.stopTime - this.startTime;
    },

    getElapsedSec: function ( )
    {
        return Math.floor ( this.getElapsedMs ( ) / 1000 );
    }
};
