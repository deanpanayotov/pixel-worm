var canvas = document.getElementById('canvas');
var c = canvas.getContext("2d");
c.fillStyle = "#000000";
c.fillRect(0, 0, canvas.width, canvas.height);
canvas.addEventListener('dblclick', clear, false);
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

var index = iterations;

/** cell color at beginning of coloring */
var pixel = [0, 0, 0];
var pixelStep = [0, 0, 0];

/** coordinates of current cell */
var x = getRandomInt(columnSize);
var y = getRandomInt(columnSize);

/** loop entry point*/
var timer = setInterval(draw, interval / iterations);

/** pick a new cell and pick a new color */
function colorize() {

    updateCell();
    var oldPixel = [];
    oldPixel[0] = pixel[0] + pixelStep[0] * (iterations - 1);
    oldPixel[1] = pixel[1] + pixelStep[1] * (iterations - 1);
    oldPixel[2] = pixel[2] + pixelStep[2] * (iterations - 1);

    pixel = c.getImageData(x * cellSize, y * cellSize, 1, 1).data;

    pixelStep[0] = (nextColor255(oldPixel[0], colorRange) - pixel[0]) / iterations;
    pixelStep[1] = (nextColor255(oldPixel[1], colorRange) - pixel[1]) / iterations;
    pixelStep[2] = (nextColor255(oldPixel[2], colorRange) - pixel[2]) / iterations;

    index = 0;
}

/** randomly select an adjacent cell (with border checks) */
function updateCell() {
    if (Math.round(Math.random()) == 1) {
        if (x === 0) {
            x = 1;
            return;
        }
        if (x == columnSize - 1) {
            x = columnSize - 2;
            return;
        }
        if (Math.round(Math.random()) == 1) x++;
        else x--;

    } else {
        if (y === 0) {
            y = 1;
            return;
        }
        if (y == columnSize - 1) {
            y = columnSize - 2;
            return;
        }
        if (Math.round(Math.random()) == 1) y++;
        else y--;
    }
}

/** paint next iteration of color to the current cell */
function draw() {
    if (index == iterations) {
        colorize();
        index = 0;
    }
    c.fillStyle = "rgb(" + Math.round(pixel[0] + pixelStep[0] * index) + ", " + Math.round(pixel[1] + pixelStep[1] * index) + ", " + Math.round(pixel[2] + pixelStep[2] * index) + ")";
    c.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    index++;
}
/** set the current cell to the one @ mouse pointer and clear screen with random color */
function clear(event) {
    if (event.pageX || event.pageY) {
        mouseX = event.pageX;
        mouseY = event.pageY;
    } else {
        mouseX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouseY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    mouseX -= canvas.offsetLeft;
    mouseY -= canvas.offsetTop;
    x = Math.floor(mouseX / cellSize);
    y = Math.floor(mouseY / cellSize);
    c.fillStyle = "rgb(" + getRandomInt(255) + ", " + getRandomInt(255) + ", " + getRandomInt(255) + ")";
    document.body.style.background = c.fillStyle;
    c.fillRect(0, 0, canvas.width, canvas.height);
}

/** returns a random integer range [max(oldColor - range, 0): min(oldColor + range, 255)] */
function nextColor255(oldColor, range) {
    var newColor = oldColor + getRandomInt(range * 2) - range;
    if (newColor < 0) return 0;
    if (newColor > 255) return 255;
    return newColor;
}

/** returns a random integer in the range [0;max]) */
function getRandomInt(max) {
    return Math.round(Math.random() * max);
}