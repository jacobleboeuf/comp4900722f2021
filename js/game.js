var lives = 3;
var play = document.querySelector('.play');
var display = document.getElementById("game");
var time = document.createElement('div');
time.className = 'time';
var ampm;
var newText;
let canvas, ctx, radius;
var currDate;
var timeStopped = false;
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
// https://www.w3schools.com/graphics/canvas_clock.asp
function drawClock() {
  drawFace(ctx, radius);
  drawNumbers(ctx, radius);
  if (timeStopped) {
      drawTime(ctx, radius, currDate);
  } else {
      drawTime(ctx, radius, new Date());
  }
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();

  grad = ctx.createRadialGradient(0, 0 ,radius * 0.95, 0, 0, radius * 1.05);
  grad.addColorStop(0, 'black');
  grad.addColorStop(1, 'black');
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius*0.1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
}
function drawNumbers(ctx, radius) {
  var ang;
  var num;
  ctx.font = "bold " + radius * 0.15 + "px arial";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for(num = 1; num <= 12; num++){
    ang = num * Math.PI / 6;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.85);
    ctx.rotate(-ang);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(ang);
    ctx.translate(0, radius * 0.85);
    ctx.rotate(-ang);
  }
}
function drawTime(ctx, radius, now){
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  //hour
  hour = hour%12;
  hour = (hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
  drawHand(ctx, hour, radius*0.5, radius*0.07);
  //minute
  minute = (minute*Math.PI/30)+(second*Math.PI/(30*60));
  drawHand(ctx, minute, radius*0.8, radius*0.07);
  // second
  second = (second*Math.PI/30);
  drawHand(ctx, second, radius*0.9, radius*0.02);
}
function addzero(s) {
  if (s.length == 1) {
    s = "0" + s;
  }
  return s;
}
function drawHand(ctx, pos, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0,0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
function displayTime() {
    var d = new Date();
    if (!timeStopped) {
        currDate = d;
    } else {
        d = currDate;
    }
    ampm = "AM";
    var hrs = d.getHours();
    if (hrs > 12) {
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
    var date = hours + ":" +  minutes + ":" +  seconds + "." + milliseconds + " " + ampm;
    time.innerHTML = date;
    refreshTime();
}
function refreshTime() {
    var refresh = 1;
    mytime = setTimeout('displayTime()', refresh);
}
function stopClocks() {
    timeStopped = true;
    currDate = new Date();
}
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
            if (h == currDate.getHours() || h == (currDate.getHours() - 12)) {
                level2();
            } else {
                display.innerHTML = h;
                loseBrain();
            }
        } else {
            if ((h == currDate.getHours())) {
                level2();
            } else {
              loseBrain();
            }
        }
    });
}
/*function checkLevel1() {
    checkLevel1.preventDefault();
    var h = document.querySelector('hours');
    var m = document.getElementsByClassName('minutes').value;
    var s = document.getElementsByClassName('seconds').value;
    var ms = document.getElementsByClassName('milliseconds').value;
    if (ampm == "PM") {
        if (h == currDate.getHours() || h == (currDate.getHours() - 12)) {
            level2();
        } else {
            display.innerHTML = h;
            loseBrain();
        }
    } else {
        if ((h == currDate.getHours())) {
            level2();
        } else {
          display.innerHTML = h;
          display.innerHTML += currDate.getHours();
          loseBrain();
        }
    }
}
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
function level2() {
    display.setAttribute("style", "background-image: url(\"images/brain.png\");");
    display.innerHTML = "<h1 id=\"level\">LEVEL 2</h1>";
    display.innerHTML += "<h2 id=\"numLives\">" + lives + "</h2>";
}
function gameOver() {
    display.setAttribute("style", "background-image: url(\"images/gameover.png\");");
    display.innerHTML = "<button class='playagain' onClick='window.location.reload();'>PLAY AGAIN</button>"
}
