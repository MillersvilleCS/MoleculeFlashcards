/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


GameScreen = function ( )
{
    this.m_scene = new THREE.Scene ( );
    
    return this;
};

GameScreen.prototype =
{
    constructor: GameScreen,
            
    m_scene: undefined, molMesh: undefined,
    
    
    init: function ( )
    {
        var extractor = new MoleculeGeometryExtractor ();
        var geometry = new THREE.CubeGeometry( 1, 1, 1 );
        var material = new THREE.MeshBasicMaterial( {color: 0xCC0000} );
        var cube = new THREE.Mesh( geometry, material );
        var molStr = 
        'HETATM    1  C                  -3.450  -0.135   0.363 \n' +
        'HETATM    2  C                  -2.116  -0.033  -0.019 \n' +
        'HETATM    3  C                  -1.805   0.087  -1.347 \n' +
        'HETATM    4  C                  -2.806   0.106  -2.304 \n' +
        'HETATM    5  C                  -4.116   0.005  -1.917 \n' +
        'HETATM    6  C                  -4.463  -0.118  -0.575 \n' +
        'HETATM    7  I                  -3.911  -0.321   2.435 \n' +
        'HETATM    8  H                  -1.346  -0.049   0.721 \n' +
        'HETATM    9  O                  -0.495   0.197  -1.832 \n' +
        'HETATM   10  H                  -2.532   0.201  -3.333 \n' +
        'HETATM   11  H                  -4.910   0.017  -2.633 \n' +
        'HETATM   12  O                  -5.799  -0.212  -0.300 \n' +
        'HETATM   13  C                   0.605   0.190  -1.001 \n' +
        'HETATM   14  C                   2.873   0.179   0.629 \n' +
        'HETATM   15  C                   2.242   1.367   0.305 \n' +
        'HETATM   16  C                   1.117   1.375  -0.504 \n' +
        'HETATM   17  C                   1.244  -1.002  -0.684 \n' +
        'HETATM   18  C                   2.366  -1.011   0.121 \n' +
        'HETATM   19  C                   4.099   0.189   1.522 \n' +
        'HETATM   20  H                   2.619   2.294   0.684 \n' +
        'HETATM   21  I                   0.214   3.227  -1.019 \n' +
        'HETATM   22  I                   0.527  -2.833  -1.490 \n' +
        'HETATM   23  H                   2.873  -1.924   0.340 \n' +
        'HETATM   24  H                  -6.001  -0.299   0.639 \n' +
        'HETATM   25  H                   3.926  -0.412   2.407 \n' +
        'HETATM   26  H                   4.290   1.203   1.851 \n' +
        'HETATM   27  C                   5.361  -0.378   0.815 \n' +
        'HETATM   28  C                   6.589   0.047   1.611 \n' +
        'HETATM   29  H                   5.421   0.038  -0.183 \n' +
        'HETATM   30  N                   5.273  -1.832   0.729 \n' +
        'HETATM   31  O                   6.865   1.378   1.588 \n' +
        'HETATM   32  O                   7.254  -0.704   2.264 \n' +
        'HETATM   33  H                   6.356   1.896   0.955 \n' +
        'HETATM   34  H                   5.561  -2.266   1.590 \n' +
        'HETATM   35  H                   5.779  -2.220  -0.046 \n' +
        'CONECT    1    2    6    7 \n' +
        'CONECT    2    1    3    8 \n' +
        'CONECT    3    2    4    9 \n' +
        'CONECT    4    3    5   10 \n' +
        'CONECT    5    4    6   11 \n' +
        'CONECT    6    1    5   12 \n' +
        'CONECT    7    1 \n' +
        'CONECT    8    2 \n' +
        'CONECT    9    3   13 \n' +
        'CONECT   10    4 \n' +
        'CONECT   11    5 \n' +
        'CONECT   12    6   24 \n' +
        'CONECT   13    9   16   17 \n' +
        'CONECT   14   15   18   19 \n' +
        'CONECT   15   14   16   20 \n' +
        'CONECT   16   13   15   21 \n' +
        'CONECT   17   13   18   22 \n' +
        'CONECT   18   14   17   23 \n' +
        'CONECT   19   14   25   26   27 \n' +
        'CONECT   20   15 \n' +
        'CONECT   21   16 \n' +
        'CONECT   22   17 \n' +
        'CONECT   23   18 \n' +
        'CONECT   24   12 \n' +
        'CONECT   25   19 \n' +
        'CONECT   26   19 \n' +
        'CONECT   27   19   28   29   30 \n' +
        'CONECT   28   27   31   32 \n' +
        'CONECT   29   27 \n' +
        'CONECT   30   27   34   35 \n' +
        'CONECT   31   28   33 \n' +
        'CONECT   32   28 \n' +
        'CONECT   33   31 \n' +
        'CONECT   34   30 \n' +
        'CONECT   35   30 \n' +
        'END';
        this.molMesh = extractor.load(molStr);
        this.molMesh.scale.x = .25;
        this.molMesh.scale.y = .25;
        this.molMesh.scale.z = .25;
        this.m_scene.add ( this.molMesh );
        
        //this.m_scene.add ( cube );//temp for location reference
        
        var pointLight = new THREE.PointLight( 0xFFFFFF );

    	// set its position
    	pointLight.position.x = 0;
    	pointLight.position.y = 0;
    	pointLight.position.z = 130;

    	// add to the scene
    	this.m_scene.add(pointLight);

    },
            
    update: function ( delta )
    {
        if ( MouseManager.leftButton.isPressed )
        {
           this.molMesh.rotation.x += (MouseManager.currentX - MouseManager.leftButton.pressedX) / 1000;
            //this.molMesh.rotation.z += (MouseManager.currentY - MouseManager.leftButton.pressedY) / 1000;
        }
    },
    
    pause: function ( )
    {
        
    },
            
    onLeave: function ( )
    {
        
    },
            
    onResume: function ( )
    {
        
    },
    
    getScene: function ( )
    {
        return this.m_scene;
    }
};
