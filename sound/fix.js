var intensity = 2.5;
var distance = 100;
var decay = 2.0;

var c1 = 0xff0040,
    var dot = new THREE.SphereGeometry(0.25, 16, 8);


light2 = new THREE.PointLight(c1, intensity, distance, decay);
light2.add(new THREE.Mesh(dot, new THREE.MeshBasicMaterial({
    color: c1
})));
scene.add(light2);
//move color lights
var time = Date.now() * 0.0025;
var d = 100;
light2.position.x = Math.cos(time * 0.3) * d;
light2.position.y = Math.cos(time * 0.1) * d;
light2.position.z = Math.sin(time * 0.7) * d;


/*Global Variables*/

var fft;
var song;
var button;
var load;
var audioFile;

var uploadLoading = false;

function uploaded(file) {
    if (song.isPlaying()) { // if audio is playing
        song.stop(); //pause audio when button is pressed
    }

    console.log("aaa");
    uploadLoading = true;
    song = loadSound(file.data, uploadedAudioPlay);
}

function uploadedAudioPlay(audioFile) {

    //uploadLoading = false;

    //if (audio.isPlaying()) {
    //audio.pause();
    //}

    //audio = audioFile;
    //audio.loop();
    song.play();
}




function playSong() {
    if (song.isPlaying()) { // if audio is playing
        song.pause(); //pause audio when button is pressed
    } else { // if audio is not playing
        song.play(); // play audio when button is pressed
    }
}

/*
Loads content within this function first. This ensures the song will start playing straight away.
*/
function preload() {
    song = loadSound('run_boy.mp3'); // loads song
}
/* 
Set up function only runs once. In this function the colour mode is set,
 as well as creating the play button and initiating the FFT object
 */
function setup() {
    createCanvas(windowWidth, windowHeight);
    colorMode(RGB);
    button = createButton('play');
    button.mousePressed(playSong); // if mouse presses on the button, call the playSong function
    song.play();
    uploadBtn = createFileInput(uploaded);

    uploadBtn.addClass("upload-btn");
    fft = new p5.FFT(); // Initiates FFT object

}

/*
Runs more than once, in this function the shapes are drawned
 according to the mapped sound frequencies
 */
function draw() {
    background(0);
    var spectrum = fft.analyze(); // run the FFT analysis

    /*
    Local Variable, fft.getEnergy maps the different 
    frequencies of the audio and returns values between 0 and 255
    */
    var bass = fft.getEnergy("bass");
    var treble = fft.getEnergy("treble");
    var highMid = fft.getEnergy("highMid");

    /* 
    Local variable which assigns values to the mapped frequencies
    */
    var mapMid = map(highMid, 0, 255, -60, 0);
    var mapTreble = map(treble, 0, 255, -140, 0);

    var pieces = 60; //Local variable for the number of lines in the shape
    var radius = 350
    translate(width / 2, height / 2); // Moves origin to the centre of the canvas
    stroke(0);
    strokeWeight(3);
    for (i = 0; i < pieces; i++) { // draws a shape of each piece

        stroke(219, 162, 188);
        rotate(frameCount * 0.0001);
        line(mapMid, mapMid, 10, bass);
        stroke(17, 218, 211);
        point(mapTreble, 480);
        point(mapMid, 670);

        /* 
        Push() adds a new item at the end of the array.
        Pop() removes the last item of an array
        */
        push();
        rotate(-frameCount * 0.01);
        stroke(17, 218, 211);
        point(120, bass);
        fill(17, 218, 211);
        point(bass, 300);
        pop();

        push();
        rotate(-frameCount * 0.01); //negative framecount allows points to spin counter clockwise
        stroke(219, 162, 188);
        point(550, bass);
        point(430, mapTreble);
        line(bass, 740, mouseY, 740);
        pop();

    }
}