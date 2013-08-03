/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var TV3 = THREE.Vector3, TF3 = THREE.Face3, TCo = THREE.Color;

MoleculeGeometryBuilder = function ( )
{
    this.Nucleotides = ['  G', '  A', '  T', '  C', '  U', ' DG', ' DA', ' DT', ' DC', ' DU'];
    this.ElementColors =
    {
        "H": 0xCCCCCC, "C": 0xAAAAAA, "O": 0xCC0000,
        "N": 0x0000CC, "S": 0xCCCC00, "P": 0x6622CC,
        "F": 0x00CC00, "CL": 0x00CC00, "BR": 0x882200,
        "I": 0x6600AA, "FE": 0xCC6600, "CA": 0x8888AA
    };

    this.vdwRadii =
    {
        "H": 1.2, "Li": 1.82, "Na": 2.27,
        "K": 2.75, "C": 1.7, "N": 1.55,
        "O": 1.52, "F": 1.47, "P": 1.80,
        "S": 1.80, "CL": 1.75, "BR": 1.85,
        "SE": 1.90, "ZN": 1.39, "CU": 1.4,
        "NI": 1.63
    };
};

MoleculeGeometryBuilder.prototype =
{
    constructor: MoleculeGeometryBuilder,

    load: function( source )
    {
        var sphereRadius = 0.5;//orig 1.5
        var forceDefaultRadius = false;
        var atomScale = 0.25;//had to be turned way down, underlying issue?
        var curveWidth = 3;
        var modelGroup = new THREE.Object3D();
        var protein = {sheet: [], helix: [], biomtChains: '', biomtMatrices: [], symMat: [], pdbID: '', title: ''};
        var atoms = [];

        this.parsePDB2( source, atoms, protein );
        if (!this.parseSDF ( source, atoms, protein )) this.parseXYZ( source, atoms, protein );
        
        var all = this.serializeAtoms ( atoms );
        var hetatm = this.removeSolvents ( this.getHetatms ( all, atoms ), atoms );
        
        this.colorByAtom ( all, {}, atoms );
        this.colorByChain ( all, {}, atoms );

        this.drawAtomsAsSphere ( modelGroup, hetatm, sphereRadius, forceDefaultRadius, atomScale, atoms );
        this.drawBondsAsLine ( modelGroup, all, curveWidth, atoms );
        //this.drawBondsAsStick ( modelGroup, all, sphereRadius / 6/* bond radius */, sphereRadius, true, true, atomScale, atoms);
        /* Problem with rotations, do not use. Documented further below in drawCylinder() */

        return modelGroup;
    },
            
    parseSDF: function ( str, atoms, protein )
    {
        var lines = str.split( "\n" );
        
        if ( lines.length < 4 )
        {
            return;
        }
        var atomCount = parseInt ( lines[3].substr ( 0, 3 ) );

        if ( isNaN(atomCount) || atomCount <= 0 )
        {
            return;
        }
        
        var bondCount = parseInt ( lines[3].substr ( 3, 3 ) );
        var offset = 4;

        if (lines.length < 4 + atomCount + bondCount)
        {
            return;
        }

        for ( var i = 1; i <= atomCount; i++ )
        {
            var line = lines[offset];
            offset++;
            var atom = {};
            atom.serial = i;
            atom.x = parseFloat(line.substr(0, 10));
            atom.y = parseFloat(line.substr(10, 10));
            atom.z = parseFloat(line.substr(20, 10));
            atom.hetflag = true;
            atom.atom = atom.elem = line.substr(31, 3).replace(/ /g, "");
            atom.bonds = [];
            atom.bondOrder = [];
            atoms[i] = atom;
        }

        for ( i = 1; i <= bondCount; i++ )
        {
            var line = lines[offset];
            offset++;
            var from = parseInt(line.substr(0, 3));
            var to = parseInt(line.substr(3, 3));
            var order = parseInt(line.substr(6, 3));
            atoms[from].bonds.push(to);
            atoms[from].bondOrder.push(order);
            atoms[to].bonds.push(from);
            atoms[to].bondOrder.push(order);
        }

        protein.smallMolecule = true;
        return true;
    },
    parseXYZ: function ( str, atoms, protein ) {

        var lines = str.split( "\n" );
        if ( lines.length < 3 )
            return;
        var atomCount = parseInt ( lines[0].substr ( 0, 3 ) );
        if (isNaN(atomCount) || atomCount <= 0)
            return;
        if (lines.length < atomCount + 2)
            return;
        var offset = 2;
        for (var i = 1; i <= atomCount; i++) {
            var line = lines[offset++];
            var tokens = line.replace(/^\s+/, "").replace(/\s+/g, " ").split(" ");
            console.log(tokens);
            var atom = {};
            atom.serial = i;
            atom.atom = atom.elem = tokens[0];
            atom.x = parseFloat(tokens[1]);
            atom.y = parseFloat(tokens[2]);
            atom.z = parseFloat(tokens[3]);
            atom.hetflag = true;
            atom.bonds = [];
            atom.bondOrder = [];
            atoms[i] = atom;
        }
        for (var i = 1; i < atomCount; i++) // hopefully XYZ is small enough
            for (var j = i + 1; j <= atomCount; j++)
                if (this.isConnected(atoms[i], atoms[j])) {
                    atoms[i].bonds.push(j);
                    atoms[i].bondOrder.push(1);
                    atoms[j].bonds.push(i);
                    atoms[j].bondOrder.push(1);
                }
        protein.smallMolecule = true;
        return true;
    },
    parsePDB2: function ( str, atoms, protein )
    {
        var lines = str.split("\n");
        for (var i = 0; i < lines.length; i++)
        {
            line = lines[i].replace(/^\s*/, ''); // remove indent
            var recordName = line.substr(0, 6);
            if (recordName === 'ATOM  ' || recordName === 'HETATM')
            {
                var atom, resn, chain, resi, x, y, z, hetflag, elem, serial, altLoc, b;
                altLoc = line.substr(16, 1);
                if (altLoc !== ' ' && altLoc !== 'A')
                    continue; // FIXME: ad hoc
                serial = parseInt(line.substr(6, 5));
                atom = line.substr(12, 4).replace(/ /g, "");
                resn = line.substr(17, 3);
                chain = line.substr(21, 1);
                resi = parseInt(line.substr(22, 5));
                x = parseFloat(line.substr(30, 8));
                y = parseFloat(line.substr(38, 8));
                z = parseFloat(line.substr(46, 8));
                b = parseFloat(line.substr(60, 8));
                elem = line.substr(76, 2).replace(/ /g, "");
                if (elem === '') // for some incorrect PDB files
                {
                    elem = line.substr(12, 4).replace(/ /g, "");
                }
                if (line[0] === 'H')
                {
                    hetflag = true;
                }
                else
                    hetflag = false;
                atoms[serial] = {'resn': resn, 'x': x, 'y': y, 'z': z, 'elem': elem,
                    'hetflag': hetflag, 'chain': chain, 'resi': resi, 'serial': serial, 'atom': atom,
                    'bonds': [], 'ss': 'c', 'color': 0xFFFFFF, 'bonds': [], 'bondOrder': [], 'b': b /*', altLoc': altLoc*/};
            } else if (recordName === 'SHEET ') {
                var startChain = line.substr(21, 1);
                var startResi = parseInt(line.substr(22, 4));
                var endChain = line.substr(32, 1);
                var endResi = parseInt(line.substr(33, 4));
                protein.sheet.push([startChain, startResi, endChain, endResi]);
            } else if (recordName === 'CONECT') {
                // MEMO: We don't have to parse SSBOND, LINK because both are also 
                // described in CONECT. But what about 2JYT???
                var from = parseInt(line.substr(6, 5));
                for (var j = 0; j < 4; j++) {
                    var to = parseInt(line.substr([11, 16, 21, 26][j], 5));
                    if (isNaN(to))
                        continue;
                    if (atoms[from] !== undefined) {
                        atoms[from].bonds.push(to);
                        atoms[from].bondOrder.push(1);
                    }
                }
            } else if (recordName === 'HELIX ') {
                var startChain = line.substr(19, 1);
                var startResi = parseInt(line.substr(21, 4));
                var endChain = line.substr(31, 1);
                var endResi = parseInt(line.substr(33, 4));
                protein.helix.push([startChain, startResi, endChain, endResi]);
            } else if (recordName === 'CRYST1') {
                protein.a = parseFloat(line.substr(6, 9));
                protein.b = parseFloat(line.substr(15, 9));
                protein.c = parseFloat(line.substr(24, 9));
                protein.alpha = parseFloat(line.substr(33, 7));
                protein.beta = parseFloat(line.substr(40, 7));
                protein.gamma = parseFloat(line.substr(47, 7));
                protein.spacegroup = line.substr(55, 11);
                this.defineCell();
            } else if (recordName === 'REMARK') {
                var type = parseInt(line.substr(7, 3));
                if (type === 290 && line.substr(13, 5) == 'SMTRY') {
                    var n = parseInt(line[18]) - 1;
                    var m = parseInt(line.substr(21, 2));
                    if (protein.symMat[m] === undefined)
                        protein.symMat[m] = new THREE.Matrix4().identity();
                    protein.symMat[m].elements[n] = parseFloat(line.substr(24, 9));
                    protein.symMat[m].elements[n + 4] = parseFloat(line.substr(34, 9));
                    protein.symMat[m].elements[n + 8] = parseFloat(line.substr(44, 9));
                    protein.symMat[m].elements[n + 12] = parseFloat(line.substr(54, 10));
                } else if (type === 350 && line.substr(13, 5) === 'BIOMT') {
                    var n = parseInt(line[18]) - 1;
                    var m = parseInt(line.substr(21, 2));
                    if (protein.biomtMatrices[m] === undefined)
                        protein.biomtMatrices[m] = new THREE.Matrix4().identity();
                    protein.biomtMatrices[m].elements[n] = parseFloat(line.substr(24, 9));
                    protein.biomtMatrices[m].elements[n + 4] = parseFloat(line.substr(34, 9));
                    protein.biomtMatrices[m].elements[n + 8] = parseFloat(line.substr(44, 9));
                    protein.biomtMatrices[m].elements[n + 12] = parseFloat(line.substr(54, 10));
                } else if (type === 350 && line.substr(11, 11) === 'BIOMOLECULE') {
                    protein.biomtMatrices = [];
                    protein.biomtChains = '';
                } else if (type === 350 && line.substr(34, 6) === 'CHAINS') {
                    protein.biomtChains += line.substr(41, 40);
                }
            } else if (recordName === 'HEADER') {
                protein.pdbID = line.substr(62, 4);
            } else if (recordName === 'TITLE ') {
                if (protein.title === undefined)
                    protein.title = "";
                protein.title += line.substr(10, 70) + "\n"; // CHECK: why 60 is not enough???
            } else if (recordName === 'COMPND') {
                // TODO: Implement me!
            }
        }

        // Assign secondary structures 
        for (i = 0; i < atoms.length; i++) {
            atom = atoms[i];
            if (atom === undefined)
                continue;

            var found = false;
            // MEMO: Can start chain and end chain differ?
            for (j = 0; j < protein.sheet.length; j++) {
                if (atom.chain !== protein.sheet[j][0])
                    continue;
                if (atom.resi < protein.sheet[j][1])
                    continue;
                if (atom.resi > protein.sheet[j][3])
                    continue;
                atom.ss = 's';
                if (atom.resi === protein.sheet[j][1])
                    atom.ssbegin = true;
                if (atom.resi === protein.sheet[j][3])
                    atom.ssend = true;
            }
            for (j = 0; j < protein.helix.length; j++) {
                if (atom.chain !== protein.helix[j][0])
                    continue;
                if (atom.resi < protein.helix[j][1])
                    continue;
                if (atom.resi > protein.helix[j][3])
                    continue;
                atom.ss = 'h';
                if (atom.resi === protein.helix[j][1])
                    atom.ssbegin = true;
                else if (atom.resi === protein.helix[j][3])
                    atom.ssend = true;
            }
        }
        protein.smallMolecule = false;
        return true;
    },
    serializeAtoms: function( atoms ) 
    {
        var ret = [];
        for ( var i in atoms ) 
        {
           ret.push( atoms[i].serial );
        }
        return ret;
    },
    getHetatms: function(atomlist, atoms) {
    var ret = [];
        for (var i in atomlist) {
           var atom = atoms[atomlist[i]]; if (atom == undefined) continue;

           if (atom.hetflag) ret.push(atom.serial);
        }
        return ret;
    },
    
    removeSolvents: function(atomlist, atoms) {
        var ret = [];
        for (var i in atomlist) {
           var atom = atoms[atomlist[i]]; if (atom == undefined) continue;

           if (atom.resn != 'HOH') ret.push(atom.serial);
        }
        return ret;
    },
    
   colorByAtom: function(atomlist, colors, atoms) {
        for (var i in atomlist) {
           var atom = atoms[atomlist[i]]; if (atom == undefined) continue;

           var c = colors[atom.elem];
           if (c == undefined) c = this.ElementColors[atom.elem];
           if (c == undefined) c = this.defaultColor;
           atom.color = c;
        }
    },
            
    colorByChain: function(atomlist, colorSidechains, atoms) 
    {
        for (var i in atomlist) {
           var atom = atoms[atomlist[i]]; if (atom == undefined) continue;

           if (atom.hetflag) continue;
           if (colorSidechains || atom.atom == 'CA' || atom.atom == 'O3\'') {
              var color = new TCo(0);
              color.setHSV((atom.chain.charCodeAt(0) * 5) % 17 / 17.0, 1, 0.9);
              atom.color = color.getHex();
           }
        }
    },
    
    drawAtomsAsSphere: function(group, atomlist, defaultRadius, forceDefault, scale, atoms) {
        var sphereQuality = 16;
        var sphereGeometry = new THREE.SphereGeometry(1, sphereQuality, sphereQuality); // r, seg, ring
        for (var i = 0; i < atomlist.length; i++) {
           var atom = atoms[atomlist[i]];
           if (atom == undefined) continue;

           var sphereMaterial = new THREE.MeshLambertMaterial({color: atom.color});
           var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
           group.add(sphere);
           var r = (!forceDefault && this.vdwRadii[atom.elem] != undefined) ? this.vdwRadii[atom.elem] : defaultRadius;
           if (!forceDefault && scale) r *= scale;
           sphere.scale.x = sphere.scale.y = sphere.scale.z = r;
           sphere.position.x = atom.x;
           sphere.position.y = atom.y;
           sphere.position.z = atom.z;
        }
     },

    drawBondsAsLineSub: function(geo, atom1, atom2, order) {
        var delta, tmp, vs = geo.vertices, cs = geo.colors;
        if (order > 1) delta = this.calcBondDelta(atom1, atom2, 0.15);
        var p1 = new TV3(atom1.x, atom1.y, atom1.z);
        var p2 = new TV3(atom2.x, atom2.y, atom2.z);
        var mp = p1.clone().add(p2).multiplyScalar(0.5);

        var c1 = new TCo(atom1.color), c2 = new TCo(atom2.color);
        if (order == 1 || order == 3) {
            vs.push(p1); cs.push(c1); vs.push(mp); cs.push(c1);
            vs.push(p2); cs.push(c2); vs.push(mp); cs.push(c2);
        }
        if (order > 1) {
            vs.push(p1.clone().addSelf(delta)); cs.push(c1);
            vs.push(tmp = mp.clone().addSelf(delta)); cs.push(c1);
            vs.push(p2.clone().addSelf(delta)); cs.push(c2);
            vs.push(tmp); cs.push(c2);
            vs.push(p1.clone().subSelf(delta)); cs.push(c1);
            vs.push(tmp = mp.clone().subSelf(delta)); cs.push(c1);
            vs.push(p2.clone().subSelf(delta)); cs.push(c2);
            vs.push(tmp); cs.push(c2);
        }
    },

    isConnected: function(atom1, atom2) {
        var s = atom1.bonds.indexOf(atom2.serial);
        if (s != -1) return atom1.bondOrder[s];

        if ((atom1.hetflag || atom2.hetflag)) return 0; // CHECK: or should I ? - this.protein.smallMolecule && 

        var distSquared = (atom1.x - atom2.x) * (atom1.x - atom2.x) + 
            (atom1.y - atom2.y) * (atom1.y - atom2.y) + 
            (atom1.z - atom2.z) * (atom1.z - atom2.z);

        //   if (atom1.altLoc != atom2.altLoc) return false;
        if (isNaN(distSquared)) return 0;
        if (distSquared < 0.5) return 0; // maybe duplicate position.

        if (distSquared > 1.3 && (atom1.elem == 'H' || atom2.elem == 'H' || atom1.elem == 'D' || atom2.elem == 'D')) return 0;
        if (distSquared < 3.42 && (atom1.elem == 'S' || atom2.elem == 'S')) return 1;
        if (distSquared > 2.78) return 0;
        return 1;
    },

    drawBondsAsLine: function(group, atomlist, lineWidth, atoms) {
        var geo = new THREE.Geometry();   
        var nAtoms = atomlist.length;

        for (var _i = 0; _i < nAtoms; _i++) {
            var i = atomlist[_i];
            var  atom1 = atoms[i];
            if (atom1 == undefined) continue;
            for (var _j = _i + 1; _j < _i + 30 && _j < nAtoms; _j++) {
                var j = atomlist[_j];
                var atom2 = atoms[j];
                if (atom2 == undefined) continue;
                var order = this.isConnected(atom1, atom2);
                if (order == 0) continue;

                this.drawBondsAsLineSub(geo, atom1, atom2, order);
            }
            for (var _j = 0; _j < atom1.bonds.length; _j++) {
                var j = atom1.bonds[_j];
                if (j < i + 30) continue; // be conservative!
                if (atomlist.indexOf(j) == -1) continue;
                var atom2 = atoms[j];
                if (atom2 == undefined) continue;
                this.drawBondsAsLineSub(geo, atom1, atom2, atom1.bondOrder[_j]);
            }
        }
        var lineMaterial = new THREE.LineBasicMaterial({linewidth: lineWidth});
        lineMaterial.vertexColors = true;

        var line = new THREE.Line(geo, lineMaterial);
        line.type = THREE.LinePieces;
        group.add(line);
    },

    drawCylinder: function(group, from, to, radius, color, cap) {
        if (!from || !to) return;

        var midpoint = new TV3().addVectors(from, to).multiplyScalar(0.5);
        var color = new TCo(color);

        if (!this.cylinderGeometry) {
            this.cylinderGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1, this.cylinderQuality, 1, !cap);//changed from size 1 - CM
            this.cylinderGeometry.faceUvs = [];
            this.faceVertexUvs = [];
        }
        var cylinderMaterial = new THREE.MeshLambertMaterial({color: color.getHex()});
        var cylinder = new THREE.Mesh(this.cylinderGeometry, cylinderMaterial);
        cylinder.position = midpoint;
        cylinder.lookAt(from);
        cylinder.updateMatrix();
        cylinder.matrixAutoUpdate = false;
        var m = new THREE.Matrix4().scale(radius, radius, from.distanceTo(to));
        m.makeRotationAxis(to, 2 * Math.PI);
        //m.makeRotationX(2 * Math.PI); 
        /* 
            was originally .rotateX, which is deprecated
            currently, makes bonds huge
            without this, they are flat
        */
        cylinder.matrix.multiply(m);
        group.add(cylinder);
    },

    drawBondAsStickSub: function(group, atom1, atom2, bondR, order) {
        var delta, tmp;
        if (order > 1) delta = this.calcBondDelta(atom1, atom2, bondR * 2.3);
        var p1 = new TV3(atom1.x, atom1.y, atom1.z);
        var p2 = new TV3(atom2.x, atom2.y, atom2.z);
        var mp = p1.clone().add(p2).multiplyScalar(0.5);

        var c1 = new TCo(atom1.color), c2 = new TCo(atom2.color);
        if (order == 1 || order == 3) {
            this.drawCylinder(group, p1, mp, bondR, atom1.color);
            this.drawCylinder(group, p2, mp, bondR, atom2.color);
        }
        if (order > 1) {
            tmp = mp.clone().add(delta);
            this.drawCylinder(group, p1.clone().add(delta), tmp, bondR, atom1.color);
            this.drawCylinder(group, p2.clone().add(delta), tmp, bondR, atom2.color);
            tmp = mp.clone().sub(delta);
            this.drawCylinder(group, p1.clone().sub(delta), tmp, bondR, atom1.color);
            this.drawCylinder(group, p2.clone().sub(delta), tmp, bondR, atom2.color);
        }
    },

    drawBondsAsStick: function(group, atomlist, bondR, atomR, ignoreNonbonded, multipleBonds, scale, atoms) {
        var sphereGeometry = new THREE.SphereGeometry(1, this.sphereQuality, this.sphereQuality);
        var nAtoms = atomlist.length, mp;
        var forSpheres = [];
        if (!!multipleBonds) bondR /= 2.5;
        for (var _i = 0; _i < nAtoms; _i++) {
            var i = atomlist[_i];
            var atom1 = atoms[i];
            if (atom1 == undefined) continue;
            for (var _j = _i + 1; _j < _i + 30 && _j < nAtoms; _j++) {
                var j = atomlist[_j];
                var atom2 = atoms[j];
                if (atom2 == undefined) continue;
                var order = this.isConnected(atom1, atom2);
                if (order == 0) continue;
                atom1.connected = atom2.connected = true;
                this.drawBondAsStickSub(group, atom1, atom2, bondR, (!!multipleBonds) ? order : 1);
            }
            for (var _j = 0; _j < atom1.bonds.length; _j++) {
                var j = atom1.bonds[_j];
                if (j < i + 30) continue; // be conservative!
                if (atomlist.indexOf(j) == -1) continue;
                var atom2 = this.atoms[j];
                if (atom2 == undefined) continue;
                atom1.connected = atom2.connected = true;
                this.drawBondAsStickSub(group, atom1, atom2, bondR, (!!multipleBonds) ? atom1.bondOrder[_j] : 1);
            }
            if (atom1.connected) forSpheres.push(i);
        }
        this.drawAtomsAsSphere(group, forSpheres, atomR, !scale, scale, atoms);
    }
};