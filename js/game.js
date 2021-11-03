var lives = 3;
var play = document.querySelector('.play');
var display = document.getElementById("game");
var newText;
play.addEventListener("click", showRules);
function showRules() {
  display.setAttribute("style", "background-image: none;");
  display.innerHTML = "<h1 id=\"rules\">DA RULEZ</h1>";
  display.innerHTML += "<p>The rules are simple:</p>"
  var rules = document.createElement("ol");
  var rule = document.createElement("li");
  newText = document.createTextNode('Get through the various levels to prove you are BIG BRAIN');
  rule.appendChild(newText);
  rules.appendChild(rule);
  rule = document.createElement("li");
  newText = document.createTextNode('If you fail to pass a level, you will lose a brain');
  rule.appendChild(newText);
  rules.appendChild(rule);
  rule = document.createElement("li");
  newText = document.createTextNode('You have 3 brains. If you run out of brains, you are LAME');
  rule.appendChild(newText);
  rules.appendChild(rule);
  display.appendChild(rules);
  display.innerHTML += "<p> Are you ready? Click 'begin' to begin!</p>";
  var button = document.createElement("button");
  button.className = 'play';
  button.innerHTML = "BEGIN";
  button.addEventListener("click", level1);
  display.appendChild(button);
}
function level1() {
  display.setAttribute("style", "background-image: url(\"images/brain.png\");")
  display.innerHTML = "<h1>LEVEL 1</h1>";
  display.innerHTML += "<h1 id=\"numLives\">" + lives + "</h1>";
}
