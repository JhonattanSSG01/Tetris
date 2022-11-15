
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
