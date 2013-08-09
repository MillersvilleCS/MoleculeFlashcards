/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


MoleculeGeometryBuilder = function ( )
{
    'use strict';
};

/*@const*/
MoleculeGeometryBuilder.pdbloader = new PDBLoader ( );

MoleculeGeometryBuilder.load = function ( data )
{
    'use strict';
    var pdbJson = MoleculeGeometryBuilder.pdbloader.parsePDB ( data );
    return MoleculeGeometryBuilder.createModel ( pdbJson );
};

MoleculeGeometryBuilder.createModel = function ( json ) {
    'use strict';
    var model = new THREE.Object3D ( );

    var atoms = json.atoms;
    var bonds = json.bonds;
    var bondInfo = undefined;

    function createAtomsAsSpheres
            ( atoms, atomScale, quality, model )
    {
        bondInfo = new THREE.Geometry ( );
        var sphereGeometry = new THREE.SphereGeometry ( 1, quality, quality )
        for ( var i = 0; i < atoms.length; i++ )
        {

            var atom = atoms[ i ];

            //grab the atom's position
            var x = atom[ 0 ];
            var y = atom[ 1 ];
            var z = atom[ 2 ];
            var position = new THREE.Vector3 ( x, y, z );

            //grab the atom's color
            var r = atom[ 3 ][ 0 ] / 255;
            var g = atom[ 3 ][ 1 ] / 255;
            var b = atom[ 3 ][ 2 ] / 255;
            var color = new THREE.Color ();
            color.setRGB ( r, g, b );

            //grab the atom's radius
            var radius = atom[ 4 ];

            if ( radius === undefined )
            {
                radius = PDBLoader.atomRadii["default"];
            }
            radius *= atomScale;

            //create the atom
            var atomMaterial = new THREE.MeshLambertMaterial
                    ( {
                        color: color.getHex ( )
                    } );

            var atomMesh = new THREE.Mesh ( sphereGeometry.clone ( ), atomMaterial );
            atomMesh.scale.x *= radius ;
            atomMesh.scale.y *= radius ;
            atomMesh.scale.z *= radius ;
            atomMesh.position = position;
            model.add ( atomMesh );

            //get information needed by bonds
            bondInfo.vertices.push ( position );
            bondInfo.colors.push ( color );
        }
    }

    function createBondsAsLines ( bonds, lineWidth, model )
    {
        'use strict';
        var bondGeometry = new THREE.Geometry ( );
        for ( var i = 0; i < bonds.length; i++ )
        {
            var bond = bonds[ i ];

            var start = bond[ 0 ];
            var end = bond[ 1 ];


            var vertex1 = bondInfo.vertices[ start ];
            var vertex2 = bondInfo.vertices[ end ];

            var color1 = bondInfo.colors[ start ];
            var color2 = bondInfo.colors[ end ];

            bondGeometry.vertices.push ( vertex1.clone () );
            bondGeometry.vertices.push ( vertex2.clone () );

            bondGeometry.colors.push ( color1.clone () );
            bondGeometry.colors.push ( color2.clone () );

        }

        //create the lines and add them to the model
        var lineMaterial = new THREE.LineBasicMaterial ( {
            linewidth: lineWidth
        } );
        lineMaterial.vertexColors = true;

        var lineMesh = new THREE.Line ( bondGeometry, lineMaterial );
        lineMesh.type = THREE.LinePieces;

        model.add ( lineMesh );
    }

    createAtomsAsSpheres ( atoms, 0.25, 16, model );
    createBondsAsLines ( bonds, 10, model );

    return model;
};