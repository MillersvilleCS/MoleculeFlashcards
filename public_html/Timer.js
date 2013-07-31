/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */



Timer = function ( )
{
    this.start ( );
};

Timer.date = new Date ( );

Timer.prototype =
{
    constructor: Timer,
            
    startTime: 0, 
    stopTime: 0,
    running: false,
    
    start: function ( )
    {
        this.running = true;
        this.startTime = Timer.date.getTime ( );
    },
    stop: function ( )
    {
        this.running = false;
        this.stopTime = Timer.date.getTime ( );
    },
    reset: function ( )
    {
        var time = Timer.date.getTime ( );
        this.startTime = time;
        this.stopTime = time;
    },
    getElapsedTimeMili: function ( )
    {
        if ( this.running )
            return Timer.date.getTime ( ) - this.startTime;
        else
            return this.stopTime - this.startTime;
    } 
};
