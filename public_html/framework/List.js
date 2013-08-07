
List = function ( )
{
    
};

List.prototype = {
    constructor: List,
    size: 0,
    data: [],
    add: function ( element )
    {
        this.data [ this.size ] = element;
        ++this.size;
    },
            
    remove: function ( element )
    {
        var found = false;
        for ( var i = 0; i < this.size; ++i)
        {
            if ( found )
            {
                this.data  [i - 1] = this.data  [ i ];
            }
            else if ( this [ i ]  === element )
            {
                found = true;
                this.data  [ i ] = undefined;
                --this.size;
            }
        }
    },
            
    getIterator: function ( )
    {
        return new Iterator ( this.data );
    }
};