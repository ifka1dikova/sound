/* 3D audio visualization built with three.js
made for educational purposes by Ivelina Kosmova
view on GitHub: https://github.com/ifka1dikova/sound
*/

// pushing using GitKraken
var analyser, CubeGrid; //global variabals
var audioLoader;
//const HIGHLIGHT_COLORS = [0x4200ff, 0x00ffff, 0xff0000, 0xff00ff]; // ref: https://github.com/dominikhofacker/Web-GL-Audio-Visualizer/blob/master/src/audiovisualisierung.js

function setup() {
    var canvas = createCanvas(200, 200);
    background(0);
    //drag and drop function [6]
    canvas.drop(gotFile);

}

function gotFile(file) {
    createP(file.name + " " + file.size);
}

function init() {
    /* create  a scene */
    var scene = new THREE.Scene();
    /* create the gui control panel (the small black menu at the right side of the screren) */
    var gui = new dat.GUI();
    // create an AudioListener and add it to the camera
    var listener = new THREE.AudioListener();
    // create a global audio source
    var sound = new THREE.Audio(listener);
    /*  enable the default fog*/
    var enableFog = false;


    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2); // colour of the fog / the intensity of the fog
    }
    /*  local-global veriables for the function init */
    var plane = getPlane(30); /* var for the plane at the bottom of the cubes */
    var directionalLight = getDirectionalLight(1); /* variable for the Direct. light */
    var pointLight = getPointLight(1); /* variable for the point light */
    var sphere = getSphere(0.05); /* variable for the sphere */
    CubeGrid = getCubeGrid(10, 1.5); /* grid of boxes  */
    plane.name = 'plane-1';

    var helper = new THREE.CameraHelper(directionalLight.shadow.camera); // building helper to see where the light is going

    plane.rotation.x = Math.PI / 2; /* position of the plane */

    /* position of the lights */
    pointLight.position.y = 20;
    pointLight.intensity = 2;
    directionalLight.position.set(1, 2.3, 3.2); // position of the Direc light x,y,z values
    directionalLight.intensity = 2;

    /* adding elements to the scene */
    scene.add(plane);
    pointLight.add(sphere);
    directionalLight.add(sphere);
    scene.add(pointLight);
    scene.add(directionalLight);
    scene.add(CubeGrid);
    scene.add(listener);
    //scene.add(helper);

    // adding into the gui controls menu at the right side of the window 
    gui.add(pointLight, 'intensity', 0, 10); // the object I want to control and the property names 
    //that I want to control and optionaly I can specify the min and max value of the property
    gui.add(pointLight.position, 'y', 0, 30);
    gui.add(directionalLight, 'intensity', 0, 10);
    gui.add(directionalLight.position, 'x', 0, 20);
    gui.add(directionalLight.position, 'y', 0, 20);
    gui.add(directionalLight.position, 'z', 0, 20);
    /* making a Perspective Camera , responsive to the windows width and height */
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    /* position of the camera */
    camera.position.x = 10;
    camera.position.y = 20;
    camera.position.z = 15;

    camera.lookAt(new THREE.Vector3(0, 0, 0));

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // reducing the size of the screen for tablets or phone
    renderer.setClearColor('rgb(120,120,120)'); // the rgb colour value
    document.getElementById('webgl').appendChild(renderer.domElement);
    document.getElementById('playButton'); // not working 

    var controls = new THREE.OrbitControls(camera, renderer.domElement); // orbit controls - the user to be able to exploare with the mouse 

    // load a sound and set it as the Audio object's buffer  [5] and [7]
    audioLoader = new THREE.AudioLoader();
    audioLoader.load('sounds/song.mp3', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });
    // create an AudioAnalyser, passing in the sound and desired fftSize
    analyser = new THREE.AudioAnalyser(sound, 32);


    update(renderer, scene, camera, controls); //calling the update function
    return scene;
}

function getCube(w, h, d) {
    var min = 64;
    var max = 224;
    var geometry = new THREE.CubeGeometry(w, h, d);
    for (var i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[i];
        face.color.setHex((Math.floor(Math.random() * (max - min + 1)) + min)); // random shades of blue or green [* 65536] // .setHex ( hex : Integer ) : Color

    }

    var material = new THREE.MeshPhongMaterial({
        wireframe: false, // set to false for solid block 
        vertexColors: THREE.FaceColors, // rondom colors    Inspiration [4]
        //gui.add(faceColors, 0xffffff,0xffd700); //I would like the user to be able to change the colours of the cubes 
        specular: 0xdddddd,
        shininess: 10,
        reflectivity: 5.5

    });

    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true; // receiving shadow 
    return mesh;
}

function getCubeGrid(amount, separationMultiplier) {
    var group = new THREE.Group();

    for (var i = 0; i < amount; i++) { // for loop of  boxes
        var obj = getCube(1, 1, 1);
        obj.position.x = i * separationMultiplier; // position of the boxes
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj);
        for (var j = 1; j < amount; j++) { // for loop for the number of the boxers 
            var obj = getCube(1, 1, 1);
            //obj.position = new THREE.Vector3(x, y, 0);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            obj.position.z = j * separationMultiplier;
            group.add(obj);
        }
    }
    group.position.x = -(separationMultiplier * (amount - 1)) / 2;
    group.position.z = -(separationMultiplier * (amount - 1)) / 2;
    return group;
}

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        // map: new THREE.TextureLoader().load("addons/fair.jpg"),
        color: 'rgb(120,120,120)',
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true;

    return mesh;
}
// create a sphere with material, texture [3]
function getSphere(size) { // readius
    var geometry = new THREE.SphereGeometry(size, 50, 50, ); // radius :(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)

    var material = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load("addons/night.jpg"), //[2.2]


    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity); // 2 arguments-colour of the light and the intensity
    light.castShadow = true;
    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true;

    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;

    // light.shadow.mapSize.width=4096; //4 times the default value
    // light.shadow.mapSize.height=4096; //4 times the default value
    return light;
}
// function drawBars (array) {

// 	//just show bins with a value over the treshold
// 	var threshold = 0;
// 	//the max count of bins for the visualization
// 	var maxBinCount = array.length;
// 	//space between bins
// 	var space = 3;
// var bass = Math.floor(array[1]); //1Hz Frequenz 
// 	var snare = Math.floor(array[250]);
// 	//console.log("Array length " + array.length);
// 	console.log("BASS: " + bass);
//     RADIUS = bass * .004; 
// // get the average, bincount is fftsize / 2
// if (audioLoader) {
// 	var array = new Uint8Array(analyser.frequencyBinCount);
// 	analyser.getByteFrequencyData(array);

// 	drawBars(array);
// }
// if (bass > 230) {
// 	//counterVar++;
// 	//if (counterVar % 3 === 0) 
// 	cube_mesh.material.color.setHex( HIGHLIGHT_COLORS[Math.floor(Math.random() * HIGHLIGHT_COLORS.length)] );
// 	cube_mesh.position.z += 10;
// 	//cube_mesh.rotation.z +=  .01;
// 	if (cube_mesh.position.z >= 2800) {
// 		cube_mesh.position.z = 0;
// 	}
// } else {
// 	cube_mesh.material.color.setHex( HIGHLIGHT_COLORS[0] );
// }
// //cube_mesh.position.y = dy;
// //go over each bin
// for ( var i = 0; i < maxBinCount; i++ ){

// }   

function update(renderer, scene, camera, controls) { // will work with 4 arguments

    // get the average frequency of the sound (FFT)
    var data = analyser.getAverageFrequency();

    for (var i = 0; i <= CubeGrid.children.length; i++) {


        //CubeGrid.children[i].scale.y = data / i;

        if (i < 10) {
            CubeGrid.children[i].scale.y = (data / 10) / 2;
        } else if (i < 20) {
            CubeGrid.children[i].scale.y = data / 9;
        }

        if (i < 10) {
            CubeGrid.children[i].scale.y = data / 3;
        } else if (i < 20) {
            CubeGrid.children[i].scale.y = data / 7;
        }
        if (i < 50) {
            CubeGrid.children[i].scale.y = data / 4;
        } else if (i < 60) {
            CubeGrid.children[i].scale.y = data / i;
        }
        if (i < data) {
            CubeGrid.children[i].scale.y = data / 10;
        } else if (i < 80) {
            CubeGrid.children[i].scale.y = data / 3;
        }
        if (i < 90) {
            CubeGrid.children[i].scale.y = data / 4;
        } else if (i < 100) {
            CubeGrid.children[i].scale.y = data / 3;
        }

    }
    // console.log(CubeGrid.children);
    //debugger;
    // CubeGrid.scale.y = data / 10;  original working code


    requestAnimationFrame(function() { //request animation frame 
        update(renderer, scene, camera, controls);
    })
    controls.update();
    renderer.render(
        scene,
        camera
    );
}


//including API link to Load background texture [2.1]
new THREE.TextureLoader().load('https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg', function(texture) {
    scene.background = texture;
});


var scene = init();

/* 
References(code/texture and inspirations):
[1] inspiration for the movement of the boxes : https://srchea.com/apps/sound-visualizer-web-audio-api-webgl/
[2]Texture:
[2.1] background image : https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg
[2.2] sphere: http://www.shadedrelief.com/natural3/pages/textures.html 

[3] Debugging the Shpere https://threejs.org/docs/#api/en/geometries/SphereGeometry
 radius — sphere radius. Default is 1.
widthSegments — number of horizontal segments. Minimum value is 3, and the default is 8.
heightSegments — number of vertical segments. Minimum value is 2, and the default is 6.
phiStart — specify horizontal starting angle. Default is 0.
phiLength — specify horizontal sweep angle size. Default is Math.PI * 2.
thetaStart — specify vertical starting angle. Default is 0.
thetaLength — specify vertical sweep angle size. Default is Math.PI.

The geometry is created by sweeping and calculating vertexes around the Y axis 
(horizontal sweep) and the Z axis (vertical sweep). Thus, incomplete spheres 
(akin to 'sphere slices') can be created through the use of different values 
of phiStart, phiLength, thetaStart and thetaLength, in order to define the 
points in which we start (or end) calculating those vertices. 

[4] Inspiration  for rondom colours : https://jsfiddle.net/tyweiss84/0g7z4fv7/ 
[5] Load a sound and set it as the Audio object's buffer   ref:https://threejs.org/docs/#api/en/audio/Audio
[6] Drag and drop function  Ref: https://www.youtube.com/watch?v=o4UmGrPst_c
[7] SONG : 
[8] inspiration for the left menu done with CSS http://wayou.github.io/3D_Audio_Spectrum_VIsualizer/
[9] inspiration for the practicle system : https://codepen.io/zadvorsky/pen/vNVNYr
*/