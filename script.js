
// Utils es una clase
// loadSound es un metodo de JS para cargar/iniciar sonidos dependiendo la ruta
// setInterval metodo de js que llama repetidamente una funcion o ejecuta una fragmento del codigo con un tiempo de retraso estimado.
// bind()
// mainLoop


const CANVAS = document.querySelector('canvas'); // Se declara constante para llamar la etiqueta canvas
const PINCEL = CANVAS.getContext('2d'); // Se declara constante para contextualizar que formato de dibujo manejaremos
const GRID = createMatriz(10,20); // Se decalara constante para la creacion de la matriz.

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
