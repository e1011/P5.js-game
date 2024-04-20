function setup() {
  createCanvas(1600, 800);
  angleMode(DEGREES);
  textAlign(CENTER);
}
var colorScheme = "Meadow";
var FOV = 90; // field of view, larger FOVs may cause warping. does not affect lag
var graphics = 550; // number of rays cast. larger number is more detailed, may cause more lag
var Xsens = 0;
var Ysens = 0;
var gameMode = "Menu"; // can be set to debug, menu, or game
var maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];
var spawnWaves = [
  [0],
  [0, 0, 0, 0, 0],
  [1, 1],
  [0, 0, 0, 0, 0, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [0, 0, 1, 1, 1, 2, 2, 2, 2],
  [3, 3, 3],
  [1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 1, 1, 4, 4, 4, 4],
  [2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [3, 3, 3, 3, 3, 5, 5, 5],
  [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5],
  [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1],
  [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], 
  [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5],
  [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
];
// stores multiple ray arrays each with 0 = distance, 1 = x display, 2 = line height up, 3 = line height down, 4 = shading 1, 5 = shading 2, 6 = shading 3, 7 = stroke weight, 8 = id, 9 = shot
var rays = [];
// the enemies array stores multiple enemy arrays each with 0 = x, 1 = y, 2 = angle, 3 = distance, 4 = display angle x, 5 = display angle y, 6 = display size, 7 = type, 8 = id, 9 = shot, 10 = health, 11 = color 1, 12 = color 2, 13 = color 3, 14 = speed, 15 = damage, 16 = size, 17 = max health
var enemies = [];
// 0 = x, 1 = y, 2 = recoil, 3 = firing interval, 4 = ammo, 5 = reloading state, 6 = ammo limit, 7 = gun efficiency (reload, firing, recoil recovering rate), 8 = recoil limit, 9 = recoil rate, 10 = bullet
var gun = [undefined, undefined, 0, 0, 180, false, 180, 2, 50, 10, false];
// 0 = x posision, 1 = y position, 2 = x angle, 3 = y angle, 4 = health
var player = [120, 120, 0, 0, 100];
var keys = [];
var menuOptions = ["Instructions", "Campaign", "Survival", "Settings"];
var colorSchemes = {
  // stores color schemes, 1 = sky color, 2 = wall color, 3 = shading color, 4 = floor color
  Cardboard: [
    [229, 176, 127],
    [204, 151, 102],
    [178, 125, 76],
    [153, 100, 51],
  ],
  Meadow: [
    [135, 206, 235],
    [189, 199, 196],
    [128, 132, 135],
    [50, 140, 49],
  ],
  Ocean: [
    [41, 132, 141],
    [96, 101, 46],
    [77, 81, 37],
    [168, 143, 89],
  ],
  Underworld: [
    [55, 0, 0],
    [50, 0, 0],
    [40, 0, 0],
    [35, 0, 0],
  ],
  Arctic: [
    [195, 231, 253],
    [242, 242, 237],
    [176, 190, 197],
    [242, 242, 237],
  ],
  Jungle: [
    [16, 68, 54],
    [68, 48, 34],
    [54, 38, 27],
    [12, 51, 41],
  ],
  Desert: [
    [154, 220, 255],
    [232, 187, 154],
    [228, 173, 133],
    [223, 159, 113],
  ],
  Shadow: [
    [50, 50, 50],
    [30, 30, 30],
    [15, 15, 15],
    [5, 5, 5],
  ],
  City: [
    [12, 20, 69],
    [100, 100, 100],
    [75, 75, 75],
    [50, 50, 50],
  ],
  Arcade: [
    [252, 76, 2],
    [255, 255, 0],
    [0, 255, 0],
    [70, 52, 167],
  ],
  Painting: [
    [216, 216, 204],
    [106, 44, 51],
    [12, 57, 79],
    [21, 13, 9],
  ],
  Sky: [
    [12, 20, 69],
    [104, 104, 125],
    [71, 71, 90],
    [12, 20, 69],
  ],
};
var cCursor = [800, 400];
var wave = 1;
var waveStart = true;
var kills = 0;

function mousePressed() {
  requestPointerLock();
}
function distance(x1, y1, x2, y2) {
  return sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
function rotatedrect(degrees, xpos, ypos, l, w) {
  // make a rotated rectangle
  xpos += l / 2;
  ypos += w / 2;
  rectMode(CENTER);
  translate(xpos, ypos);
  rotate(degrees);
  rect(0, 0, l, w);
  rotate(-degrees);
  translate(-xpos, -ypos);
  rectMode(CORNER);
}
function collide(x, y) {
  // check if a given point is inside a wall
  if (maze[floor(y / 80)][floor(x / 80)] == 1) {
    return true;
  } else {
    return false;
  }
}
function angleCheck(a) {
  if (a > 360) {
    a %= 360;
  }
  if (a < 0) {
    a += 360;
  }
  return a;
}
function moveX(amount) {
  // move player to side
  if (player[2] == 180 || player[2] == 0) {
    player[0] += amount;
  } else if (player[2] > 180) {
    player[0] +=
      (tan(player[2] - 90) * amount) / distance(0, 0, tan(player[2] - 90), 1);
    player[1] -= (1 * amount) / distance(0, 0, tan(player[2] - 90), 1);
  } else {
    player[0] -=
      (tan(player[2] - 90) * amount) / distance(0, 0, tan(player[2] - 90), 1);
    player[1] += (1 * amount) / distance(0, 0, tan(player[2] - 90), 1);
  }
}
function moveY(amount) {
  // move player forwards or backwards
  if (player[2] == 270 || player[2] == 90) {
    player[1] += amount;
  } else if (player[2] > 270 || player[2] < 90) {
    player[0] -= (tan(player[2]) * amount) / distance(0, 0, tan(player[2]), 1);
    player[1] += (1 * amount) / distance(0, 0, tan(player[2]), 1);
  } else {
    player[0] += (tan(player[2]) * amount) / distance(0, 0, tan(player[2]), 1);
    player[1] -= (1 * amount) / distance(0, 0, tan(player[2]), 1);
  }
}
function maintenance() {
  // recoil
  if (gun[2] > 0) {
    gun[2] -= gun[7];
  }
  if (gun[2] > gun[8]) {
    gun[2] = gun[8];
  }
  // firing interval
  if (gun[3] > 0) {
    gun[3] -= gun[7];
  }
  if (gun[3] < 0) {
    gun[3] = 0;
  }
  // reloading
  if (gun[5] && gun[4] != gun[6]) {
    gun[4] += gun[7];
  }
  if (gun[4] >= gun[6]) {
    gun[4] = gun[6];
    gun[5] = false;
  }
  // heal if not dead, if dead then re-initialize
  if (player[4] <= 0) {
    gameMode = "Death";
    player = [120, 120, 0, 0, 100];
    enemies = [];
    rays = [];
    waveStart = true;
    kills = 0;
    gun = [undefined, undefined, 0, 0, 180, false, 180, 2, 50, 10, false];
  } else if (player[4] < 100) {
    player[4] += 0.05;
  }
  if (player[4] >= 100) {
    player[4] = 100;
  }
}
function overlay() {
  if (gameMode == "Campaign") {
    noStroke();
    textSize(25);
    fill(0, 0, 0);
    text("Wave: " + wave, 800, 40);
  } else if (gameMode == "Survival") {
    noStroke();
    textSize(25);
    fill(0, 0, 0);
    text("Kills: " + kills, 800, 40);
  }

  // draws crosshair
  stroke(0, 0, 0);
  strokeWeight(10);
  point(width / 2, 400);
  strokeWeight(3);
  line(width / 2 - 25 - 2 * gun[2], 400, width / 2 - 15 - 2 * gun[2], 400);
  line(width / 2 + 15 + 2 * gun[2], 400, width / 2 + 25 + 2 * gun[2], 400);
  line(width / 2, 375 - 2 * gun[2], width / 2, 385 - 2 * gun[2]);
  line(width / 2, 415 + 2 * gun[2], width / 2, 425 + 2 * gun[2]);

  // draws explosion if recently fired gun
  if (gun[3] > 2) {
    strokeWeight(5);
    stroke(250, 237, 39);
    line(width / 2, 550 + gun[2], gun[0], gun[1]);
    noStroke();
    fill(255, 199, 0);
    ellipse(width / 2, 550 + gun[2], 100, 100);
  }

  // draws gun
  noStroke();
  fill(136, 139, 141);
  triangle(
    width / 2 - 100,
    801 + gun[2],
    width / 2 + 100,
    801 + gun[2],
    width / 2 - 25,
    560 + gun[2]
  );
  triangle(
    width / 2 - 100,
    801 + gun[2],
    width / 2 + 100,
    801 + gun[2],
    width / 2 + 25,
    560 + gun[2]
  );
  strokeWeight(50);
  stroke(136, 139, 141);
  line(width / 2, 563 + gun[2], width / 2, 800 + gun[2]);
  noStroke();
  fill(83, 86, 90);
  quad(
    width / 2 - 75,
    790 + gun[2],
    width / 2 + 75,
    790 + gun[2],
    width / 2 + 40,
    660 + gun[2],
    width / 2 - 40,
    660 + gun[2]
  );
  quad(
    width / 2 - 35,
    640 + gun[2],
    width / 2 + 35,
    640 + gun[2],
    width / 2 + 23,
    590 + gun[2],
    width / 2 - 23,
    590 + gun[2]
  );
  quad(
    width / 2 - 20,
    580 + gun[2],
    width / 2 + 20,
    580 + gun[2],
    width / 2 + 15,
    560 + gun[2],
    width / 2 - 15,
    560 + gun[2]
  );
  stroke(83, 86, 90);
  strokeWeight(4);
  line(width / 2 - 15, 550 + gun[2], width / 2 + 15, 550 + gun[2]);
  line(width / 2 - 15, 550 + gun[2], width / 2 - 15, 530 + gun[2]);
  line(width / 2 - 15, 530 + gun[2], width / 2 - 8, 530 + gun[2]);
  line(width / 2 + 15, 550 + gun[2], width / 2 + 15, 530 + gun[2]);
  line(width / 2 + 15, 530 + gun[2], width / 2 + 8, 530 + gun[2]);
  line(width / 2, 535 + gun[2], width / 2, 542 + gun[2]);

  // display ammo
  noStroke();
  fill(255, 255, 255, 100);
  rect(width - 200, 700, 200, 100, 5);
  fill(0, 0, 0);
  textSize(50);
  text(floor(gun[4]) + "/" + gun[6], width - 100, 770);
  if (gun[4] == 0 && !gun[5]) {
    textSize(25);
    text("Press 'r' to Reload", width / 2, 685);
  }

  // draw health and wounds
  noStroke();
  fill(255, 0, 0, 100);
  rect(0, 700, 200, 100, 5);
  textSize(50);
  fill(0, 0, 0);
  text(floor(player[4]) + "/100", 100, 770);

  if (player[4] < 30) {
    textSize(30);
    fill(255, 0, 0);
    text("Low Health, Seek Cover Now", width / 2, 75);
  }
  if (player[4] < 50) {
    stroke(255, 0, 0, 100);
    strokeWeight(random(25 - player[4] / 2, 75 - player[4] * 1.5));
    fill(0, 0, 0, 0);
    rect(0, 0, width, 800);
    noStroke();
    fill(255, 0, 0, (75 * (50 - player[4])) / 50);
    rect(0, 0, width, 800);
  }
}
function shoot() {
  gun[0] = random(width / 2 - 2 * gun[2], width / 2 + 2 * gun[2]);
  gun[1] = random(400 - 2 * gun[2], 400 + 2 * gun[2]);
  gun[2] += gun[9];
  gun[3] = 5;
  gun[4] -= 1;
  gun[10] = true;
}
function castRays() {
  rays = [];
  var anglecount = 0; // counts how many angles have been checked
  for (
    var i = player[2] - FOV / 2;
    i < player[2] + FOV / 2;
    i += FOV / graphics
  ) {
    anglecount += 1;
    var ray = i;
    ray = angleCheck(ray);
    var checkX = 0; // check vertical collisions
    var checkY = 0;
    var checkIncrementX = 0;
    var checkIncrementY = 0;
    var count = 0;
    var infinite = false;
    var d1 = [];
    var d2 = [];
    if (ray == 270 || ray == 90) {
      // goes on forever, straight sideways
      count = 10;
      infinite = true;
    } else if (ray > 270 || ray < 90) {
      // looking upwards, setup start pos and increment
      checkX =
        player[0] +
        tan(ray) * (abs(player[1]) - abs(floor(player[1] / 80) * 80));
      checkY = floor(player[1] / 80) * 80;
      checkIncrementX = 80 * tan(ray);
      checkIncrementY = -80;
    } else {
      // looking downwards, setup start pos and increment
      checkX =
        player[0] +
        tan(ray) * (abs(player[1]) - abs(ceil(player[1] / 80) * 80));
      checkY = ceil(player[1] / 80) * 80;
      checkIncrementX = -80 * tan(ray);
      checkIncrementY = 80;
    }

    while (count < 10) {
      // loop through vertical checks for each ray
      count += 1;
      if (checkX <= 800 && checkX >= 0 && checkY <= 800 && checkY >= 0) {
        if (collide(checkX, checkY) || collide(checkX, checkY - 1)) {
          break;
        }
      }
      checkX += checkIncrementX;
      checkY += checkIncrementY;
    }

    // assign distance to ray
    if (infinite) {
      d1.push(10000000);
    } else {
      d1.push(
        distance(player[0], player[1], checkX, checkY) * cos(player[2] - ray)
      );
    }

    d1.push(checkX);
    d1.push(checkY);

    checkX = 0; // check horizontal collisions (note that is now 90 minus angle because triangle is tilted on side, not straight up like vertical checks)
    checkY = 0;
    checkIncrementX = 0;
    checkIncrementY = 0;
    count = 0;
    infinite = false;

    if (ray == 180 || ray == 0) {
      // goes on forever, straight up
      count = 10;
      infinite = true;
    } else if (ray > 180) {
      // looking leftwards, setup start pos and increment
      checkX = floor(player[0] / 80) * 80;
      checkY =
        player[1] +
        tan(90 - ray) * (abs(player[0]) - abs(floor(player[0] / 80) * 80));
      checkIncrementX = -80;
      checkIncrementY = 80 * tan(90 - ray);
    } else {
      // looking rightwards, setup start pos and increment
      checkX = ceil(player[0] / 80) * 80;
      checkY =
        player[1] +
        tan(90 - ray) * (abs(player[0]) - abs(ceil(player[0] / 80) * 80));
      checkIncrementX = 80;
      checkIncrementY = -80 * tan(90 - ray);
    }

    while (count < 10) {
      // loop through horizontal checks for each ray
      count += 1;
      if (checkX <= 800 && checkX >= 0 && checkY <= 800 && checkY >= 0) {
        if (collide(checkX, checkY) || collide(checkX - 1, checkY)) {
          break;
        }
      }
      checkX += checkIncrementX;
      checkY += checkIncrementY;
    }

    // assign distance to ray
    if (infinite) {
      d2.push(10000000);
    } else {
      d2.push(
        distance(player[0], player[1], checkX, checkY) * cos(ray - player[2])
      );
    }
    d2.push(checkX);
    d2.push(checkY);

    // show rays for debug, or blocks if not
    if (gameMode == "Debug") {
      // find shortest line and draw it
      strokeWeight(3);
      if (d1[0] <= d2[0]) {
        stroke(255, 255, 0, 255 - 255 * (d1[0] / 1200));
        line(player[0], player[1], d1[1], d1[2]);
      } else {
        stroke(255, 255, 0, 255 - 255 * (d2[0] / 1200));
        line(player[0], player[1], d2[1], d2[2]);
      }
    } else {
      // find shortest line, shade based on horizontal/vertical
      if (d1[0] <= d2[0]) {
        rays.push([
          d1[0],
          width * (anglecount / graphics) - 2,
          400 + player[3] - ((width / height) * 1800000) / FOV / d1[0],
          400 + player[3] + ((width / height) * 1800000) / FOV / d1[0],
          colorSchemes[colorScheme][1][0],
          colorSchemes[colorScheme][1][1],
          colorSchemes[colorScheme][1][2],
          width / graphics + 1,
          0,
          false,
        ]);
      } else {
        rays.push([
          d2[0],
          width * (anglecount / graphics) - 2,
          400 + player[3] - ((width / height) * 1800000) / FOV / d2[0],
          400 + player[3] + ((width / height) * 1800000) / FOV / d2[0],
          colorSchemes[colorScheme][2][0],
          colorSchemes[colorScheme][2][1],
          colorSchemes[colorScheme][2][2],
          width / graphics + 1,
          0,
          false,
        ]);
      }
    }
  }
}
function playerControls() {
  // rotate player based on mouse
  player[2] += 0.5 * pow(5, Xsens) * movedX;
  player[2] = angleCheck(player[2]);
  player[3] -= (pow(5, Ysens) * movedY) / (FOV / 400);
  if (player[3] > 1200) {
    player[3] = 1200;
  }
  if (player[3] < -1200) {
    player[3] = -1200;
  }

  if (mouseIsPressed && mouseButton == LEFT) {
    // if interval is done, ammo exists, and not currently reloading
    if (gun[3] == 0 && gun[4] > 0 && !gun[5]) {
      shoot();
    }
  }

  // player movement and key presses (1.4 chosen because sqrt 2)
  if (keyIsDown) {
    // list to store active keys
    keyPressed = function () {
      keys[keyCode] = true;
    };
    keyReleased = function () {
      keys[keyCode] = false;
    };

    // r to reload
    if (keys[82] && gun[4] != gun[6]) {
      gun[4] = 0;
      gun[5] = true;
    }

    if ((keys[87] || keys[38]) && !(keys[83] || keys[40])) {
      if (keys[65] || keys[37]) {
        moveX(-1.4);
        moveY(-1.4);
      } //w+a
      else if (keys[68] || keys[39]) {
        moveX(1.4);
        moveY(-1.4);
      } //w+d
      else {
        moveY(-2);
      } //w
    } else if ((keys[83] || keys[40]) && !(keys[87] || keys[38])) {
      if (keys[65] || keys[37]) {
        moveX(-1.4);
        moveY(1.4);
      } //s+a
      else if (keys[68] || keys[39]) {
        moveX(1.4);
        moveY(1.4);
      } //s+d
      else {
        moveY(2);
      } //s
    } else {
      if (keys[65] || keys[37]) {
        moveX(-2);
      } //a
      if (keys[68] || keys[39]) {
        moveX(2);
      } //d
    }

    // collisions with walls
    if (collide(player[0], player[1] + 5)) {
      player[1] -= 2;
    }
    if (collide(player[0], player[1] - 5)) {
      player[1] += 2;
    }
    if (collide(player[0] + 5, player[1])) {
      player[0] -= 2;
    }
    if (collide(player[0] - 5, player[1])) {
      player[0] += 2;
    }
  }
}
function drawGrid() {
  background(255, 255, 255);
  stroke(0, 0, 0);
  strokeWeight(1);
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
      if (maze[j][i] == 1) {
        fill(50, 50, 50);
      } // j is y variable, i is x variable, loop through 2d array
      else {
        fill(255, 255, 255);
      }
      rect(i * 80, j * 80, 80, 80);
    }
  }
  stroke(255, 0, 0);
  strokeWeight(3);
  rotatedrect(player[2], player[0] - 25, player[1] - 25, 50, 50);
}
function drawLandscape() {
  noStroke();
  fill(
    colorSchemes[colorScheme][0][0],
    colorSchemes[colorScheme][0][1],
    colorSchemes[colorScheme][0][2]
  );
  rect(0, ((-1200 + player[3]) * height) / 800, width, 100000);
  fill(
    colorSchemes[colorScheme][3][0],
    colorSchemes[colorScheme][3][1],
    colorSchemes[colorScheme][3][2]
  );
  rect(0, ((400 + player[3]) * height) / 800, width, 100000);
}
function createEnemy(type) {
  if (type == 0) {
    enemies.push([
      720,
      720,
      0,
      0,
      0,
      0,
      0,
      type,
      1,
      false,
      10,
      100,
      100,
      100,
      1,
      0.2,
      10000,
      10,
    ]);
  } else if (type == 1) {
    enemies.push([
      720,
      720,
      0,
      0,
      0,
      0,
      0,
      type,
      1,
      false,
      75,
      204,
      182,
      162,
      0.75,
      1,
      30000,
      75,
    ]);
  } else if (type == 2) {
    enemies.push([
      720,
      720,
      0,
      0,
      0,
      0,
      0,
      type,
      1,
      false,
      5,
      0,
      0,
      0,
      1.5,
      0.2,
      5000,
      5,
    ]);
  } else if (type == 3) {
    enemies.push([
      720,
      720,
      0,
      0,
      0,
      0,
      0,
      type,
      1,
      false,
      2,
      255,
      0,
      0,
      2.5,
      0.3,
      3000,
      2,
    ]);
  }
  if (type == 4) {
    enemies.push([
      720,
      720,
      0,
      0,
      0,
      0,
      0,
      type,
      1,
      false,
      45,
      100,
      255,
      50,
      1.3,
      0.5,
      15000,
      45,
    ]);
  }
  if (type == 5) {
    enemies.push([
      720,
      720,
      0,
      0,
      0,
      0,
      0,
      type,
      1,
      false,
      30,
      150,
      0,
      150,
      1,
      0.5,
      20000,
      30,
    ]);
  }
}
function castEnemies() {
  // create enemies based on gamemode
  if (gameMode == "Campaign") {
    if (waveStart == true) {
      for (var i = 0; i < spawnWaves[wave - 1].length; i++) {
        createEnemy(spawnWaves[wave - 1][i]);
      }
      waveStart = false;
    } else if (enemies.length == 0) {
      wave += 1;
      player = [120, 120, 0, 0, 100];
      waveStart = true;
      gun = [undefined, undefined, 0, 0, 180, false, 180, 2, 50, 10, false];
    }
  } else if (gameMode == "Survival") {
    if (random(0, 100 - min(50, kills)) < 1) {
      createEnemy(floor(random(0, 6)));
    }
  }

  for (var i = 0; i < enemies.length; i++) {
    if (enemies[i][10] <= 0) {
      if (enemies[i][7] == 5) {
        for (var j = 0; j < 10; j++) {
          enemies.push([
            enemies[i][0],
            enemies[i][1],
            0,
            0,
            0,
            0,
            0,
            3,
            1,
            false,
            2,
            255,
            0,
            0,
            2.5,
            0.3,
            3000,
            2,
          ]);
        }
      }
      enemies.splice(i, 1);
      kills += 1;
      i -= 1;
      continue;
    }
    // heal green ones
    if (enemies[i][7] == 4 && enemies[i][10] < enemies[i][17]) {
      enemies[i][10] += 0.1;
    }
    if (enemies[i][7] == 4 && enemies[i][10] > enemies[i][17]) {
      enemies[i][10] = enemies[i][17];
    }

    // make them move towards the player
    if (distance(player[0], player[1], enemies[i][0], enemies[i][1]) > 15) {
      enemies[i][0] +=
        (enemies[i][14] * (player[0] - enemies[i][0])) /
        distance(player[0], player[1], enemies[i][0], enemies[i][1]);
      enemies[i][1] +=
        (enemies[i][14] * (player[1] - enemies[i][1])) /
        distance(player[0], player[1], enemies[i][0], enemies[i][1]);
    }

    // collisions with walls
    if (collide(enemies[i][0], enemies[i][1] + 2 * enemies[i][14])) {
      enemies[i][1] -= 1.5 * enemies[i][14];
    }
    if (collide(enemies[i][0], enemies[i][1] - 2 * enemies[i][14])) {
      enemies[i][1] += 1.5 * enemies[i][14];
    }
    if (collide(enemies[i][0] + 2 * enemies[i][14], enemies[i][1])) {
      enemies[i][0] -= 1.5 * enemies[i][14];
    }
    if (collide(enemies[i][0] - 2 * enemies[i][14], enemies[i][1])) {
      enemies[i][0] += 1.5 * enemies[i][14];
    }

    // collisions with other enemies, excluding self
    for (var j = 0; j < enemies.length; j++) {
      if (
        distance(enemies[i][0], enemies[i][1], enemies[j][0], enemies[j][1]) <
          enemies[j][16]/1000 &&
        distance(enemies[i][0], enemies[i][1], enemies[j][0], enemies[j][1]) !=
          0
      ) {
        enemies[i][0] -=
          (0.5 * (enemies[j][0] - enemies[i][0])) /
          distance(enemies[i][0], enemies[i][1], enemies[j][0], enemies[j][1]);
        enemies[i][1] -=
          (0.5 * (enemies[j][1] - enemies[i][1])) /
          distance(enemies[i][0], enemies[i][1], enemies[j][0], enemies[j][1]);
      }
    }

    if (gameMode == "Debug") {
      stroke(0, 0, 0);
      strokeWeight(3);
      fill(255, 0, 0);
      ellipse(enemies[i][0], enemies[i][1], 50, 50);
    } else {
      enemies[i][3] = distance(
        player[0],
        player[1],
        enemies[i][0],
        enemies[i][1]
      );
      if (enemies[i][3] < 25) {
        player[4] -= enemies[i][15];
      }
      // cast rays to each enemy
      // enemy to the right, set angle
      if (enemies[i][0] > player[0]) {
        // up
        if (enemies[i][1] < player[1]) {
          enemies[i][2] =
            90 -
            atan((player[1] - enemies[i][1]) / (enemies[i][0] - player[0]));
        }
        // down
        else if (enemies[i][1] > player[1]) {
          enemies[i][2] =
            90 +
            atan((enemies[i][1] - player[1]) / (enemies[i][0] - player[0]));
        }
        // straight right, avoid atan 0 error
        else {
          enemies[i][2] = 90;
        }
      }
      // to the left
      else if (enemies[i][0] < player[0]) {
        // same commands except looking other way
        if (enemies[i][1] < player[1]) {
          enemies[i][2] =
            270 +
            atan((player[1] - enemies[i][1]) / (player[0] - enemies[i][0]));
        } else if (enemies[i][1] > player[1]) {
          enemies[i][2] =
            270 -
            atan((enemies[i][1] - player[1]) / (player[0] - enemies[i][0]));
        } else {
          enemies[i][2] = 270;
        }
      }
      // straight up or down
      else {
        if (enemies[i][1] < player[1]) {
          enemies[i][2] = 0;
        } else {
          enemies[i][2] = 180;
        }
      }

      // find the real distance between player and enemy angle
      var angle1 = enemies[i][2] + 360 - player[2];
      var angle2 = enemies[i][2] - player[2];
      var angle3 = enemies[i][2] - 360 - player[2];
      var optimalAngle = false;
      if (
        abs(angle1) <= abs(angle2) &&
        abs(angle1) <= abs(angle3) &&
        abs(angle1) < FOV / 2 + 10
      ) {
        optimalAngle = angle1;
      } else if (
        abs(angle2) <= abs(angle1) &&
        abs(angle2) <= abs(angle3) &&
        abs(angle2) < FOV / 2 + 10
      ) {
        optimalAngle = angle2;
      } else if (abs(angle3) < FOV / 2 + 10) {
        optimalAngle = angle3;
      }

      // put info into array, or draw offscreen
      if (optimalAngle) {
        enemies[i][4] = 800 + (800 * optimalAngle) / (FOV / 2);
        enemies[i][5] = 400 + player[3];
        enemies[i][6] = enemies[i][16] / (enemies[i][3] * cos(optimalAngle));
      } else {
        enemies[i][4] = 0;
        enemies[i][5] = 10000000;
        enemies[i][6] = 10000000;
      }
    }
  }
}
function draw3d() {
  // adds enemies and rays, sorts them by distance to simulate walls hiding enemies
  // index [8] = 0 means wall, 1 means enemy
  var allObjects = concat(enemies, rays).sort((a, b) => {
    if (a[8] == 0) {
      w = a[0];
    } else {
      w = a[3];
    }
    if (b[8] == 0) {
      z = b[0];
    } else {
      z = b[3];
    }
    return w - z;
  });

  // checks bullet collisions, starting from closest
  for (var i = 0; i < allObjects.length; i++) {
    if (allObjects[i][8] == 0) {
      if (
        gun[10] &&
        gun[3] > 4 &&
        gun[0] > allObjects[i][1] - allObjects[i][7] &&
        gun[0] < allObjects[i][1] + allObjects[i][7] &&
        gun[1] > allObjects[i][2] &&
        gun[1] < allObjects[i][3]
      ) {
        allObjects[i][9] = true;
        gun[10] = false;
      }
    } else {
      if (
        gun[10] &&
        gun[3] > 4 &&
        distance(gun[0], gun[1], allObjects[i][4], allObjects[i][5]) <
          allObjects[i][6] / 2
      ) {
        allObjects[i][9] = true;
        gun[10] = false;
      }
    }
  }

  reverse(allObjects);

  // draws entities by scanning in reverse, farthest first so closer ones are drawn on top
  for (var i = 0; i < allObjects.length; i++) {
    if (allObjects[i][8] == 0) {
      // draw walls
      stroke(allObjects[i][4], allObjects[i][5], allObjects[i][6]);
      strokeWeight(allObjects[i][7]);
      line(
        allObjects[i][1],
        allObjects[i][2],
        allObjects[i][1],
        allObjects[i][3]
      );
      if (allObjects[i][9]) {
        fill(250, 237, 39, 150);
        noStroke();
        ellipse(
          gun[0],
          gun[1],
          10000 / allObjects[i][0],
          10000 / allObjects[i][0]
        );
        allObjects[i][9] = false;
      }
    } else {
      noStroke();
      if (allObjects[i][9]) {
        // draw enemy
        fill(255, 255, 255);
        ellipse(
          allObjects[i][4],
          allObjects[i][5],
          allObjects[i][6],
          allObjects[i][6]
        );

        // draw healthbar
        fill(150, 150, 150, 100);
        rect(
          allObjects[i][4] - allObjects[i][6] / 2,
          allObjects[i][5] - (700 * allObjects[i][6]) / 800,
          allObjects[i][6],
          allObjects[i][6] / 5
        );
        fill(255, 0, 0, 200);
        rect(
          allObjects[i][4] - allObjects[i][6] / 2,
          allObjects[i][5] - (700 * allObjects[i][6]) / 800,
          (allObjects[i][6] * allObjects[i][10]) / allObjects[i][17],
          allObjects[i][6] / 5
        );

        fill(255, 0, 0, 150);
        ellipse(
          gun[0],
          gun[1],
          (10000 * allObjects[i][6]) / (3 * allObjects[i][16]),
          (10000 * allObjects[i][6]) / (3 * allObjects[i][16])
        );
        allObjects[i][9] = false;
        allObjects[i][10] -= 1;
      } else {
        // draw enemy
        fill(allObjects[i][11], allObjects[i][12], allObjects[i][13]);
        ellipse(
          allObjects[i][4],
          allObjects[i][5],
          allObjects[i][6],
          allObjects[i][6]
        );
        // draw healthbar
        fill(150, 150, 150, 100);
        rect(
          allObjects[i][4] - allObjects[i][6] / 2,
          allObjects[i][5] - (700 * allObjects[i][6]) / 800,
          allObjects[i][6],
          allObjects[i][6] / 5
        );
        fill(144, 238, 144, 200);
        rect(
          allObjects[i][4] - allObjects[i][6] / 2,
          allObjects[i][5] - (700 * allObjects[i][6]) / 800,
          (allObjects[i][6] * allObjects[i][10]) / allObjects[i][17],
          allObjects[i][6] / 5
        );
      }
    }
  }
}
function customCursor() {
  stroke(0, 0, 0);
  strokeWeight(10);
  point(cCursor[0], cCursor[1]);
  strokeWeight(3);
  line(cCursor[0] - 25, cCursor[1], cCursor[0] - 15, cCursor[1]);
  line(cCursor[0] + 15, cCursor[1], cCursor[0] + 25, cCursor[1]);
  line(cCursor[0], cCursor[1] - 25, cCursor[0], cCursor[1] - 15);
  line(cCursor[0], cCursor[1] + 15, cCursor[0], cCursor[1] + 25);

  if (cCursor[0] > 1600) {
    cCursor[0] = 1600;
  } else if (cCursor[0] < 0) {
    cCursor[0] = 0;
  } else {
    cCursor[0] += movedX;
  }
  if (cCursor[1] > 800) {
    cCursor[1] = 800;
  } else if (cCursor[1] < 0) {
    cCursor[1] = 0;
  } else {
    cCursor[1] += movedY;
  }
}
function drawMenu() {
  textSize(100);
  fill(0, 0, 0);
  text("Gun attack", 300, 125);

  // draws the options
  noStroke();
  textSize(50);
  textAlign(LEFT);
  for (var i = 0; i < menuOptions.length; i++) {
    if (
      cCursor[0] < 425 &&
      cCursor[1] > 175 + 75 * i &&
      cCursor[1] < 250 + 75 * i
    ) {
      if (mouseIsPressed) {
        gameMode = menuOptions[i];
      }
      fill(255, 0, 0);
    } else {
      fill(0, 0, 0);
    }
    text(menuOptions[i], 100, 225 + 75 * i);
  }
  textAlign(CENTER);

  // gradient
  for (var i = 0; i < 1610; i += 10) {
    strokeWeight(10);
    stroke(0, 0, 0, 255 * (i / 1600));
    line(i, 0, i, 800);
  }

  noStroke();
  textSize(150);
  fill(255);
}
function drawInstructions() {
  noStroke();
  textSize(100);
  fill(0, 0, 0);
  text("How to Play", 800, 125);

  if (cCursor[1] > 600 && cCursor[0] > 425 && cCursor[0] < 1175) {
    fill(255, 0, 0);
    if (mouseIsPressed) {
      gameMode = "Menu";
    }
  }
  text("Back to Menu", 800, 725);

  fill(0, 0, 0);
  textSize(50);
  text(
    "Your objective is to kill enemies and survive as long as possible\n Use the mouse to aim, and click to shoot\n Use the WASD keys or arrow keys to move\n Press 'r' to reload once your bullets are gone\n If enemies touch you, you will lose health\n If your health gets to 0, then you will die\n",
    800,
    250
  );
}
function drawSettings() {
  noStroke();
  textSize(100);
  fill(0, 0, 0);
  text("Settings", 800, 125);

  if (cCursor[1] > 625 && cCursor[0] > 425 && cCursor[0] < 1175) {
    fill(255, 0, 0);
    if (mouseIsPressed) {
      gameMode = "Menu";
    }
  }
  text("Back to Menu", 800, 750);

  fill(0, 0, 0);
  textSize(50);
  text("FOV", 800, 225);
  text(
    "60                                                                            120",
    800,
    265
  );
  text("Graphics", 800, 325);
  text(
    "100                                                                            1000",
    800,
    365
  );
  text("X Sensitivity", 800, 425);
  text(
    "0.2x                                                                            5x",
    800,
    465
  );
  text("Y Sensitivity", 800, 525);
  text(
    "0.2x                                                                            5x",
    800,
    565
  );

  stroke(0, 0, 0);
  for (var i = 0; i < 4; i++) {
    line(300, 250 + 100 * i, 1300, 250 + 100 * i);
  }

  strokeWeight(3);
  fill(200, 200, 200);
  ellipse(300 + 1000 * ((FOV - 60) / 60), 250, 25, 25);
  ellipse(300 + 1000 * ((graphics - 100) / 900), 350, 25, 25);
  ellipse(300 + 1000 * ((Xsens + 1) / 2), 450, 25, 25);
  ellipse(300 + 1000 * ((Ysens + 1) / 2), 550, 25, 25);

  if (mouseIsPressed && cCursor[0] > 300 && cCursor[0] < 1300) {
    if (cCursor[1] > 220 && cCursor[1] < 280) {
      FOV = 60 + 60 * ((cCursor[0] - 300) / 1000);
    } else if (cCursor[1] > 320 && cCursor[1] < 380) {
      graphics = 100 + 900 * ((cCursor[0] - 300) / 1000);
    } else if (cCursor[1] > 420 && cCursor[1] < 480) {
      Xsens = 2 * ((cCursor[0] - 300) / 1000) - 1;
    } else if (cCursor[1] > 520 && cCursor[1] < 580) {
      Ysens = 2 * ((cCursor[0] - 300) / 1000) - 1;
    }
  }
}
function drawDeath() {
  noStroke();
  fill(200, 200, 200, 40);
  rect(0, 0, 1600, 800);

  textSize(100);
  fill(0, 0, 0);
  text("You Died", 800, 125);

  if (cCursor[1] > 625 && cCursor[0] > 425 && cCursor[0] < 1175) {
    fill(255, 0, 0);
    if (mouseIsPressed) {
      gameMode = "Menu";
    }
  }
  text("Back to Menu", 800, 750);
}

function draw() {
  // draws debug grid, or 3d background
  if (gameMode == "Debug") {
    drawGrid();
    playerControls();
    castRays();
    castEnemies();
  } else if (gameMode == "Menu") {
    drawLandscape();
    drawMenu();
    customCursor();
  } else if (gameMode == "Instructions") {
    drawLandscape();
    drawInstructions();
    customCursor();
  } else if (gameMode == "Survival" || gameMode == "Campaign") {
    drawLandscape();
    castRays();
    castEnemies();
    draw3d();
    maintenance();
    overlay();
    playerControls();
  } else if (gameMode == "Death") {
    drawDeath();
    customCursor();
  } else if (gameMode == "Settings") {
    drawLandscape();
    drawSettings();
    customCursor();
  }
}
