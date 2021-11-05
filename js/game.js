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
 * Jacob Leboeuf, UMass Lowell Computer Science, jacob_leboeuf@student.uml.edu,
 * Copyright (c) 2021 by Jacob. All rights reserved. May be freely copied or
 * excerpted for educational purposes with credit to the author.
 * updated by JL on November 5, 2021 at 12:12 AM
**/
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
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    minutes = (minutes * Math.PI / 30) + (seconds * Math.PI / (30 * 60));
    drawHand(ctx, minutes, radius * 0.8, radius * 0.07);
    seconds = (seconds * Math.PI / 30);
    drawHand(ctx, seconds, radius * 0.9, radius * 0.02);
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
        hrs -= 12;
        ampm = "PM";
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
    iCanvas = document.createElement('canvas');
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
                level2();
            } else {
                loseBrain();
            }
        } else {
            if (h == currDate.getHours() && m == currDate.getMinutes()
                && s == currDate.getSeconds() && ms == currDate.getMilliseconds()) {
                level2();
            } else {
              loseBrain();
            }
        }
    });
}
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
* level2() -
*/
function level2() {
    display.setAttribute("style", "background-image: url(\"images/brain.png\");");
    display.innerHTML = "<h1 id=\"level\">LEVEL 2</h1>";
    display.innerHTML += "<h2 id=\"numLives\">" + lives + "</h2>";
}
/**
* level3() -
*/
function level3() {
    display.setAttribute("style", "background-image: url(\"images/brain.png\");");
    display.innerHTML = "<h1 id=\"level\">LEVEL 3</h1>";
    display.innerHTML += "<h2 id=\"numLives\">" + lives + "</h2>";
}
/**
* gameOver() - function effectively ends the game, and is triggered when global 'lives'
*              variable reaches 0. Has 'play again' button if user wants to restart game
*/
function gameOver() {
    display.setAttribute("style", "background-image: url(\"images/gameover.png\");");
    display.innerHTML = "<button class='playagain' onClick='window.location.reload();'>PLAY AGAIN</button>"
}
