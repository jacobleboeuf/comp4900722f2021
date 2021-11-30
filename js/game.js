/**
 * File: game.js
 * Computer Graphics II Project - Big Brain or LAME?
 *
 * - This project uses HTML, CSS, and JavaScript to create a brain teaser game made
 *   to frustrate and challenge the user.
 *
 * - This file contains the JavaScript for the entire project, and is responsible
 *   for all of the levels of the game, including the gameOver and Victory screen
 *
 * - All non-created images used are from clipartmax.com, clipart-library.com, and istockphoto.com
 *
 * Jacob Leboeuf, UMass Lowell Computer Science, jacob_leboeuf@student.uml.edu,
 * Copyright (c) 2021 by Jacob. All rights reserved. May be freely copied or
 * excerpted for educational purposes with credit to the author.
 * updated by JL on November 23, 2021 at 12:03 AM
**/

// GLOBAL HELPER VARIABLES

var lives = 3; // global variable for number of brains/lives in game
var play = document.querySelector('.play');
var display = document.getElementById("game");
var time = document.createElement('div');
time.className = 'time'; // For non-clock updating time in level1
var ampm; // for displaying AM/PM with times in level1
var newText;
let canvas, ctx, radius; // for making canvas clock
var currDate; // global date variable
var timeStopped = false; // boolean variable checking if clock was stopped in level1
var timer = document.createElement('div');
timer.className = 'timer'; // For timer on bomb in level2
var bombTime = 5; // timer on bomb in level2
var bombStringX = 98.5; // initial bomb string x coordinates (level2)
var bombStringY = 190; // initial bomb string y coordinates (level2)
var stringHeight = 40; // inital bomb string length (level2)
var clearHeight = 1; //
var ctx2;
var oldPos = 500; // previous y coordinate of mousedown (level2)
var probNumbers = []; // array of randomly generated numbers for math problems (level2)
var baby, broccoli, pizza, chicken, burger, bleach, apple, cheese, milk; // global image variables for level3
var isDraggable = false; // boolean variable
var newX = 0; // updated x coordinate for dragging (level3)
var newY = 0; // updated y coordinate for dragging (level3)
var isCookie = false; // boolean variable that is true if user turns bleach image into cookies (level3)
var selected = ""; // string variable describing 'selected' image in level 3
var brainLost = false; // boolean variable that is true if user loses brain (used in level3)
var gameWon = false; // boolean variable that is true if user successfully completes all 3 levels

// PRE LEVEL 1

/**
*  showRules() - Displays the rules for the game
*
*/
play.addEventListener("click", showRules);
function showRules() {
    display.setAttribute("style", "background-image: none;");
    display.innerHTML = "<h1 id=\"rules\">DA RULEZ</h1>";
    display.innerHTML += "<p>The rules are simple:</p>"
    var rules = document.createElement("ol");
    var rule = document.createElement("li");
    newText = document.createTextNode('Get through the various levels to prove you are ');
    rule.appendChild(newText);
    newText = document.createTextNode('BIG BRAIN');
    var span = document.createElement('span');
    span.style = 'color: green';
    span.appendChild(newText);
    rule.appendChild(span);
    rules.appendChild(rule);
    rule = document.createElement("li");
    newText = document.createTextNode('If you fail to pass a level, you will lose a brain');
    rule.appendChild(newText);
    rules.appendChild(rule);
    rule = document.createElement("li");
    newText = document.createTextNode('You have 3 brains. If you run out of brains, you are ');
    rule.appendChild(newText);
    newText = document.createTextNode('LAME');
    span = document.createElement('span');
    span.style = 'color: red';
    span.appendChild(newText);
    rule.appendChild(span);
    rules.appendChild(rule);
    display.appendChild(rules);
    display.innerHTML += "<p> Are you ready? Click 'begin' to begin!</p>";
    var button = document.createElement("button");
    button.className = 'play';
    button.innerHTML = "BEGIN";
    button.addEventListener("click", level1);
    display.appendChild(button);
}

// LEVEL 1 HELPER FUNCTIONS
/**
* drawClock() - uses helper functions to draw canvas clock
* Heavy inspiration from https://www.w3schools.com/graphics/canvas_clock.asp
*/
function drawClock() {
    drawClockFace(ctx, radius);
    drawClockNumbers(ctx, radius);
    if (timeStopped) {
        drawTime(ctx, radius, currDate);
    } else {
        drawTime(ctx, radius, new Date());
    }
}
/**
* drawClockFace(ctx, radius) - helper function to drawClock that creates the clock face
* Heavy inspiration from https://www.w3schools.com/graphics/canvas_clock_face.asp
*/
function drawClockFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    var gradient = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
    gradient.addColorStop(0, 'black');
    ctx.lineWidth = radius*0.1;
    ctx.strokeStyle = gradient;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
}
/**
* drawClockNumbers(ctx, radius) - helper function to drawClock that creates the clock numbers
* Heavy inspiration from https://www.w3schools.com/graphics/canvas_clock_numbers.asp
*/
function drawClockNumbers(ctx, radius) {
    var angle;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "bold " + radius * 0.15 + "px arial";
    for(var i = 1; i <= 12; i++) {
        angle = i * Math.PI / 6;
        ctx.rotate(angle);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-angle);
        ctx.fillText(i.toString(), 0, 0);
        ctx.rotate(angle);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-angle);
  }
}
/**
* drawTime(ctx, radius, cDate) - helper function to drawClock that creates the clock hand
* Heavy inspiration from https://www.w3schools.com/graphics/canvas_clock_hands.asp
*/
function drawTime(ctx, radius, cDate){
    var hours = cDate.getHours();
    var minutes = cDate.getMinutes();
    var seconds = cDate.getSeconds();
    hours = hours % 12;
    hours = (hours * Math.PI / 6) + (minutes * Math.PI / (6 * 60))
    + (seconds * Math.PI / (360 * 60));
    drawClockHand(ctx, hours, radius * 0.5, radius * 0.07);
    minutes = (minutes * Math.PI / 30) + (seconds * Math.PI / (30 * 60));
    drawClockHand(ctx, minutes, radius * 0.8, radius * 0.07);
    seconds = (seconds * Math.PI / 30);
    drawClockHand(ctx, seconds, radius * 0.9, radius * 0.02);
}
/**
* drawClockHand(ctx, pos, length, width) - helper function to drawClock that draws the clock hand
* Heavy inspiration from https://www.w3schools.com/graphics/canvas_clock_hands.asp
*/
function drawClockHand(ctx, pos, length, width) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineWidth = width;
    ctx.moveTo(0, 0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}
/**
* addzero(string s) - helper function that adds a leading zero to time value < 10
* returns string with '0' before it
*/
function addzero(s) {
    if (s.length == 1) {
        s = "0" + s;
    }
    return s;
}
/**
* displayTime() - function displays the current time, updating every millisecond
*/
function displayTime() {
    var d = new Date();
    if (!timeStopped) {
        currDate = d;
    } else {
        d = currDate;
    }
    ampm = "AM";
    var hrs = d.getHours();
    if (hrs >= 12) {
        ampm = "PM";
        hrs -= 12;
        if (hrs == 0) {
            hrs = 12;
        }
    }
    var hours = hrs.toString();
    hours = addzero(hours);
    var minutes = d.getMinutes().toString();
    minutes = addzero(minutes);
    var seconds = d.getSeconds().toString();
    seconds = addzero(seconds);
    var milliseconds = d.getMilliseconds().toString();
    milliseconds = addzero(milliseconds);
    var date = hours + ":" +  minutes + ":" +  seconds
              + "." + milliseconds + " " + ampm;
    time.innerHTML = date;
    refreshTime();
    return true;
}
/**
* refreshTime() - helper function for displayTime(), calling function every millisecond
*/
function refreshTime() {
    var refresh = 1;
    mytime = setTimeout('displayTime()', refresh);
}
/**
* stopClocks() - updates global timeStopped boolean variable when clock is clicked
*/
function stopClocks() {
    timeStopped = true;
    currDate = new Date();
}

// LEVEL 1

/**
* level1() - Function asks user for the time, based on created canvas clock and displayed
*            time. User must correctly enter time to advance to level2, or they will run
*            out of brains and trigger gameOver() function.
*/
function level1() {
    display.setAttribute("style", "background-image: url(\"images/brain.png\");");
    display.innerHTML = "<h1 id=\"level\">LEVEL 1</h1>";
    display.innerHTML += "<h2 id=\"numLives\">" + lives + "</h2>";
    display.innerHTML += "<p id=\"directions\">Tell Me the Time:</p>";
    // Make clock
    var iCanvas = document.createElement('canvas');
    iCanvas.className = 'clock';
    iCanvas.setAttribute("height", 300);
    iCanvas.addEventListener('mousedown', stopClocks);
    display.appendChild(iCanvas);
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext("2d");
    radius = canvas.height / 2;
    ctx.translate(radius, radius);
    radius = radius * 0.90;
    setInterval(drawClock, 1000);
    // Display time
    display.appendChild(time);
    displayTime();
    var form = document.createElement("form");
    form.className = 'inputTime';
    var input = document.createElement("input");
    input.type = 'number';
    input.className = 'hours';
    input.placeholder = 'HH';
    form.appendChild(input);
    var label = document.createElement('label');
    label.appendChild(document.createTextNode(':'));
    form.appendChild(label);
    input = document.createElement("input");
    input.type = 'number';
    input.className = 'minutes';
    input.placeholder = 'MM';
    form.appendChild(input);
    label = document.createElement('label');
    label.appendChild(document.createTextNode(':'));
    form.appendChild(label);
    input = document.createElement("input");
    input.type = 'number';
    input.className = 'seconds';
    input.placeholder = 'SS';
    form.appendChild(input);
    label = document.createElement('label');
    label.appendChild(document.createTextNode('.'));
    form.appendChild(label);
    input = document.createElement("input");
    input.type = 'number';
    input.className = 'milliseconds';
    input.placeholder = 'SSS';
    form.appendChild(input);
    var submit = document.createElement('button');
    submit.type = 'submit';
    submit.className = 'submit';
    submit.innerHTML = "SUBMIT";
    form.appendChild(submit);
    display.appendChild(form);
    var l1 = document.querySelector('.inputTime');
    l1.addEventListener('submit', (e) => {
        e.preventDefault();
        var h = document.getElementsByClassName('hours')[0].value;
        var m = document.getElementsByClassName('minutes')[0].value;
        var s = document.getElementsByClassName('seconds')[0].value;
        var ms = document.getElementsByClassName('milliseconds')[0].value;
        if (ampm == "PM") {
            if ((h == currDate.getHours() || h == (currDate.getHours() - 12))
                && m == currDate.getMinutes() && s == currDate.getSeconds()
                && ms == currDate.getMilliseconds()) {
                  ctx.beginPath();
                  ctx.fillStyle = "rgba(0, 0, 0, 255)";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.stroke();
                level2();
            } else {
                loseBrain();
            }
        } else {
            if (h == currDate.getHours() && m == currDate.getMinutes()
                && s == currDate.getSeconds() && ms == currDate.getMilliseconds()) {
                  ctx.beginPath();
                  ctx.fillStyle = "rgba(0, 0, 0, 255)";
                  ctx.fillRect(0, 0, canvas.width, canvas.height);
                  ctx.stroke();
                  level2();
            } else {
              loseBrain();
            }
        }
    });
}

// LEVEL 2 HELPER FUNCTIONS

/**
* makeForm() - Generates math problems for level2 in form element within html
*/
function makeForm() {
    var form = document.createElement('form');
    probNumbers = [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1,Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1,Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1,Math.floor(Math.random() * 9) + 1,
        Math.floor(Math.random() * 9) + 1];
    form.className = 'math';
    var a = 0;
    var b = 1;
    var sign = [" + ", "\t-\t"];
    for (var i = 0; i < 8; i++) {
        var input = document.createElement('input');
        input.type = 'text';
        input.className = "answer";
        var label = document.createElement('label');
        var text = document.createTextNode(probNumbers[a] + (sign[i%2]) + probNumbers[b] + " = ");
        label.appendChild(text);
        form.appendChild(input);
        form.appendChild(label);
        a += 2;
        b += 2;
     }
      var submit = document.createElement('button');
      submit.type = 'submit';
      submit.className = 'submit';
      submit.innerHTML = "SUBMIT";
      form.appendChild(submit);
    return form;
}
/**
* kaboom() - Function executes when bomb 'explodes', shows explosion animation then
             decreases bombTime to 0 to trigger loseBrain()
*/
function kaboom() {
    if (bombTime >= 0) {
        bombTime = 1;
    }
    display.setAttribute("style", "background-image: url(\"images/kaboom1.png\");");
    // Hide all other elements to show 'animation'
    document.querySelector('.math').setAttribute("style", "display: none;");
    document.querySelector('.timer').setAttribute("style", "display: none;");
    document.querySelector('#bomb').setAttribute("style", "display: none;");
    document.querySelector('#lev2').setAttribute("style", "display: none;");
    document.querySelector('#level').setAttribute("style", "display: none;");
    document.querySelector('#numLives').setAttribute("style", "display: none;");
    setTimeout(function() {display.setAttribute("style", "background-image: url(\"images/kaboom2.png\");");}, 250);
    setTimeout(function() {display.setAttribute("style", "background-image: url(\"images/kaboom3.png\");");}, 500);
    setTimeout(function() {display.setAttribute("style", "background-image: url(\"images/kaboom4.png\");");}, 750);
    // helps trigger loseBrain() after animation
    bombTime--;
}
/**
* resetLevel2() - Function essentially reloads level2, bypassing recursive errors and resetting
*                 initial values
*/
function resetLevel2() {
  bombTime = 5;
  loseBrain();
  if (lives > 0) {
      display.setAttribute("style", "background-image: url(\"images/brain.png\");");
      display.innerHTML = "<h1 id=\"level\">LEVEL 2</h1>";
      display.innerHTML += "<h2 id=\"numLives\">" + lives + "</h2>";
      display.innerHTML += "<p id=\"lev2\">Complete the Math Problems Before the Bomb Explodes!</p>";
      display.innerHTML += "<div class='timer'></div>"
      display.innerHTML += "<canvas id='bomb' width='200' height='375'></canvas>";
      canvas = document.querySelector('canvas');
      var ctx2 = canvas.getContext("2d");
      clearHeight = 1;
      bombStringY = 190;
      stringHeight = 40;
      display.appendChild(makeForm());
      // helper function for form
      makeFormWork();
      drawBomb(ctx2, 7, stringHeight, clearHeight);
  }
}
/**
* makeTimer() - converts global bombTimer int variable into string showing how
*               many minutes/seconds they have left before bomb explodes
*/
function makeTimer() {
    var min = 0;
    var sec = 0;
    var bTime = bombTime;
    var text = "";
    while (bTime >= 60) {
        bTime -= 60;
        min++;
        if (min >= 59 && bTime >= 60) {
            text = "59:59";
        }
    }
    sec = bTime;
    if (sec < 10) {
        if (sec >= 0) {
            text = min + ":" + "0" + sec;
        }
    } else {
        text = min + ":" + sec;
    }
    bombTime--;
    if (sec < 0 && min <= 0) {
        resetLevel2();
    }
    timer = document.getElementsByClassName('timer')[0];
    timer.innerHTML = text;
    // If timer on bomb is pressed, bomb automatically 'explodes'
    // (Makes user level1 solution not apply)
    timer.onclick = kaboom;
    // call makeTimer() every 1 second
    setTimeout(function() {makeTimer();}, 1000);
    return true;
}
/**
* extendBombString(event) - Allows bomb string to change size on mouse drag
*/
function extendBombString(event) {
    var nPos = getEventLocation(this, event);
    if (nPos.y < oldPos) {
        stringHeight = 300 - nPos.y;
        bombStringY = nPos.y;
        // Update time based on string length
        bombTime = parseInt((stringHeight) / 8) - 10;
    }
}
/**
* onMouseUp() - Removes canvas event listener to allow for full mouse use
*/
function onMouseUp() {
    canvas.removeEventListener('mousemove', extendBombString, false);
    canvas.removeEventListener('mouseUp', onMouseUp, false);
}
/**
* drawBomb(ctx, width, iHeight, clHeight) -
* - Creates bomb on canvas, complete with decreasing string + fire to make
*   it look 'live'
* - Adds mouse functions on canvas for user to keep bomb from exploding
*/
function drawBomb(ctx, width, iHeight, clHeight) {
    ctx.beginPath();
    ctx.fillStyle = "tan";
    clearHeight = clHeight;
    //ctx.fillRect(bombStringX-3.5, bombStringY, width, height);
    if (clearHeight <= iHeight) {
        // Makw bomb string
        ctx.clearRect(bombStringX-30, 0, width+50, stringHeight+200);
        ctx.fillRect(bombStringX-3.5, bombStringY+clearHeight, width, iHeight);
        // Make fire on string
        ctx.fillStyle = "#ff2c00";
        ctx.moveTo(bombStringX, (bombStringY -27.5)+clearHeight);
        ctx.lineTo(bombStringX+6.25, (bombStringY-21.875)+clearHeight);
        ctx.lineTo(bombStringX+11.25, (bombStringY-22.5)+clearHeight);
        ctx.lineTo(bombStringX+10, (bombStringY-16.25)+clearHeight);
        ctx.lineTo(bombStringX+16.25, (bombStringY-12.5)+clearHeight);
        ctx.lineTo(bombStringX+10, (bombStringY-8.75)+clearHeight);
        ctx.lineTo(bombStringX+11.25, (bombStringY-5)+clearHeight);
        ctx.lineTo(bombStringX+6.25, (bombStringY-4.375)+clearHeight);
        ctx.lineTo(bombStringX+4.375, (bombStringY)+clearHeight);
        ctx.lineTo(bombStringX, (bombStringY)+clearHeight);
        ctx.lineTo(bombStringX-4.375, (bombStringY)+clearHeight);
        ctx.lineTo(bombStringX-6.25, (bombStringY-4.375)+clearHeight);
        ctx.lineTo(bombStringX-11.25, (bombStringY-5)+clearHeight);
        ctx.lineTo(bombStringX-10, (bombStringY-8.75)+clearHeight);
        ctx.lineTo(bombStringX-16.25, (bombStringY-12.5)+clearHeight);
        ctx.lineTo(bombStringX-10, (bombStringY-16.25)+clearHeight);
        ctx.lineTo(bombStringX-11.25, (bombStringY-22.5)+clearHeight);
        ctx.lineTo(bombStringX-6.25, (bombStringY-21.875)+clearHeight);
        ctx.lineTo(bombStringX, (bombStringY-27.5)+clearHeight);
        ctx.fill();
        clearHeight++;
    }
    ctx.beginPath();
    ctx.fillStyle = 'black';
    // Make bomb on canvas
    ctx.rect(80, 225, 37.5, 5);
    ctx.arc(100, 300, 75, 0, 2 * Math.PI);
    ctx.fill();
    // Make bomb 'explode' if time runs out
    if (bombTime < 0) {
        clearHeight = iHeight+1;
        kaboom();
        return true;
    }
    // Allow user to change bomb string upon click/drag of flame
    canvas.addEventListener("mousedown", function(event) {
      var pos = getEventLocation(this, event);
      if (pos.y < 5) {
        pos.y = 10;
      }
      if (oldPos > pos.y) {
        oldPos = pos.y;
      }
      // Get color of pixel
      var pixelData = ctx.getImageData(pos.x, pos.y, 1,1).data;
      var hex = "#" + ("000000" + rgbToHex(pixelData[0], pixelData[1], pixelData[2])).slice(-6);
      // If pixel is bomb flame color, user must be clicking on bomb flame
      if (hex == "#ff2c00") {
          canvas.addEventListener('mousemove', extendBombString, false);
          canvas.addEventListener('mouseup', onMouseUp, false);
      }
    }, false);
    // Call drawBomb() frequently to simulate animation
    setTimeout(function() {drawBomb(ctx, width, stringHeight, clearHeight)}, 173);
}
/**
* rgbToHex(r, g, b) - converts rgb color to usable hex value
*/
function rgbToHex(r, g, b) {
    return ((r << 16) | (g << 8) | b).toString(16);
}
/**
* makeFormWork() - Helper function for form, allows checking of values for math Problems
                 - If answers are correct, advance to level3
                 - loseBrain() otherwise
*/
function makeFormWork() {
    var m = document.querySelector('.math');
    m.addEventListener('submit', (e) => {
    e.preventDefault();
    var a1 = probNumbers[0] + probNumbers[1];
    var a2 = probNumbers[2] - probNumbers[3];
    var a3 = probNumbers[4] + probNumbers[5];
    var a4 = probNumbers[6] - probNumbers[7];
    var a5 = probNumbers[8] + probNumbers[9];
    var a6 = probNumbers[10] - probNumbers[11];
    var a7 = probNumbers[12] + probNumbers[13];
    var a8 = probNumbers[14] - probNumbers[15];
    var answer = document.getElementsByClassName('answer');
    if ((parseInt(answer[0].value) == a1) &&
        (parseInt(answer[1].value) == a2) &&
        (parseInt(answer[2].value) == a3) &&
        (parseInt(answer[3].value) == a4) &&
        (parseInt(answer[4].value) == a5) &&
        (parseInt(answer[5].value) == a6) &&
        (parseInt(answer[6].value) == a7) &&
        (parseInt(answer[7].value) == a8)) {
         bombTime = 5;
         level3();
     } else {
         kaboom();
     }
  });
}

// lEVEL 2 / 3 HELPER FUNCTIONS

/**
 * getElementPosition(obj) - Return the location of the element (x,y) being relative to the document.
 * Heavy inspiration from
 * https://ourcodeworld.com/articles/read/185/how-to-get-the-pixel-color-from-a-canvas-on-click-or-mouse-event-with-javascript
 */
function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}
/**
 * getEventLocation(element, event) - return the location of the click
 *                                    relative to the given element
 * Heavy inspiration from
 * https://ourcodeworld.com/articles/read/185/how-to-get-the-pixel-color-from-a-canvas-on-click-or-mouse-event-with-javascript
 */
function getEventLocation(element,event){
    // Relies on the getElementPosition function.
    var pos = getElementPosition(element);
    return {
    	  x: (event.pageX - pos.x),
      	y: (event.pageY - pos.y)
    };
}

// LEVEL 2

/**
* level2() - This level has the user complete simple math problems before the canvas
*            bomb explodes. The only way (unless you're incredibly fast) to do This
*            is to click and drag on the bomb string flame to give you more time
*          - Calls helper functions to make bomb, bomb timer, form, and general level2
*            outline
*/
function level2() {
    display.setAttribute("style", "background-image: url(\"images/brain.png\");");
    display.innerHTML = "<h1 id=\"level\">LEVEL 2</h1>";
    display.innerHTML += "<h2 id=\"numLives\">" + lives + "</h2>";
    display.innerHTML += "<p id=\"lev2\">Complete the Math Problems Before the Bomb Explodes!</p>";
    display.innerHTML += "<div class='timer'></div>"
    display.innerHTML += "<canvas id='bomb' width='200' height='375'></canvas>";
    canvas = document.querySelector('canvas');
    var ctx2 = canvas.getContext("2d");
    makeTimer();
    var stringWidth = 7;
    stringHeight = 30;
    display.appendChild(makeForm());
    // helper function for form
    makeFormWork();
    drawBomb(ctx2, stringWidth, stringHeight, clearHeight);
}

// LEVEL 3 HELPER FUNCTIONS

/**
* updateCanvas() - Adds mouse up/down/move functions to allow canvas image dragging
*                  Adds canvas interaction based off of the choice and location of dragged images
*/
function updateCanvas(ctx) {
  /**
  * mouseDown (level3) - Gets coordinates of mouse click and gathers useful information for
                       - mouseMove if user clicked on one of the food images
  }
  */
  canvas.addEventListener('mousedown', function(event) {
    oldPos = getEventLocation(this, event);
    var pos = getEventLocation(this, event);
    isDraggable = true;
    // checks what image user clicked on, if any
    // and updates position and 'selected' variables accordingly
    if (pos.x >= 355 && pos.x <= 445 && pos.y >= 200 && pos.y <= 280) {
        oldPos.x = 355;
        oldPos.y = 200;
        selected = "broccoli";
    }
    if (pos.x >= 355 && pos.x <= 445 && pos.y >= 290 && pos.y <= 370) {
        oldPos.x = 355;
        oldPos.y = 290;
        selected = "pizza";
    }
    if (pos.x >= 355 && pos.x <= 445 && pos.y >= 380 && pos.y <= 460) {
        oldPos.x = 355;
        oldPos.y = 380;
        selected = "chicken";
    }
    if (pos.x >= 450 && pos.x <= 530 && pos.y >= 200 && pos.y <= 280) {
        oldPos.x = 450;
        oldPos.y = 200;
        selected = "burger"
    }
    if (pos.x >= 545 && pos.x <= 625 && pos.y >= 290 && pos.y <= 370) {
        oldPos.x = 545;
        oldPos.y = 290;
        selected = "cheese";
    }
    if (pos.x >= 450 && pos.x <= 530 && pos.y >= 380 && pos.y <= 460) {
        oldPos.x = 450;
        oldPos.y = 380;
        selected = "apple";
    }
    if (pos.x >= 545 && pos.x <= 625 && pos.y >= 200 && pos.y <= 280) {
        oldPos.x = 545;
        oldPos.y = 200;
        selected = "milk";
    }
    if (pos.x >= 450 && pos.x <= 530 && pos.y >= 290 && pos.y <= 370) {
        oldPos.x = 450;
        oldPos.y = 290;
        selected = "steak";
    }
    if (pos.x >= 550 && pos.x <= 630 && pos.y >= 380 && pos.y <= 460) {
        oldPos.x = 550;
        oldPos.y = 380;
        // lets future functions know user turned bleach into cookies
        if (isCookie) {
            selected = "cookies";
        } else {
            selected = "bleach";
        }
    }
  }, false);
  /**
  * MouseMove (level3) - Provides dragging function for images by updating
  *                      and redrawing images on canvas
  */
  canvas.addEventListener('mousemove', function(event) {
      // Getting coordinates if image is still being dragged
      if (isDraggable) {
          newX = getEventLocation(this, event).x;
          newY = getEventLocation(this, event).y;
      }
      var ctx = canvas.getContext("2d");
      // Checking if user clicked on one of the food images
      if (selected != "") {
          ctx.clearRect(oldPos.x, oldPos.y, 80, 80);
      }
      // Draw all images in original place besides broccoli if selected
      // Draw broccoli in current mouse location
      if (selected == "broccoli") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(broccoli, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides burger if selected
      // Draw burger in current mouse location
      if (selected == "burger") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(burger, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(broccoli, 355, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides milk if selected
      // Draw milk in current mouse location
      if (selected == "milk") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(milk, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(broccoli, 355, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides pizza if selected
      // Draw pizza in current mouse location
      if (selected == "pizza") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(pizza, newX, newY);
          ctx.drawImage(broccoli, 355, 200);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides steak if selected
      // Draw steak in current mouse location
      if (selected == "steak") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(steak, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(broccoli, 355, 200);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides cheese if selected
      // Draw cheese in current mouse location
      if (selected == "cheese") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(cheese, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(broccoli, 355, 200);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides chicken if selected
      // Draw chicken in current mouse location
      if (selected == "chicken") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(chicken, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(broccoli, 355, 200);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides apple if selected
      // Draw apple in current mouse location
      if (selected == "apple") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(apple, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(broccoli, 355, 200);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(bleach, 550, 380);
          oldPos.x = newX;
          oldPos.y = newY;
      }
      // Draw all images in original place besides bleach if selected
      // Draw bleach/cookies in current mouse location
      if (selected == "bleach" || selected == "cookies") {
          ctx.drawImage(baby, 25, 220);
          ctx.drawImage(bleach, newX, newY);
          ctx.drawImage(pizza, 355, 290);
          ctx.drawImage(chicken, 355, 380);
          ctx.drawImage(burger, 450, 200);
          ctx.drawImage(cheese, 545, 290);
          ctx.drawImage(apple, 450, 380);
          ctx.drawImage(milk, 545, 200);
          ctx.drawImage(steak, 450, 290);
          ctx.drawImage(broccoli, 355, 200);
          oldPos.x = newX;
          oldPos.y = newY;
      }
  }, false);
  /**
  * mouseUp (level3) - Stops 'dragging' of image, checks where image was left and act accordingly
  *                  - If user feeded baby, then show baby's reaction based off of food choice
  */
  canvas.addEventListener('mouseup', function(event) {
      isDraggable = false; // Stops dragging function
      // If image is where baby is to feed, check what it is
      if (newX >= 25 && newX <= (baby.width)
      && newY >= 220 && newY <= (baby.height+220)) {
              var quote = document.getElementById('babyTalk');
              if (selected != "") {
                  // changing baby image
                  ctx = canvas.getContext("2d");
                  ctx.clearRect(newX, newY, 80, 80);
                  baby.src = "images/cryingbaby.png"; //assuming food is wrong
                  ctx.drawImage(baby, 25, 220);
                  brainLost = true;
                  // Selected sayings based off of dragged image
                  if (selected == "broccoli") {
                      quote.innerHTML = "<p>I HATE BROCCOLI!</p>";
                  } else if (selected == "burger") {
                      quote.innerHTML = "<p>A burger? GROSS!</p>";
                  } else if (selected == "milk") {
                      quote.innerHTML = "<p>Cow Milk? DISGUSTING!</p>";
                  } else if (selected == "pizza") {
                      quote.innerHTML = "<p>Pizza? More like no thanks!</p>";
                  } else if (selected == "steak") {
                      quote.innerHTML = "<p>HOW CAN I EAT THIS!?</p>";
                  } else if (selected == "cheese") {
                      quote.innerHTML = "<p>Cheese? Really?</p>";
                  } else if (selected == "chicken") {
                      quote.innerHTML = "<p>I could choke on that!</p>";
                  } else if (selected == "apple") {
                      quote.innerHTML = "<p>Don't make the doctor go away!</p>";
                  } else if (selected == "bleach") {
                      quote.innerHTML = "<p>WHAT IS WRONG WITH YOU!?</p>";
                  } else if (selected == "cookies") {
                      // changing baby to happy
                      baby.src = "images/happybaby.png";
                      ctx.clearRect(newX, newY, 200, 200);
                      ctx.drawImage(baby, 30, 220);
                      quote.innerHTML = "<p>Cookies? YUM! Thank you!</p>";
                      brainLost = false; // brain wasn't lost here
                      gameWon = true; // You won!
                      setTimeout(function() {alert("Congratulations!");}, 1000);
                  }
              }
          }
          if (brainLost) {
              // let user know they lost a brain, then restart
              setTimeout(function() { loseBrain();}, 850);
              setTimeout(function() {level3();}, 830);
          } else {
              // user completes game
              if (gameWon) {
                  setTimeout(function() {youWin();}, 1000);
              // reset all images back to original locations
              } else {
                  level3();
              }
          }
      // 'unselect' food
      selected = "";
      // user already lost brain, reset
      brainLost = false;
  });
}

// LEVEL 3

/**
* level3() - Asks user to "Feed the baby" - All 'attempts' to do so will lose a brain unless user feeds baby cookies
           - "Feeding" process done through dragging and dropping canvas images
*/
function level3() {
    display.setAttribute("style", "background-image: url(\"images/level3.png\");");
    display.innerHTML = "<h1 id=\"level\">LEVEL 3</h1>";
    display.innerHTML += "<h2 id=\"numLives\">" + lives + "</h2>";
    display.innerHTML += "<p id=\"lev3\">Feed the Baby!</p>";
    display.innerHTML += "<div id=\"babyTalk\"><p>I'm hungry!</p></div>";
    display.innerHTML += "<canvas id='food' width='650' height='478'></canvas>";
    canvas = document.querySelector('canvas');
    var ctx2 = canvas.getContext("2d");
    // Draw all images onto canvas
    baby = new Image();
    baby.src = 'images/baby.png';
    baby.onload = function() {
        ctx2.drawImage(baby, 25, 220);
    }
    broccoli = new Image();
    broccoli.src = 'images/broccoli.jpg';
    broccoli.onload = function() {
        ctx2.drawImage(broccoli, 355, 200);
    }
    pizza = new Image();
    pizza.src = 'images/pizza.png';
    pizza.onload = function() {
        ctx2.drawImage(pizza, 355, 290);
    }
    chicken = new Image();
    chicken.src = 'images/chicken.jpg';
    chicken.onload = function() {
        ctx2.drawImage(chicken, 355, 380);
    }
    burger = new Image();
    burger.src = 'images/burger.png';
    burger.onload = function() {
        ctx2.drawImage(burger, 450, 200);
    }
    cheese = new Image();
    cheese.src = 'images/cheese.png';
    cheese.onload = function() {
        ctx2.drawImage(cheese, 545, 290);
    }
    apple = new Image();
    apple.src = 'images/apple.jpg';
    apple.onload = function() {
        ctx2.drawImage(apple, 450, 380);
    }
    milk = new Image();
    milk.src = 'images/milk.png';
    milk.onload = function() {
        ctx2.drawImage(milk, 545, 200);
    }
    steak = new Image();
    steak.src = 'images/steak.jpg';
    steak.onload = function() {
        ctx2.drawImage(steak, 450, 290);
    }
    bleach = new Image();
    bleach.src = 'images/bleach.jpg';
    bleach.onload = function() {
        ctx2.drawImage(bleach, 550, 380);
    }
    // Add function that changes bleach image to cookies on click of cookie link
    cookiesLink = document.querySelector('a');
    cookiesLink.href = "#";
    cookiesLink.onclick = function() {
        bleach.src = 'images/cookies.jpg';
        isCookie = true;
    }
    // update the canvas based off of user interaction
    updateCanvas(ctx2);
}

// LOSEBRAIN + GAME WIN/LOSE FUNCTIONS

/**
* loseBrain() - function decreases global 'lives' variable and updates corresponding
*               HTML. If lives reaches 0 gameOver() function is called. Function is
*               called when user has incorrect level attempt.
*/
function loseBrain() {
    lives--;
    var numBrains = document.getElementById('numLives');
    numBrains.innerHTML = lives;
    alert("You lost a brain!");
    if (lives == 0) {
        gameOver();
    }
}
/**
* gameOver() - function effectively ends the game, and is triggered when global 'lives'
*              variable reaches 0. Has 'play again' button if user wants to restart game
*/
function gameOver() {
    display.setAttribute("style", "background-image: url(\"images/gameover.png\");");
    display.innerHTML = "<button class='playagain' onClick='window.location.reload();'>PLAY AGAIN</button>"
}
/**
* youWin() - Executed upon completion of level 3
*          - Lets user know they are 'big brain' and allows them to replay game
*/
function youWin() {
  display.setAttribute("style", "background-image: url(\"images/youwin.png\");");
  display.innerHTML = "<button class='playagain' onClick='window.location.reload();'>PLAY AGAIN</button>"
}
