
// Utils es una clase
// loadSound es un metodo de JS para cargar/iniciar sonidos dependiendo la ruta
// setInterval metodo de js que llama repetidamente una funcion o ejecuta una fragmento del codigo con un tiempo de retraso estimado.
// bind()
// mainLoop


const CANVAS = document.querySelector('canvas'); // Se declara constante para llamar la etiqueta canvas
const PINCEL = CANVAS.getContext('2d'); // Se declara constante para contextualizar que formato de dibujo manejaremos
const GRID = createMatriz(10,20); // Se decalara constante para la creacion de la matriz.
const PLAYER = {
  pos: { x: 0, y: 0 }, // Posiciones
  pieza: [ // Array bidimensional 
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]
}

PINCEL.scale(20,20);
// 200 / 20 = 10
// 400 / 20 = 20
// 10 columnas y 20 filas

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

// La funcion drawPieza dibujara la pieza del tetromino dependiendo de los parametros que le llegue como la pieza especifica y su posicion
function drawPieza(pieza, posicion) {
  // Se realizan el forEach anidado para recorrer cada indice verticalmente y horizontalmente
  pieza.forEach((row, y) => {
    row.forEach((value, x) => {
      // La considional valida si el valor llega diferente a 0 dibujara el tetramino
      if (value !== 0) {
        PINCEL.fillStyle = 'rgba(0, 0, 0, .5)'; // Color al tetramino
        PINCEL.fillRect(x + posicion.x, y + posicion.y, .8, .8); // Pocicion del rectangulo que se dibujara dependiendo de las pocisones en x - y, y se pone el tamaoño que tendra
      }
    })
  });
}


// La funcion draw pintara el canvas
function draw() {
  // Dibuja el canvas con el color y las medidas especificadas
  PINCEL.fillStyle = '#b9b9b9';
  PINCEL.fillRect(0, 0, CANVAS.width, CANVAS.height); // (x,y, ancho, alto)
  drawPieza(GRID, { x: 0, y: 0 }); // La llamada a la funcion #1 Redibuja la cuadricula todos los espaciones con posicion x = 0 / y = 0
  drawPieza(PLAYER.pieza, PLAYER.pos); // La llamada a la funcion #2 Dibuja la pieza actual de la constante player
}

// La funcion update nos ira actualizando el tiempo que le llegue como parametro - el tiempo anterior, se redibujara el canvas cada vez que se llame esta funcion
function update(time = 0) {
  const DELTA_TIME = (time - lastTime);
  lastTime = time;
  dropCounter += DELTA_TIME; // Se le asigna al contador el tiempo que resulte cada vez que se resta el tiempo actual con el anterior en cada llamada de la animacion sobre la funcion

  draw(); // Llamar funcion draw para redibujar
  requestAnimationFrame(update); // Se ira llamando cada vez que se llama la fuction update con el parametro time
  /* Informa al navegador que quieres realizar una animación y solicita que el navegador programe el repintado de la ventana para
  el próximo ciclo de animación. El método acepta como argumento una función a la que llamar antes de efectuar el repintado.*/
}