/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Screen = function ( )
{
    this.scene = new THREE.Scene ( );
};

Screen.prototype =
{
    constructor: Screen,
            
    onUpdate: function ( delta )
    {
        throw new UnimplementedFunctionException ( "onUpdate" );
    },

    onPause: function ( )
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