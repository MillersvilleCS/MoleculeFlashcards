
Map = function ( )
{
    this.size = 0;
};

Map.prototype = {
    constructor: Map,
    put: function ( key, value )
    {
        this[ key ] = value;
        ++this.size;
    },
    get: function ( key )
    {
        return this[ key ];
    },
    remove: function ( key )
    {
        delete this[ key ];
        --this.size;
    },
    contains: function ( key )
    {
        return this.hasOwnProperty ( key );
    },
    getSize: function ( )
    {
        return this.size;
    }
};
