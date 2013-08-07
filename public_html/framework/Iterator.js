
Iterator = function ( iterable )
{
    this.data = iterable;
};

Iterator.prototype = {
    constructor: Iterator,        
    index: 0,
    hasNext: function ( )
    {
        return this.index < this.data.length - 1;
    },
    current: function ( )
    {
        return this.data [ this.index ];
    },
    next: function ( )
    {
        ++this.index;
        return this.current ( );
    }
};