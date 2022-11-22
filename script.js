let = lastTime = 0;
let dropInterval = 1000; // The time interval that the Tetris will have is declared and initialized.
let dropCounter = 0; // The counter for each part drop is declared and initialized to zero.
let pause = false; // Initialized to false so that the game can be played at startup and is not paused.

// Get a random number
let colorRandom = Math.floor(Math.random() * 200);
let colorRandom1 = Math.floor(Math.random() * 150);
let colorRandom2 = Math.floor(Math.random() * 80);

// The buttons are accessed through the DOM, which will be displayed in Mobile. 
const BTN_R = document.getElementById('buttonRotar');
const BTN_D = document.getElementById('buttonDerecha');
const BTN_I = document.getElementById('buttonIzquierda');
const BTN_A = document.getElementById('buttonAbajo');

// The canvas tag is accessed by the id thanks to the DOM
const CANVAS = document.getElementById('grid'); // Board
const SPACE_NEXT = document.getElementById('next'); // Next tab board

// A constant is declared to contextualize which drawing format we will handle.
const PINCEL = CANVAS.getContext('2d');
const NEXT_TETRAMINO = SPACE_NEXT.getContext('2d');

const GRID = createMatriz(10, 20); // Creation of the matrix.
const COLORS = [ // Array where the colors for each Tritomino will be stored.
  null, // The potions should not be painted in zero, so that the Tritomino can be displayed correctly.
  `rgb(${colorRandom},${colorRandom1},${colorRandom2})`,
  `rgb(${colorRandom2},${colorRandom1},${colorRandom})`,
  `rgb(${colorRandom2},${colorRandom1},${colorRandom2})`,
  `rgb(${colorRandom1},${colorRandom2},${colorRandom1})`,
  `rgb(${colorRandom},${colorRandom1},${colorRandom})`,
  `rgb(${colorRandom},${colorRandom2},${colorRandom})`,
  `rgb(${colorRandom2},${colorRandom2},${colorRandom1})`
]
const PLAYER = {
  pos: { x: 0, y: 0 }, // Positions
  pieza: null, // Tetramino
  score: 0, // Score
  line: 0, // Lineas
  level: 0, // Levels
  next: null, // Next Tab
  record: 0
}


PINCEL.scale(45, 45); // Grid scale
NEXT_TETRAMINO.scale(45, 45); // Small grid scale

// The function will help us to create the Tetraminos randomly each time the reset function is executed.
function createTetra(tipo){
  switch (tipo) {// The Switch will validate the shape of the Tetramino that arrives as a parameter to the function
    // Two-dimensional array 
    case "T":
      return [ // The return statement is used to exit the execution sequence of the switch and at the same time the function to return the matrix.
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
      ]; 
    case "O":
      return [ 
        [2, 2],
        [2, 2],
      ];
    case "L":
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3],
      ];
    case "J":
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0],
      ];
    case "I":
      return [
        [0, 0, 5, 0, 0],
        [0, 0, 5, 0, 0],
        [0, 0, 5, 0, 0],
        [0, 0, 5, 0, 0],
        [0, 0, 0, 0, 0]
      ];
    case "S":
      return [
        [0, 6, 6],
        [6, 6, 0],
        [0, 0, 0],
      ];
    case "Z":
      return [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0],
      ];
    default:
      break;
  }  
}


// The function will create the matrix with proportional measures such as width and height that are passed as parameters to the function.
function createMatriz(width, height) {
  const MATRIZ = []; // The constant is declared and initialized with an empty list.

  // The while loop will help us that each time the heigth is subtracted 1(true), a new list will be created inside the empty array until it reaches 0 which returns false
  // 0 = false
  // Numbers greater than 0 are true
  while (height--) {
    MATRIZ.push(new Array(width).fill(0)); // The push method adds a new data into the empty list created before.
  }

  // console.table(MATRIZ) Can be displayed in the console in table format
  return MATRIZ; // Returns the matrix already constructed 
}


// The function helps us to control all collisions that occur within the board, either with another Tetramino or with the bottom of the board.
function collide(grid, player) {
  const PIEZA = player.pieza;
  const POSICION = player.pos;
  // It runs vertically and horizontally to check each index(square) if it collides with something, if the indices are different from 0 this will refer to a collision.
  for (let y = 0; y < PIEZA.length; y++) {
    for (let x = 0; x < PIEZA[y].length; x++) {
      if (PIEZA[y][x] !== 0 && (grid[y + POSICION.y] && grid[y + POSICION.y][x + POSICION.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// The function will help us to control the overlapping of the Tertaminos or if it continues to go down when it collides with another Tetramino or lower part of the board.
function merge(grid, player) {
  const PIEZA = player.pieza;
  const POSICION = player.pos;
  // the 1st forEach scrolls horizontally through the rows and returns the position on the y-axis
  // the 2nd forEach scrolls vertically through the row returned by the 1st forEach and returns the value of the position on the x-axis 
  PIEZA.forEach((row, y) => {
    row.forEach((value, x) => {
      // If the condition is fulfilled, the value will be assigned to the coordinates of the tetramino on the board.
      if (value !== 0) {
        grid[y + POSICION.y][x + POSICION.x] = value;
      }
    })
  })
}

// The function is in charge of painting the color(board) where the figure will be displayed. 
function drawTetraNext(pieza, posicion) {
  // Draw the canvas with the specified color and dimensions.
  NEXT_TETRAMINO.fillStyle = 'rgb(240,240,240)';
  NEXT_TETRAMINO.fillRect(0, 0, SPACE_NEXT.width, SPACE_NEXT.height);

  // Nested forEach is performed to traverse each index vertically and horizontally.
  pieza.forEach((row, y) => {
    row.forEach((value, x) => {
      // The conditional validates if the value arrives different from 0 in order to draw the Tetramino.
      if (value !== 0) {
        NEXT_TETRAMINO.fillStyle = COLORS[value]; // Color of the following Tetramino
        NEXT_TETRAMINO.fillRect(x + posicion.x, y + posicion.y, .8, .8); // Position of the rectangle to be drawn depending on the x - y dimensions.
      }
    })
  });
}

// The function will draw the Tetromino piece depending on incoming parameters such as the specific figure and its position.
function drawPieza(pieza, posicion) {
  pieza.forEach((row, y) => {
    row.forEach((value, x) => {
      // The conditional validates if the value arrives different from 0 in order to draw the Tetramino.
      if (value !== 0) {
        PINCEL.fillStyle = COLORS[value]; // Tetramino color
        PINCEL.fillRect(x + posicion.x + 0.1, y + posicion.y + 0.1, .8, .8);
      }
    })
  });
}

// The function will paint the canvas(Board) 
function draw() {
   // Draw the canvas with the specified color and dimensions.
  PINCEL.fillStyle = 'rgb(240,240,240)';
  PINCEL.fillRect(0, 0, CANVAS.width, CANVAS.height); // (x,y, ancho, alto)

  drawPieza(GRID, { x: 0, y: 0 }); // TThe function is called to redraws the grid with the positions on the x = 0 / y = 0 axes.
  drawPieza(PLAYER.pieza, PLAYER.pos); // The function is called to draw the current figure generated in the PLAYER object.
  drawTetraNext(PLAYER.next, { x: .5, y: .5 }); // The function is called to draws the following tile with x / y position
}

// The function will eliminate each row that is filled with numbers that are different from zero and 10 points are accumulated each time a row is eliminated.
function gridDelete() {
  /* outer refers to a label that provides an instruction with an identifier that allows you to refer to it elsewhere in your program.
  For example, you can use a label to identify a loop, and then use the break or continue statements to indicate whether a program should 
  break the loop or continue its execution. */

  outer: for (let y = GRID.length - 1; y > 0; y--) {
    for (x = 0; x < GRID.length; x++) {
      if (GRID[y][x] === 0) {
        continue outer;
      }
    }

    const ROW = GRID.splice(y, 1)[0].fill(0); // The splice() method changes the contents of an array by removing existing elements and/or adding new elements.
    GRID.unshift(ROW);  // The unshift() method adds one or more elements to the beginning of the array, and returns the new length of the array.
    y++; // Increases in the y-axis

    PLAYER.score += (1 * 10); // It is multiplied by 10 each time a line is made.

    // The condition validates the current record (high score) with the score of each game to be updated. 
    if (PLAYER.score < PLAYER.record) {
      PLAYER.record = PLAYER.record;
    } else {
      PLAYER.record = PLAYER.score;
    }

    PLAYER.line++; // Increments by one each time the line is deleted.
    // The condition will validate that every three lines will increase the level by one.
    if (PLAYER.line % 3 === 0) {
      PLAYER.level++;
    }
  }
}

// The function updates the previous time coming as a parameter, this helps us to redraw the canvas each time this function is called so that the animation is displayed in frames.
function update(time = 0) {
  // If the condition is met, the rest of the function will not be executed. 
  if (pause) {
    return
  }; 
  const DELTA_TIME = (time - lastTime);
  lastTime = time;
  dropCounter += DELTA_TIME; // The counter is assigned the time that results each time the current time is subtracted from the previous one in each call of the animation on the function
  // The condition validates if the count is greater than the interval assigned at the beginning to perform the sentence and the figure falls off.
  if (dropCounter > dropInterval) {
    dropDown();
  }
  draw(); // Call draw function to redraw
  setTimeout(() => {
    requestAnimationFrame(update);
  }, 20);

  //requestAnimationFrame(update); // It will be called each time the fuction update with time parameter is called.
  /* Informs the browser that you want to perform an animation and asks the browser to schedule the repainting of the window for the next animation cycle.
  the next animation cycle. The method accepts as argument a function to call before performing the repainting.*/
}

// The function performs the statement that controls the fall of each Titromino every time it collides with the bottom edge of the grid(board) or another tile so that it does not overlap.
function dropDown() {
  PLAYER.pos.y++; // The part falls on the y-axis
  /* The condicinal validates if it finds a collision(True), when we call the function collide and as argument it is given the grid(Board) and the object of the tile.
  When this one is(True) in the position it will be subtracted so that it does not continue lowering and the fall inside the canvas is controlled */
  if (collide(GRID, PLAYER)) {
    PLAYER.pos.y--; // One is subtracted from the position of the axis and the Tetramino each time it encounters a collision so that it does not continue to descend and remains static.
    merge(GRID, PLAYER); 
    reset(); // The reset function is called every time a token encounters a collision, which appears or generates a new one.
    gridDelete(); // The function is called when a collision is encountered but at the same time if a row is completed and deleted.
    updateScore(); // The function is called to update each time it finds a collision depending on whether or not the row was deleted.
  }
  dropCounter = 0; // The counter is re-initialized so that it has the effect of falling slowly
}

// The function controls the collisions of the lateral edges so that it does not overlap with the tiles and does not go beyond the sides of the grid(Board).
function dropMove(direction) {
  PLAYER.pos.x += direction; // Increases each time you move laterally depending on the parameter received by the dropMove function.
  // The conditional validates if the token encounters a collision laterally, which, that direction would be reset.
  if (collide(GRID, PLAYER)) {
    PLAYER.pos.x -= direction; // The position is initialized to the original or initial value.
  }
}

// The function will help us to rotate the Tetramino always 90 degrees to the right.
function piezaRotate() {
  const POSICION = PLAYER.pos.x; // The x position is assigned to a constant so that it always has the initial position without updating.
  let value = 1; // Value is assigned for when there is a collision and reset it to zero
  rotate(PLAYER.pieza); // The function is called and as an argument we pass the current file to it
  // The cycle will validate that as long as there is a collision when rotating, it manages to rotate again without leaving the canvas.
  while (collide(GRID, PLAYER)) {
    PLAYER.pos.x += value; // The value of the value variable is added to the position
    value = -(value + (value > 0 ? 1 : -1)); // Validates if the operation is greater than 0 which returns 1 to return to the left or -1 to return to the right.
    // The condition is valid if value is greater than the zero position of the Tetramino which would be out of the canva if not checked.
    if (value > PLAYER.pieza[0].length) {
      rotate(PLAYER.pieza); // The function is called and as an argument we pass the current token to rotate again.
      PLAYER.pos.x = POSICION; // The position x is assigned the position that has been saved.
      return;
    }
  }
}

// The function has as parameter the figure that arrives to perform the rotation correctly.
function rotate(pieza) {
  // the 1st for runs vertically(y-axis) depending on the length of the figure(array)
  // the 2nd for traverses horizontally(x-axis) depending on each iteration on the y-axis
  for (let y = 0; y < pieza.length; y++) {
    for (let x = 0; x < y; x++) {
      [pieza[x][y], pieza[y][x]] = [pieza[y][x], pieza[x][y]]; // The entire matrix is replaced on both the x-axis and the y-axis.
    }
  }
  // This forEach goes through the matrix by rows in order to invert it. 
  pieza.forEach((row) => row.reverse()); // reverse() is a js method that helps us to rotate rows or columns.
}

// The function helps us to reset the potions of each new figure that is generated and does not overlap with the current one.
function reset() {
  const TETRAMINOS = 'TLJOISZ'; // The constant is declared and initialized with a text string that will contain the letters which are the Tetraminos 
  dropInterval = 1000 - (PLAYER.level * 50); // Time is subtracted each time a level is passed so that the speed increases as levels increase.

  // The condition validates whether it is initially null or not.
  if (PLAYER.next === null) {
    // The function createTetra is assigned to the token, which as an argument is given the random position of the text string stored in the constant TETRAMINOS and generates the figure
    PLAYER.pieza = createTetra(TETRAMINOS[Math.floor(Math.random() * TETRAMINOS.length)]);
  } else {
    PLAYER.pieza = PLAYER.next; // The following tab is assigned, which will be the new one generated.
  }

  PLAYER.next = createTetra(TETRAMINOS[Math.floor(Math.random() * TETRAMINOS.length)]); // The new tab is assigned to continue the current one.
  PLAYER.pos.x = (Math.floor(GRID[0].length / 3)); // Reset x-position centrally 
  PLAYER.pos.y = 0; // Position is reset to y-axis

  // The condition validates if there is a collision to restart the game again with the initial values.
  if (collide(GRID, PLAYER)) {
    // Defeat
    if (PLAYER.score < PLAYER.record) {
      PLAYER.record = PLAYER.record;
    } else {
      PLAYER.record = PLAYER.score;
    }

    GRID.forEach((row) => row.fill(0));
    PLAYER.score = 0;
    PLAYER.line = 0;
    PLAYER.level = 0;
    
    document.getElementById("sound").pause();
    alert('perdiste');
    update();
    document.getElementById("sound").play();
  }

  updateScore(); // The function is called to update every time there is a new card depending on whether the row was deleted or not.
  update(); // The function is called to update the animation of the frames.
}

// function alert() {
//   Swal.fire({
//     title: '¿Quieres volver a jugar?',
//     imageUrl: 'https://images.alphacoders.com/115/1153447.jpg',
//     imageWidth: 400,
//     imageHeight: 200,
//     showCancelButton: true,
//     confirmButtonColor: '#3085d6',
//     cancelButtonColor: '#d33',
//     confirmButtonText: 'Si',
//     // })
//   });
// }

function welcome() {
  Swal.fire({
    title: 'Sweet!',
    text: 'Modal with a custom image.',
    imageUrl: 'https://unsplash.it/400/200',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
  })
}

/* The function will allow to pause the game and the music through the conditional that is sent as parameter and the onclick event of the pause button */
function fPause(pauser) {
  pause = pauser;
  if (pause) {
    document.getElementById("background_tetris").style.display = "block";
    document.getElementById("sound").pause();
  }else{
    document.getElementById("background_tetris").style.display = "none";
    document.getElementById("sound").play();
    update();
  }
}

/* The function updateScore has as functionality to update the score, the level and the lines that are eliminated, it is assigned to the html 
the value that is currently through the DOM to always display it in the browser. */
function updateScore() {
  document.getElementById('score').innerHTML = PLAYER.score;
  document.getElementById('line').innerHTML = PLAYER.line;
  document.getElementById('level').innerHTML = PLAYER.level;
  document.getElementById('record').innerHTML = PLAYER.record;
}

// The event helps to pick up the sound of specific keys when moving the Tetramino
document.addEventListener('keydown', (event) => {
  // Nested condition if you listen to the ⬇️➡️⬅️ or s-w-a-d keys.
  switch (event.key) {
    case "ArrowDown" || "s":
      dropDown(); // The part moves on the y-axis      
      break;
    case "ArrowLeft" || "a":
      dropMove(-1); // The part moves to the left on the x-axis.    
      break;
    case "ArrowRight" || "d":
      dropMove(1); // The part moves to the right on the x-axis.    
      break;
    case "ArrowUp" || "w":
      piezaRotate(); // The broken piece     
      break;    
  }
})

// Event helps to capture the sound of specific buttons when moving the Tetramino
BTN_R.addEventListener('click', () => {
  piezaRotate(); 
});
BTN_D.addEventListener('click', () => {
  dropMove(1); 
});
BTN_I.addEventListener('click', () => {
  dropMove(-1); 
});
BTN_A.addEventListener('click', () => {
  dropDown(); 
});

reset(); // It always restarts for the first tile to come out.