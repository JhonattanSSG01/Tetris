let = lastTime = 0;
let dropInterval = 1000; // Se declara e inicializa el intervalo de tiempo
let dropCounter = 0; // Se decalra e inicializa en cero el contador de cada caida de la pieza

// Obtener un numero aleatorio
let colorRandom = Math.floor(Math.random() * 255); 
let colorRandom1 = Math.floor(Math.random() * 150);
let colorRandom2 = Math.floor(Math.random() * 50);

const CANVAS = document.querySelector('canvas'); // Se declara constante para llamar la etiqueta canvas
const PINCEL = CANVAS.getContext('2d'); // Se declara constante para contextualizar que formato de dibujo manejaremos
const GRID = createMatriz(10, 20); // Se decalara constante para la creacion de la matriz.

const COLORS = [ // Array donde se alamcenaran los colores diferentes para cada Tritomino
  null, // El 0 no lleva color, ya que, no se debe pintar para que se visualize la ficha correctamente
  `rgb(${colorRandom},${colorRandom1},${colorRandom2})`,
  `rgb(${colorRandom1},${colorRandom1},${colorRandom2})`,
  `rgb(${colorRandom2},${colorRandom1},${colorRandom2})`,
  `rgb(${colorRandom1},${colorRandom},${colorRandom2})`,
  `rgb(${colorRandom},${colorRandom1},${colorRandom})`,
  `rgb(${colorRandom2},${colorRandom1},${colorRandom})`,
  `rgb(${colorRandom2},${colorRandom},${colorRandom2})`
]
const PLAYER = {
  pos: { x: 0, y: 0 }, // Posiciones
  score: 0, // Puntaje
  pieza: null
}

PINCEL.scale(45, 45);
// 200 / 20 = 10
// 400 / 20 = 20
// 10 columnas y 20 filas

// La funcion createTetra nos ayudara a ir creando una pieza diferente cada vez que se genere una nueva
function createTetra(tipo){
  // La condicional lo que validara es la forma de la ficha que vaya llegando como parametro de la funcion
  if(tipo === 'T'){ // Tetromino T
    return [ // Devuelve la matriz // Array bidimensional 
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ]; 
  } else if(tipo === 'O'){ // Tetromino O
    return [ 
      [2, 2],
      [2, 2],
    ]; 
  } else if (tipo === 'L') { // Tetromino L
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (tipo === 'J') { // Tetromino J
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (tipo === 'I') { // Tetromino I
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (tipo === 'S') { // Tetromino S
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (tipo === 'Z') { // Tetromino z
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}


// La funcion createMatriz creara la matriz con el ancho y alto que llegue como parametro
function createMatriz(width, height) {
  const MATRIZ = []; // Se declara e inicializa la constante con una lista vacia

  // El ciclo while nos ayudara que cada vez que el heigth se le resta 1(sea true), se creara una nueva lista dentro del array vacio hasta llegar a 0 que devuelve false
  // 0 = false
  // Numeros mayores a 0 son true
  while (height--) {
    MATRIZ.push(new Array(width).fill(0)); // Agrega una nueva lista dentro de la lista vacia creada anteriormente
  }

  // console.table(MATRIZ); Se visualiza en la consola en formato tabla
  return MATRIZ; // Devuelve la matriz ya construida 
}


// La function collide nos ayuda a controlar las colisiones de la ficha con cualquier otra ficha o parte inferior de la cuadricula
function collide(grid, player) {
  const PIEZA = player.pieza;
  const POSICION = player.pos;
  // Se recorre verticalmente y horizontalmente para verificar cada indice(cuadrito) si colisona con algo, es decir si los indices son diferentes a 0 lo cual, hace referencia a una colision
  for (let y = 0; y < PIEZA.length; y++) {
    for (let x = 0; x < PIEZA[y].length; x++) {
      if (PIEZA[y][x] !== 0 && (grid[y + POSICION.y] && grid[y + POSICION.y][x + POSICION.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// La funcion merge nos ayudara a controlar que la ficha no se sobreponga o continue bajando cuando colisione con otra ficha
function merge(grid, player) {
  const PIEZA = player.pieza;
  const POSICION = player.pos;
  // el 1er forEach recorre horizontalmeente las filas y devuelve la posicion en y
  // el 2do forEach recorre verticalmente la fila que devuelve el 1er forEach y devuelve la posicion x 
  PIEZA.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        grid[y + POSICION.y][x + POSICION.x] = value;
      }
    })
  })
}

// La funcion drawPieza dibujara la pieza del tetromino dependiendo de los parametros que le llegue como la pieza especifica y su posicion
function drawPieza(pieza, posicion) {
  // Se realizan el forEach anidado para recorrer cada indice verticalmente y horizontalmente
  pieza.forEach((row, y) => {
    row.forEach((value, x) => {
      // La considional valida si el valor llega diferente a 0 dibujara el tetramino
      if (value !== 0) {
        PINCEL.fillStyle = COLORS[value]; // Color del tetramino
        PINCEL.fillRect(x + posicion.x, y + posicion.y, .8, .8); // Pocicion del rectangulo que se dibujara dependiendo de las pocisones en x - y, y se pone el tamaoño que tendra
      }
    })
  });
}

// La funcion draw pintara el canvas
function draw() {
  // Dibuja el canvas con el color y las medidas especificadas
  PINCEL.fillStyle = 'rgb(240,240,240)';
  PINCEL.fillRect(0, 0, CANVAS.width, CANVAS.height); // (x,y, ancho, alto)
  drawPieza(GRID, { x: 0, y: 0 }); // La llamada a la funcion #1 Redibuja la cuadricula todos los espaciones con posicion x = 0 / y = 0
  drawPieza(PLAYER.pieza, PLAYER.pos); // La llamada a la funcion #2 Dibuja la pieza actual de la constante player
}

// La funcion gridDelete ira eliminando cada fila que se complete con numeros diferentes a 0 y se le agrega 10 puntos cada vez que se elimine una fila
function gridDelete(){
  /* outer se refiere a un label que proporciona una instrucción con un identificador que te permite hacer referencia a ella en otra parte de tu programa. 
  Por ejemplo, puedes usar una etiqueta para identificar un bucle y luego usar las declaraciones break o continue para indicar si un programa debe 
  interrumpir el bucle o continuar su ejecución. */

    outer :for(let y = GRID.length - 1; y > 0; y--){
      for(x = 0; x < GRID.length; x++){
        if(GRID[y][x] === 0){
          continue outer;
        }
      }

      const ROW = GRID.splice(y, 1)[0].fill(0); // El método splice() cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
      GRID.unshift(ROW);  //El método unshift() agrega uno o más elementos al inicio del array, y devuelve la nueva longitud del array.
      y++;
  
      PLAYER.score += (1 * 10); // Se multiplica por 10 cada vez que hace una linea
    }

  }

// La funcion update nos ira actualizando el tiempo que le llegue como parametro - el tiempo anterior, se redibujara el canvas cada vez que se llame esta funcion
function update(time = 0) {
  const DELTA_TIME = (time - lastTime);
  lastTime = time;
  dropCounter += DELTA_TIME; // Se le asigna al contador el tiempo que resulte cada vez que se resta el tiempo actual con el anterior en cada llamada de la animacion sobre la funcion
  // la condicion valida si el conteo es mayor al intervalo asignado al principio para realizar la sentencia y vaya cayendo la pieza 
  if (dropCounter > dropInterval) {
    drop();
  }
  draw(); // Llamar funcion draw para redibujar
  requestAnimationFrame(update); // Se ira llamando cada vez que se llama la fuction update con el parametro time
  /* Informa al navegador que quieres realizar una animación y solicita que el navegador programe el repintado de la ventana para
  el próximo ciclo de animación. El método acepta como argumento una función a la que llamar antes de efectuar el repintado.*/
}

// La funcion drop realiza la sentencia que controla la caida de cada ficha cada vez que colisione con el borde inferior de la cuadricula u otra ficha para que no se sobreponga.
function drop() {
  PLAYER.pos.y++; // La pieza cae en el eje y
  /* La condicinal valida si encuentra una colision(True), cuando llamamos la funcion collide y como argumento se le da la cuadricula y el objeto de la ficha.
   Cuando esta sea(True) en la posicion y se le restara para que no continue bajando y se controle la caida dentro del canvas */
  if (collide(GRID, PLAYER)) {
    PLAYER.pos.y--; // Se resta 1 a la posicion eje y de la ficha cada vez que encuentre una colision para que no continue bajando y quede statica en la possicion que llegue.
    merge(GRID, PLAYER); // Se llama la funcion y se le da como argumento la cuadricula y el objeto de las fichas para validar caundo encuentre una colision con otra ficha y se detenga
    reset(); // Se llama la funcion reset cada vez que una ficha encuentra una colision, lo cual, aparece una nuevamente
    gridDelete(); // Se llama la funcion cuando se encuentre con colision pero a la vez si se completa una fila la cual se elimina.
    updateScore(); // Se llama la funcion para que vaya actualizando cada vez que encuentre una colision dependiendo si se elimino o no la fila
  }
  dropCounter = 0; // Se inicializa nuevamente el contador para que haga el efecto de caer lentamente
}

// La funcion dropMove realiza la sentencia que controla las colisiones de los bordes laterales para que esta no se sobreponga con las fichas y no se pase de los lados de la cuadricula
function dropMove(direction) {
  PLAYER.pos.x += direction; // Aumenta cada vez que se mueva lateralmente dependiendo del parametro que reciba la funcion dropMove
  // La condicional valida si encuentra la ficha una colision lateralmente, lo cual, esa direccion se reiniciaria
  if (collide(GRID, PLAYER)) {
    PLAYER.pos.x -= direction; // Se inicializa la posicion al valor original o inicialmente.
  }
}

// La funcion piezaRotate nos ayudara que el tetramino rote siempre 90 grados hacia la derecha
function piezaRotate() {
  const POSICION = PLAYER.pos.x; // Se asigna la posicion x a una constante para que siempre tenga la posicion inicial sin actualizar
  let value = 1; // Se asigna valor para cuando haya una colision y la reinicie a 0
  rotate(PLAYER.pieza); // Se llama la funcion y como argumento le pasamos la ficha actual
  // La condicional validara que mientras haya una collision a la hora de rotar, se logre rotar nuevamente sin salirse del canvas
  while (collide(GRID, PLAYER)) {
    PLAYER.pos.x += value; // Se le suma a la posicion el valor de la variable value
    value = -(value + (value > 0 ? 1 : -1)); // Se valida si la operacion es mayor a 0 que devuelve 1 para volver a la izquierda o -1 para volver a la derecha
    // La condicion valida si value es mayor a la pocion 0 del tetramino lo cual se saldria del canva si no se controla
    if (value > PLAYER.pieza[0].length) {
      rotate(PLAYER.pieza); // Se llama la funcion y como argumento le pasamos la ficha actual para que rote nuevamente
      PLAYER.pos.x = POSICION; // Se le asigna a la posicion x la posicion que se ha guardado
      return;
    }
  }
}

// La funcion rotate tiene como parametro la pieza que le llega para realizar la rotacion correctamente
function rotate(pieza) {
  // el 1er for recorre verticalmente(eje y) dependiendo de la longitud de la pieza(array)
  // el 2do for recorre horizontalmente(eje x) dependiendo de cada iteracion en el eje y
  for (let y = 0; y < pieza.length; y++) {
    for (let x = 0; x < y; x++) {
      [pieza[x][y], pieza[y][x]] = [pieza[y][x], pieza[x][y]]; // Se sustituye toda la matriz tando en el eje x como en el eje y
    }
  }
  // Este forEach recorre la matriz por filas para poder invertirla 
  pieza.forEach((row) => row.reverse()); // reverse() es un metodo de js que nos ayuda a rotar filas o columnas
}

// La funcion reset nos ayudara a resetear las pociones de cada nueva ficha que se genere y no se sobrepponga en la que ya este
function reset() {
  const TETRAMINOS = 'TOLJISZ'; // Se declara la constante e inicializa con una cadena de texto que tendra las letras los cuales son los tetraminos 
  PLAYER.pieza = createTetra(TETRAMINOS[Math.floor(Math.random() * TETRAMINOS.length)]); // Se le asigna a la ficha la funcion createTetra la cual como argumento se le da la posicion aleatoriamente de la cadena de texto que se guarda en la constante TERAMINOS
  PLAYER.pos.x = (Math.floor(GRID[0].length / 3)); // Se reinicia posision en x centradamente
  PLAYER.pos.y = 0; // Se reinicia posision en y
  updateScore(); // Se llama la funcion para que vaya actualizando cada vez que haya una nueva ficha dependiendo de si se elimino o no la fila
  update(); // Se llama la funcion para que vaya actualizando la animaciopnde de los fotogramas
}

// La funcion updateScore tiene como funcionalidad el actualizar el puntaje, se le asigna al html el valor que este actualmente por medio del DOM para visualizarlo siempre en el navegador
function updateScore(){
  document.getElementById('score').innerHTML = PLAYER.score;
}

// El evento nos ayudara a captar el sonido de las teclas especificas a la hora de mover el tetramino
document.addEventListener('keydown', (event) => {
  // Condicion anidada si escucha las techas ⬇️➡️⬅️ o las teclas s-w-a-d
  if (event.key === 'ArrowDown' || event.key === 's') {
    drop(); // La pieza cae en el eje y
  } else if (event.key === 'ArrowLeft' || event.key === 'a') {
    dropMove(-1); // La pieza se mueve hacia la izquierda en el eje x
  } else if (event.key === 'ArrowRight' || event.key === 'd') {
    dropMove(1); // La pieza se mueve hacia la derecha en el eje y
  } else if (event.key === 'ArrowUp' || event.key === 'w') {
    piezaRotate();
  }
})

reset();// Se llama la funcion para que siempre reinice y salga la primera ficha
