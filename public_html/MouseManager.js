/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


MouseManager = function ( camera )
{
    
    return this;
};

MouseManager.prototype =
{
    constructor: MouseManager,
    
    m_camera: undefined,
    m_screen: undefined,
    
    init: function ( )
    {
        this.m_screen.init( ); 
        this.m_camera.position.z = 5;
    },
            
    update: function ( )
    {
        this.m_screen.update ( 0 );
    },
    getCamera: function ( )
    {
        return this.m_camera;
    },
            
    getCurrentScene: function ( )
    {
        return this.m_screen.getScene ( );
    }
    
    
};
