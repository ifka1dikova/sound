var analyser, CubeGrid;
var audioLoader;
var input, button, button2;
var uploadAudio;
var sound, sound2, audio;
var soundInPut;
var uploadAudio = false;




function setup() {
    var canvas = createCanvas(200, 200);
    background(0);
    //drag and drop function [6]
    canvas.drop(gotFile);

    input = createInput();
    input.position('#upload');

    button = select('#playButton');
    button.mousePressed(buttonPressed);

    button2 = select('#playButton2');
    button2.mousePressed(buttonPressed2);


}

function uploaded(file) {
    uploadLoading = true;
    uploadedAudio = loadSound(file.data, uploadedAudioPlay);
}

function uploadedAudioPlay(audioFile) {

    uploadLoading = false;

    if (sound.isPlaying()) {
        sound.pause();
    }
    sound2.play();
    sound2 = audioFile;
    sound2.loop();
    // console.log("button pressed", sound2);
}

function buttonPressed() {

    console.log("button pressed", sound);

    if (soundInPut.isPlaying) {
        soundInPut.stop();

    }
    //soundInPut.stop();


    sound.play();
    analyser = new THREE.AudioAnalyser(sound, 32);
}

function buttonPressed2() {
    // sound.stop();

    if (sound.isPlaying) {
        sound.stop();

    }
    soundInPut.play();
    analyser = new THREE.AudioAnalyser(soundInPut, 32);

    console.log("button pressed", soundInPut);
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
    sound = new THREE.Audio(listener);
    soundInPut = new THREE.Audio(listener);
    /*  enable the default fog*/
    var enableFog = false;


    if (enableFog) {
        scene.fog = new THREE.FogExp2(0xffffff, 0.2); // colour of the fog / the intensity of the fog
    }
    /*  local in the function ,but-global for the function veriables */
    var plane = getPlane(30); /* var for the plane at the bottom of the cubes */
    var directionalLight = getDirectionalLight(1); /* variable for the Direct. light */
    var pointLight = getPointLight(1); /* variable for the point light */
    var sphere = getSphere(0.05); /* variable for the spheres */
    var sphere2 = getSphere2(0.05);
    var sphere3 = getSphere2(0.05);

    CubeGrid = getCubeGrid(10, 1.5); /* grid of boxes  */
    plane.name = 'plane-1';

    var helper = new THREE.CameraHelper(directionalLight.shadow.camera); // building helper to see where the Direct light is going !! it will be removed from the scene when not needed

    plane.rotation.x = Math.PI / 2; /* position of the plane */

    /* position of the lights */
    pointLight.position.y = 20;
    pointLight.intensity = 2;
    directionalLight.position.set(1, 2.3, 3.2); // position of the Direc light is set x,y,z values
    directionalLight.intensity = 2;

    pointLight2.position.x = 30;
    pointLight2.position.z = 60;

    pointLight3.position.x = -30;
    pointLight3.position.z = -60;


    pointLight2.add(sphere2);
    scene.add(pointLight2);

    pointLight3.add(sphere3);
    scene.add(pointLight3);

    /* adding elements to the scene */
    scene.add(plane);
    pointLight.add(sphere);
    directionalLight.add(sphere);
    scene.add(pointLight);
    // scene.add(pointLight2);
    scene.add(directionalLight);
    scene.add(CubeGrid);
    scene.add(listener);
    //scene.add(helper);

    // adding elements into the gui controls menu at the right side of the window 
    gui.add(pointLight, 'intensity', 0, 10); // the object I want to control and the property names 
    //that I want to control and optionaly I can specify the min and max value of the property
    gui.add(pointLight.position, 'y', 0, 30);
    // gui.add(pointLight2, 'intensity', 0, 100);
    // gui.add(pointLight3, 'intensity', 0, 100);
    gui.add(directionalLight, 'intensity', 0, 10);
    gui.add(directionalLight.position, 'x', 0, 20);
    gui.add(directionalLight.position, 'y', 0, 20);
    gui.add(directionalLight.position, 'z', 0, 20);

    /* making a Perspective Camera , responsive to the windows width and height (on reload)*/
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    /* position of the camera - 3 values-x,y,z*/
    camera.position.x = 10;
    camera.position.y = 20;
    camera.position.z = 15;

    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Class representing a 3D vector[13]

    var renderer = new THREE.WebGLRenderer(); // rendering the scene with WebGl
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // reducing the size of the screen for tablets or phones
    renderer.setClearColor('rgb(120,120,120)'); // the rgb colour value
    document.getElementById('webgl').appendChild(renderer.domElement); // the location of the scene is in the 'webgl' location into the HTML file
    document.getElementById('playButton'); // not working 

    var controls = new THREE.OrbitControls(camera, renderer.domElement); // orbit controls - the user to be able to exploare with the mouse 

    // load a sound and set it as the Audio object's buffer  [5] and [7]
    audioLoader = new THREE.AudioLoader();

    audioLoader.load('sounds/DJ89-MOONLIGHT.mp3', function(buffer) {
        // my personal database in the MongoDB stitch hosting 
        // another link to the song https://stitch-statichosting-prod.s3.amazonaws.com/5c94b290b410ce52abd2ed6d/DJ89-MOONLIGHT.mp3
        //another song https://stitch-statichosting-prod.s3.amazonaws.com/5c94b290b410ce52abd2ed6d/song.mp3
        // audioLoader.load('https://stitch-statichosting-prod.s3.amazonaws.com/5c94b290b410ce52abd2ed6d/song.mp3', function(buffer) {

        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        console.log("moonlight loaded");

    });



    audioLoader2 = new THREE.AudioLoader();

    audioLoader2.load('sounds/song.mp3', function(buffer) {
        // mloading the other sound file from the user input

        soundInPut.setBuffer(buffer);
        soundInPut.setLoop(true);
        soundInPut.setVolume(0.5);
        // soundInPut.hasPlaybackControl(false);
        // soundInPut.play(buttonPressed);

        console.log("song loaded");

    });




    // create an AudioAnalyser, passing in the sound and desired fftSize
    analyser = new THREE.AudioAnalyser(sound, 32);
    // analyser = new THREE.AudioAnalyser(soundInPut, 32);


    update(renderer, scene, camera, controls); //calling the update function
    return scene;
}

/* creating a cube with width ,height and deep h */
function getCube(w, h, d) {
    var min = 64; /* local variables for min & max values*/
    var max = 224;
    var geometry = new THREE.CubeGeometry(w, h, d);
    for (var i = 0; i < geometry.faces.length; i++) { /* spliting the cube into diferent faces with a forloop */
        var face = geometry.faces[i];
        face.color.setHex((Math.floor(Math.random() * (max - min + 1)) + min)); //the colour of each face of the cube is a random shade of blue {or green [* 65536]} // .setHex ( hex : Integer ) : Color

    }
    /* creating the cube's material */
    var material = new THREE.MeshPhongMaterial({ //[12]
        wireframe: false, // set to false for solid block 
        vertexColors: THREE.FaceColors, // rondom colors    Inspiration [4]
        //gui.add(faceColors, 0xffffff,0xffd700); //I would like the user to be able to change the colours of the cubes 
        specular: 0xdddddd, // how much the specular surface highlight contributes and how much of the environment map affects the surface. Default is null. !Only for Phong material
        shininess: 10, // how much will shine
        reflectivity: 5 // how much will be reflective


    });
    /* setting the cube's mesh *Nothing interesting here */
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true; // receiving shadow 
    return mesh;
}
/* creating a grid of cubes with a function */
function getCubeGrid(amount, separationMultiplier) {
    var group = new THREE.Group(); /* using THREE group method */

    for (var i = 0; i < amount; i++) { // for loop of  boxes
        var obj = getCube(1, 1, 1);
        obj.position.x = i * separationMultiplier; // position of the boxes= number of the multiplyed box x and multiplies the environment map color with the surface color. 
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj); // adding the group of 10 boxes he scene

        for (var j = 1; j < amount; j++) { // for loop for the number of the boxers 
            var obj = getCube(1, 1, 1);
            //obj.position = new THREE.Vector3(x, y, 0);
            obj.position.x = i * separationMultiplier;
            obj.position.y = obj.geometry.parameters.height / 2;
            obj.position.z = j * separationMultiplier; // multiplying the cubes  
            group.add(obj);
        }
    }
    group.position.x = -(separationMultiplier * (amount - 1)) / 2;
    group.position.z = -(separationMultiplier * (amount - 1)) / 2;
    return group;
}
/* creating a plane  */

function getPlane(size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    var material = new THREE.MeshPhongMaterial({
        // map: new THREE.TextureLoader().load("addons/fair.jpg"),
        color: 'rgb(120,120,120)', // grey47 color
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.receiveShadow = true; // receiving shadow

    return mesh;
}
// create a sphere with material, texture [3]
function getSphere(size) { // radius
    var geometry = new THREE.SphereGeometry(size, 50, 50, ); // radius :(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)

    var material = new THREE.MeshLambertMaterial({ // the sphere material -lambert
        map: new THREE.TextureLoader().load("addons/night.jpg"), //[2.2] // adding some texture map tot he sphere


    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

function getSphere2() { // radius
    var geometry = new THREE.SphereBufferGeometry(0.25, 16, 8); //  ref [16] radius :(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
    var material = new THREE.MeshBasicMaterial({ // the basic cyrcle
        // color: 0xffff00
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}

function getSphere3() { // radius
    var geometry = new THREE.SphereBufferGeometry(0.25, 16, 8); //  ref [16] radius :(radius : Float, widthSegments : Integer, heightSegments : Integer, phiStart : Float, phiLength : Float, thetaStart : Float, thetaLength : Float)
    var material = new THREE.MeshBasicMaterial({ // the basic cyrcle
        // color: 0xffff00
    });
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    return mesh;
}
/* LIGHTS  */
/* user controlled  LIGHTS  */
function getPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity); // 2 arguments-colour of the light and the intensity
    light.castShadow = true; // enable the shadow casting on a light [14]
    return light;
}

function getDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.castShadow = true; // enable the shadow casting on a light
    // seting up an orthographic camera when  casting shadow with a Directional Light (see ref. 14)
    light.shadow.camera.left = -10;
    light.shadow.camera.bottom = -10;
    light.shadow.camera.right = 10;
    light.shadow.camera.top = 10;

    // light.shadow.mapSize.width=4096; //4 times the default value
    // light.shadow.mapSize.height=4096; //4 times the default value
    return light;
}
/* disco/ bass controlled lights  [15]*/
var intensity = 200.5; //light's strength/intensity.
var distance = 100; // Maximum range of the light
var pointLight2 = getPointLight2(1);
var pointLight3 = getPointLight3(1);
// var colorLight2 = 0xffd700; // colour 0xffd700  0xff0000
var decay = 2.0; //The amount the light dims along the distance of the light


function getPointLight2(intensity) {
    var light = new THREE.PointLight(0xff0000, intensity, distance, decay); //( color : Integer, intensity : Float, distance : Number, decay : Float
    return light;


}

function getPointLight3(intensity) {
    var light = new THREE.PointLight(0xffd700, intensity, distance, decay); //( color : Integer, intensity : Float, distance : Number, decay : Float
    return light;
}
pointLight2.intensity = 10;
pointLight3.intensity = 8;



function update(renderer, scene, camera, controls) { // will work with 4 arguments
    /* lights analyses */
    var data2 = analyser.getFrequencyData();
    pointLight2.intensity = data2[8];
    pointLight3.intensity = data2[4];
    // console.log(data2.length);


    // var data2 = analyser.getByteFrequencyData();
    // console.log(data2.length);



    // get the average frequency of the sound (FFT)
    var data = analyser.getAverageFrequency();

    for (var i = 0; i <= CubeGrid.children.length; i++) {


        //CubeGrid.children[i].scale.y = data / i;

        if (i < 11) {
            CubeGrid.children[i].scale.y = data / 10;
        } else if (i > 9 && i < 20) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 19 && i < 30) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 19 && i < 30) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 19 && i < 30) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 29 && i < 40) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 39 && i < 50) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 49 && i < 60) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 59 && i < 70) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 69 && i < 80) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 79 && i < 90) {
            CubeGrid.children[i].scale.y = data / i;
        } else if (i > 89 && i < 100) {
            CubeGrid.children[i].scale.y = data / i;
        }

    }
    // console.log(CubeGrid.children);
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
[10] inspiration lights : https://codepen.io/AlisonBuki/pen/mEzYEB
[11] inspiration lights links to the bass  ref: https://github.com/dominikhofacker/Web-GL-Audio-Visualizer/blob/master/src/audiovisualisierung.js
[12] https://threejs.org/docs/#api/en/materials/MeshPhongMaterial
[13] https://threejs.org/docs/#api/en/math/Vector3 
[14] http://learningthreejs.com/blog/2012/01/20/casting-shadows/ 
[15] https://threejs.org/docs/#api/en/lights/PointLight 
[16] https://threejs.org/docs/#api/en/geometries/SphereBufferGeometry



 link to my logo.svg in github  https://raw.githubusercontent.com/ifka1dikova/sound/master/sound/addons/logo.svg 
 Ref for  https://stackoverflow.com/questions/117667/hyperlinking-an-image-using-css 
*/