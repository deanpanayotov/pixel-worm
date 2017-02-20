var canvas = document.getElementById('canvas');
var c = canvas.getContext("2d");

canvas.addEventListener('click', click, false);
canvas.addEventListener('dblclick', dblclick, false);
window.addEventListener('resize', resize, false);

/** total time for a full cell color transition */
var interval = 100;
/** number of columns/rows */
var columnSize = 30;
/** side of a cell in pixels */
var cellSize = canvas.width / columnSize;
/** number of iterations for a full cell color transition */
var iterations = 10;
/** 0-255; ~90 and below keeps the adjacent colors relative*/
var colorRange = 80;
var maxWorms = 3;

var index = [];
index[0] = iterations;
/** cell color at beginning of coloring */
var pixel = [];
var pixelStep = [];
/** coordinates of current cell */
var x = [];
var y = [];

var wormTimers = [];

/** pick a new cell and pick a new color */
function colorize(id) {

    updateCell(id);
    var oldPixel = [];
    oldPixel[0] = pixel[id][0] + pixelStep[id][0] * (iterations - 1);
    oldPixel[1] = pixel[id][1] + pixelStep[id][1] * (iterations - 1);
    oldPixel[2] = pixel[id][2] + pixelStep[id][2] * (iterations - 1);

    pixel[id] = c.getImageData(x[id] * cellSize, y[id] * cellSize, 1, 1).data;

    pixelStep[id][0] = (nextColor255(oldPixel[0], colorRange) - pixel[id][0]) / iterations;
    pixelStep[id][1] = (nextColor255(oldPixel[1], colorRange) - pixel[id][1]) / iterations;
    pixelStep[id][2] = (nextColor255(oldPixel[2], colorRange) - pixel[id][2]) / iterations;

    index[id] = 0;
}

/** randomly select an adjacent cell (with border checks) */
function updateCell(id) {
    if (Math.round(Math.random()) == 1) {
        if (x[id] === 0) {
            x[id] = 1;
            return;
        }
        if (x[id] == columnSize - 1) {
            x[id] = columnSize - 2;
            return;
        }
        if (Math.round(Math.random()) == 1) x[id]++;
        else x[id]--;

    } else {
        if (y[id] === 0) {
            y[id] = 1;
            return;
        }
        if (y[id] == columnSize - 1) {
            y[id] = columnSize - 2;
            return;
        }
        if (Math.round(Math.random()) == 1) y[id]++;
        else y[id]--;
    }
}

/** paint next iteration of color to the current cell */
function draw(id) {
    if (index[id] == iterations) {
        colorize(id);
        index[id] = 0;
    }
    c.fillStyle = "rgb(" + Math.round(pixel[id][0] + pixelStep[id][0] * index[id]) + ", " + Math.round(pixel[id][1] + pixelStep[id][1] * index[id]) + ", " + Math.round(pixel[id][2] + pixelStep[id][2] * index[id]) + ")";
    c.fillRect(x[id] * cellSize, y[id] * cellSize, cellSize, cellSize);
    index[id]++;
}

/** start another worm */
function createWorm(mousePosition){
	
	if(!mousePosition){
		mousePosition = {x: rndInt(columnSize), y: rndInt(columnSize)};
	}
	
	var id;
	for(var i = 1;i < maxWorms; i++){
		if(typeof(wormTimers[i]) === 'undefined' || wormTimers[i] === null){
		  id = i;
		}
	}
	if(typeof(id) === 'undefined'){
		id = maxWorms-1;
		clearInterval(wormTimers[id]);
	}
	
	x[id] = mousePosition.x;
	y[id] = mousePosition.y;
	index[id] = iterations - 1;
	pixel[id] = c.getImageData(x[id] * cellSize, y[id] * cellSize, 1, 1).data;
	pixelStep[id] = [0, 0, 0];
    wormTimers[id] = setInterval(function() { draw(id); }, interval / iterations);
}

/** set the current cell to the one @ mouse pointer and clear screen with random color */
function clear(position) {
	clearWormTimers();
	changeBackground();
	createWorm(position);
}

function changeBackground(){
	c.fillStyle = "rgb(" + rndInt(255) + ", " + rndInt(255) + ", " + rndInt(255) + ")";
    document.body.style.background = c.fillStyle;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

function clearWormTimers(){
	for(var i=0;i<wormTimers.length;i++){
		clearInterval(wormTimers[i]);
	}
	wormTimers = [];
}

/** returns a random integer range [max(oldColor - range, 0): min(oldColor + range, 255)] */
function nextColor255(oldColor, range) {
    var newColor = oldColor + rndInt(range * 2) - range;
    if (newColor < 0) return 0;
    if (newColor > 255) return 255;
    return newColor;
}

/** returns a random integer in the range [0;max] */
function rndInt(max) {
    return Math.round(Math.random() * max);
}

function getMousePosition(event){
	var mouseX, mouseY;
	if (event.pageX || event.pageY) {
		mouseX = event.pageX;
		mouseY = event.pageY;
	} else {
		mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}  
	mouseX -= canvas.offsetLeft;
	mouseY -= canvas.offsetTop;
	
	return { x: mouseX / cellSize, y: mouseY / cellSize };
}

function click(event){
	createWorm(getMousePosition(event));
}

function dblclick(event){
	clear(getMousePosition(event));
}

function resize(){
	console.log("resize!");
	clear();
}

clear();
