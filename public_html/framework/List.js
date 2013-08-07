
List = function ( )
{
    
};

List.prototype = {
    constructor: List,
    size: 0,
    add: function ( element )
    {
        this [ size ] = element;
        ++this.size;
    },
            
    remove: function ( element )
    {
        var found = false;
        for ( var i = 0; i < this.size; ++i)
        {
            if ( found )
            {
                this [i - 1] = this [ i ];
            }
            if ( this [ i ]  === element )
            {
                found = true;
                this [ i ] = undefined;
                --this.size;
            }
        }
    },
            
    getIterator: function ( )
    {
        return new Iterator ( this );
    }
};