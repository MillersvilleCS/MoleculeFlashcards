
List = function ( )
{

};

List.prototype = {
    constructor: List,
    size: 0,
    data: [ ],
    add: function ( element )
    {
        this.data [ this.size ] = element;
        ++this.size;
    },
    remove: function ( element )
    {
        var index = this.data.indexOf ( element );
        this.data.splice ( index, 1 );
    },
    getIterator: function ( )
    {
        return new Iterator ( this.data );
    }
};