/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Screen = function ( )
{
    
};

Screen.prototype =
{
    constructor: Screen,
            
    update: function ( delta )
    {
        throw new UnimplementedFunctionException ( "update" );
    },

    pause: function ( )
    {
         throw new UnimplementedFunctionException ( "onPause" );
    },

    onLeave: function ( )
    {
         throw new UnimplementedFunctionException ( "onLeave" );
    },

    onResume: function ( )
    {
         throw new UnimplementedFunctionException ( "onResume" );
    }
};