/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var TV3 = THREE.Vector3, TF3 = THREE.Face3, TCo = THREE.Color;

MoleculeGeometryExtractor = function()
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

MoleculeGeometryExtractor.prototype =
{
    constructor: MoleculeGeometryExtractor,
            
    material: new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 'blue'
      }),
    load: function( source )
    {
        var sphereRadius = 1.5;
        var curveWidth = 3;
        var modelGroup = new THREE.Object3D();
        var protein = {sheet: [], helix: [], biomtChains: '', biomtMatrices: [], symMat: [], pdbID: '', title: ''};
        var atoms = [];

        this.parsePDB2( source, atoms, protein );
        if (!this.parseSDF ( source, atoms, protein )) this.parseXYZ( source, atoms, protein );
        
        var all = this.serializeAtoms ( atoms );
        var hetatm = this.removeSolvents ( this.getHetatms ( all, atoms ), atoms );
        
        this.colorByAtom ( all, { }, atoms );
        this.colorByChain ( all,{}, atoms );

        this.drawAtomsAsSphere ( modelGroup, hetatm, sphereRadius, {},{} , atoms ); 
        this.drawMainchainCurve ( modelGroup, all, curveWidth, 'P', {}, {}, atoms );
        this.drawCartoon ( modelGroup, all, curveWidth, {}, atoms );
        
        return modelGroup;
    },
    parseSDF: function( str, atoms, protein )
    {
        var lines = str.split("\n");
        if (lines.length < 4)
        {
            return;
        }
        var atomCount = parseInt(lines[3].substr(0, 3));

        if (isNaN(atomCount) || atomCount <= 0)
        {
            return;
        }
        var bondCount = parseInt(lines[3].substr(3, 3));
        var offset = 4;

        if (lines.length < 4 + atomCount + bondCount)
        {
            return;
        }

        for (var i = 1; i <= atomCount; i++)
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

        for (i = 1; i <= bondCount; i++)
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
    parseXYZ: function(str, atoms, protein) {

        var lines = str.split("\n");
        if (lines.length < 3)
            return;
        var atomCount = parseInt(lines[0].substr(0, 3));
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
        var molID;

        var atoms_cnt = 0;
        var lines = str.split("\n");
        for (var i = 0; i < lines.length; i++)
        {
            line = lines[i].replace(/^\s*/, ''); // remove indent
            var recordName = line.substr(0, 6);
            if (recordName == 'ATOM  ' || recordName == 'HETATM')
            {
                var atom, resn, chain, resi, x, y, z, hetflag, elem, serial, altLoc, b;
                altLoc = line.substr(16, 1);
                if (altLoc != ' ' && altLoc != 'A')
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
                if (elem == '') // for some incorrect PDB files
                {
                    elem = line.substr(12, 4).replace(/ /g, "");
                }
                if (line[0] == 'H')
                {
                    hetflag = true;
                }
                else
                    hetflag = false;
                atoms[serial] = {'resn': resn, 'x': x, 'y': y, 'z': z, 'elem': elem,
                    'hetflag': hetflag, 'chain': chain, 'resi': resi, 'serial': serial, 'atom': atom,
                    'bonds': [], 'ss': 'c', 'color': 0xFFFFFF, 'bonds': [], 'bondOrder': [], 'b': b /*', altLoc': altLoc*/};
            } else if (recordName == 'SHEET ') {
                var startChain = line.substr(21, 1);
                var startResi = parseInt(line.substr(22, 4));
                var endChain = line.substr(32, 1);
                var endResi = parseInt(line.substr(33, 4));
                protein.sheet.push([startChain, startResi, endChain, endResi]);
            } else if (recordName == 'CONECT') {
                // MEMO: We don't have to parse SSBOND, LINK because both are also 
                // described in CONECT. But what about 2JYT???
                var from = parseInt(line.substr(6, 5));
                for (var j = 0; j < 4; j++) {
                    var to = parseInt(line.substr([11, 16, 21, 26][j], 5));
                    if (isNaN(to))
                        continue;
                    if (atoms[from] != undefined) {
                        atoms[from].bonds.push(to);
                        atoms[from].bondOrder.push(1);
                    }
                }
            } else if (recordName == 'HELIX ') {
                var startChain = line.substr(19, 1);
                var startResi = parseInt(line.substr(21, 4));
                var endChain = line.substr(31, 1);
                var endResi = parseInt(line.substr(33, 4));
                protein.helix.push([startChain, startResi, endChain, endResi]);
            } else if (recordName == 'CRYST1') {
                protein.a = parseFloat(line.substr(6, 9));
                protein.b = parseFloat(line.substr(15, 9));
                protein.c = parseFloat(line.substr(24, 9));
                protein.alpha = parseFloat(line.substr(33, 7));
                protein.beta = parseFloat(line.substr(40, 7));
                protein.gamma = parseFloat(line.substr(47, 7));
                protein.spacegroup = line.substr(55, 11);
                this.defineCell();
            } else if (recordName == 'REMARK') {
                var type = parseInt(line.substr(7, 3));
                if (type == 290 && line.substr(13, 5) == 'SMTRY') {
                    var n = parseInt(line[18]) - 1;
                    var m = parseInt(line.substr(21, 2));
                    if (protein.symMat[m] == undefined)
                        protein.symMat[m] = new THREE.Matrix4().identity();
                    protein.symMat[m].elements[n] = parseFloat(line.substr(24, 9));
                    protein.symMat[m].elements[n + 4] = parseFloat(line.substr(34, 9));
                    protein.symMat[m].elements[n + 8] = parseFloat(line.substr(44, 9));
                    protein.symMat[m].elements[n + 12] = parseFloat(line.substr(54, 10));
                } else if (type == 350 && line.substr(13, 5) == 'BIOMT') {
                    var n = parseInt(line[18]) - 1;
                    var m = parseInt(line.substr(21, 2));
                    if (protein.biomtMatrices[m] == undefined)
                        protein.biomtMatrices[m] = new THREE.Matrix4().identity();
                    protein.biomtMatrices[m].elements[n] = parseFloat(line.substr(24, 9));
                    protein.biomtMatrices[m].elements[n + 4] = parseFloat(line.substr(34, 9));
                    protein.biomtMatrices[m].elements[n + 8] = parseFloat(line.substr(44, 9));
                    protein.biomtMatrices[m].elements[n + 12] = parseFloat(line.substr(54, 10));
                } else if (type == 350 && line.substr(11, 11) == 'BIOMOLECULE') {
                    protein.biomtMatrices = [];
                    protein.biomtChains = '';
                } else if (type == 350 && line.substr(34, 6) == 'CHAINS') {
                    protein.biomtChains += line.substr(41, 40);
                }
            } else if (recordName == 'HEADER') {
                protein.pdbID = line.substr(62, 4);
            } else if (recordName == 'TITLE ') {
                if (protein.title == undefined)
                    protein.title = "";
                protein.title += line.substr(10, 70) + "\n"; // CHECK: why 60 is not enough???
            } else if (recordName == 'COMPND') {
                // TODO: Implement me!
            }
        }

        // Assign secondary structures 
        for (i = 0; i < atoms.length; i++) {
            atom = atoms[i];
            if (atom == undefined)
                continue;

            var found = false;
            // MEMO: Can start chain and end chain differ?
            for (j = 0; j < protein.sheet.length; j++) {
                if (atom.chain != protein.sheet[j][0])
                    continue;
                if (atom.resi < protein.sheet[j][1])
                    continue;
                if (atom.resi > protein.sheet[j][3])
                    continue;
                atom.ss = 's';
                if (atom.resi == protein.sheet[j][1])
                    atom.ssbegin = true;
                if (atom.resi == protein.sheet[j][3])
                    atom.ssend = true;
            }
            for (j = 0; j < protein.helix.length; j++) {
                if (atom.chain != protein.helix[j][0])
                    continue;
                if (atom.resi < protein.helix[j][1])
                    continue;
                if (atom.resi > protein.helix[j][3])
                    continue;
                atom.ss = 'h';
                if (atom.resi == protein.helix[j][1])
                    atom.ssbegin = true;
                else if (atom.resi == protein.helix[j][3])
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
     
     drawMainchainCurve: function(group, atomlist, curveWidth, atomName, div, atoms) {
        var points = [], colors = [];
        var currentChain, currentResi;
        if (div == undefined) div = 5;

        for (var i in atomlist) {
           var atom = atoms[atomlist[i]];
           if (atom == undefined) continue;

           if ((atom.atom == atomName) && !atom.hetflag) {
              if (currentChain != atom.chain || currentResi + 1 != atom.resi) {
                 this.drawSmoothCurve(group, points, curveWidth, colors, div);
                 points = [];
                 colors = [];
              }
              points.push(new TV3(atom.x, atom.y, atom.z));
              colors.push(atom.color);
              currentChain = atom.chain;
              currentResi = atom.resi;
           }
        }
         this.drawSmoothCurve(group, points, curveWidth, colors, div);
     },
     drawSmoothCurve: function(group, _points, width, colors, div) {
        if (_points.length == 0) return;

        div = (div == undefined) ? 5 : div;

        var geo = new THREE.Geometry();
        var points = this.subdivide(_points, div);

        for (var i = 0; i < points.length; i++) {
           geo.vertices.push(points[i]);
           geo.colors.push(new THREE.Color(colors[(i == 0) ? 0 : Math.round((i - 1) / div)]));
       }
       var lineMaterial = new THREE.LineBasicMaterial({linewidth: width});
       lineMaterial.vertexColors = true;
       var line = new THREE.Line(geo, lineMaterial);
       line.type = THREE.LineStrip;
       group.add(line);
     },
     drawCartoon: function(group, atomlist, doNotSmoothen, thickness, atoms) {
        this.drawStrand(group, atomlist, 2, undefined, true, undefined, undefined, doNotSmoothen, thickness, atoms);
    },
    
    drawStrand: function(group, atomlist, num, div, fill, coilWidth, helixSheetWidth, doNotSmoothen, thickness, atoms) {
        var strandDIV = 6;
        var axisDIV = 5;
        var helixSheetWidth = 1.3;
        var coilWidth = 0.3;
        num = num || strandDIV;
        div = div || axisDIV;
        coilWidth = coilWidth || coilWidth;
        doNotSmoothen == (doNotSmoothen == undefined) ? false : doNotSmoothen;
        helixSheetWidth = helixSheetWidth || helixSheetWidth;
        var points = []; for (var k = 0; k < num; k++) points[k] = [];
        var colors = [];
        var currentChain, currentResi, currentCA;
        var prevCO = null, ss=null, ssborder = false;

        for (var i in atomlist) {
           var atom = atoms[atomlist[i]];
           if (atom == undefined) continue;

           if ((atom.atom == 'O' || atom.atom == 'CA') && !atom.hetflag) {
              if (atom.atom == 'CA') {
                 if (currentChain != atom.chain || currentResi + 1 != atom.resi) {
                    for (var j = 0; !thickness && j < num; j++)
                       this.drawSmoothCurve(group, points[j], 1 ,colors, div);
                    if (fill) this.drawStrip(group, points[0], points[num - 1], colors, div, thickness);
                    var points = []; for (var k = 0; k < num; k++) points[k] = [];
                    colors = [];
                    prevCO = null; ss = null; ssborder = false;
                 }
                 currentCA = new TV3(atom.x, atom.y, atom.z);
                 currentChain = atom.chain;
                 currentResi = atom.resi;
                 ss = atom.ss; ssborder = atom.ssstart || atom.ssend;
                 colors.push(atom.color);
              } else { // O
                 var O = new TV3(atom.x, atom.y, atom.z);
                 O.subSelf(currentCA);
                 O.normalize(); // can be omitted for performance
                 O.multiplyScalar((ss == 'c') ? coilWidth : helixSheetWidth); 
                 if (prevCO != undefined && O.dot(prevCO) < 0) O.negate();
                 prevCO = O;
                 for (var j = 0; j < num; j++) {
                    var delta = -1 + 2 / (num - 1) * j;
                    var v = new TV3(currentCA.x + prevCO.x * delta, 
                                    currentCA.y + prevCO.y * delta, currentCA.z + prevCO.z * delta);
                    if (!doNotSmoothen && ss == 's') v.smoothen = true;
                    points[j].push(v);
                 }                         
              }
           }
        }
        for (var j = 0; !thickness && j < num; j++)
           this.drawSmoothCurve(group, points[j], 1 ,colors, div);
        if (fill) this.drawStrip(group, points[0], points[num - 1], colors, div, thickness);
     },
    drawStrip: function(group, p1, p2, colors, div, thickness) {
        var axisDIV = 5;
        if ((p1.length) < 2) return;
        div = div || this.axisDIV;
        p1 = this.subdivide(p1, div);
        p2 = this.subdivide(p2, div);
        if (!thickness) return this.drawThinStrip(group, p1, p2, colors, div);

        var geo = new THREE.Geometry();
        var vs = geo.vertices, fs = geo.faces;
        var axis, p1v, p2v, a1v, a2v;
        for (var i = 0, lim = p1.length; i < lim; i++) {
           vs.push(p1v = p1[i]); // 0
           vs.push(p1v); // 1
           vs.push(p2v = p2[i]); // 2
           vs.push(p2v); // 3
           if (i < lim - 1) {
              var toNext = p1[i + 1].clone().subSelf(p1[i]);
              var toSide = p2[i].clone().subSelf(p1[i]);
              axis = toSide.crossSelf(toNext).normalize().multiplyScalar(thickness);
           }
           vs.push(a1v = p1[i].clone().addSelf(axis)); // 4
           vs.push(a1v); // 5
           vs.push(a2v = p2[i].clone().addSelf(axis)); // 6
           vs.push(a2v); // 7
        }
        var faces = [[0, 2, -6, -8], [-4, -2, 6, 4], [7, 3, -5, -1], [-3, -7, 1, 5]];
        for (var i = 1, lim = p1.length; i < lim; i++) {
           var offset = 8 * i, color = new TCo(colors[Math.round((i - 1)/ div)]);
           for (var j = 0; j < 4; j++) {
              var f = new THREE.Face4(offset + faces[j][0], offset + faces[j][1], offset + faces[j][2], offset + faces[j][3], undefined, color);
              fs.push(f);
           }
        }
        var vsize = vs.length - 8; // Cap
        for (var i = 0; i < 4; i++) {vs.push(vs[i * 2]); vs.push(vs[vsize + i * 2])};
        vsize += 8;
        fs.push(new THREE.Face4(vsize, vsize + 2, vsize + 6, vsize + 4, undefined, fs[0].color));
        fs.push(new THREE.Face4(vsize + 1, vsize + 5, vsize + 7, vsize + 3, undefined, fs[fs.length - 3].color));
        geo.computeFaceNormals();
        geo.computeVertexNormals(false);
       // var material =  new THREE.MeshLambertMaterial();
       // material.vertexColors = THREE.FaceColors;
        var mesh = new THREE.Mesh(geo, this.material);
        mesh.doubleSided = true;
        group.add(mesh);
     },
     subdivide: function(_points, DIV) { // points as Vector3
        var ret = [];
        var points = _points;
        points = new Array(); // Smoothing test
        points.push(_points[0]);
        for (var i = 1, lim = _points.length - 1; i < lim; i++) {
           var p1 = _points[i], p2 = _points[i + 1];
           if (p1.smoothen) points.push(new TV3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2));
           else points.push(p1);
        }
        points.push(_points[_points.length - 1]);

        for (var i = -1, size = points.length; i <= size - 3; i++) {
           var p0 = points[(i == -1) ? 0 : i];
           var p1 = points[i + 1], p2 = points[i + 2];
           var p3 = points[(i == size - 3) ? size - 1 : i + 3];
           var v0 = new TV3().sub(p2, p0).multiplyScalar(0.5);
           var v1 = new TV3().sub(p3, p1).multiplyScalar(0.5);
           for (var j = 0; j < DIV; j++) {
              var t = 1.0 / DIV * j;
              var x = p1.x + t * v0.x 
                       + t * t * (-3 * p1.x + 3 * p2.x - 2 * v0.x - v1.x)
                       + t * t * t * (2 * p1.x - 2 * p2.x + v0.x + v1.x);
              var y = p1.y + t * v0.y 
                       + t * t * (-3 * p1.y + 3 * p2.y - 2 * v0.y - v1.y)
                       + t * t * t * (2 * p1.y - 2 * p2.y + v0.y + v1.y);
              var z = p1.z + t * v0.z 
                       + t * t * (-3 * p1.z + 3 * p2.z - 2 * v0.z - v1.z)
                       + t * t * t * (2 * p1.z - 2 * p2.z + v0.z + v1.z);
              ret.push(new TV3(x, y, z));
           }
        }
        ret.push(points[points.length - 1]);
        return ret;
     },

    drawThinStrip: function(group, p1, p2, colors, div) {
       var geo = new THREE.Geometry();
       for (var i = 0, lim = p1.length; i < lim; i++) {
          geo.vertices.push(p1[i]); // 2i
          geo.vertices.push(p2[i]); // 2i + 1
       }
       for (var i = 1, lim = p1.length; i < lim; i++) {
          var f = new THREE.Face4(2 * i, 2 * i + 1, 2 * i - 1, 2 * i - 2);
         // f.color = new TCo(colors[Math.round((i - 1)/ div)]);
          geo.faces.push(f);
       }
       geo.computeFaceNormals();
       geo.computeVertexNormals(false);
       //var material =  new THREE.MeshLambertMaterial();
      // material.vertexColors = THREE.FaceColors;
       var mesh = new THREE.Mesh(geo, this.material);
       mesh.doubleSided = true;
       group.add(mesh);
    }
};




