// PerspectiveView_mvpMatrix.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

var mi_altura = 1;
var mi_lejania_y = 0;
var dcha_izq = 0;
var angle = 0;
var moveAngle = 0;
//var angulo_vision = [Math.cos(angle),Math.sin(angle)];
var gl;
var n;
var canvas;
var canvas = document.getElementById('webgl');
var modelMatrix = new Matrix4(); // Model matrix
var viewMatrix = new Matrix4();  // View matrix
var projMatrix = new Matrix4();  // Projection matrix
var mvpMatrix = new Matrix4();   // Model view projection matrix
var u_MvpMatrix;
var pinos =[];



function posicion_aleatoria(x){
  var profundidad;
  var lados;
      profundidad = Math.floor(Math.random() * (10 - (-10))) + (-10);
      lados = Math.floor(Math.random() * (5 - (-5))) + (-5);
      pinos[x].matriz = pinos[x].matriz.setTranslate(lados, profundidad, 0.1);
}

function altura_aleatoria(x){
  var altura;
    altura = Math.floor(Math.random() * (3 - (0))) + (0);
    pinos[x].matriz = pinos[x].matriz.scale(1,1,altura);
}

function pino(id,matriz){
this.id = id;
this.matriz = matriz;
}

function bosque(){
  var num_pinos = 100;
  gl.clear(gl.COLOR_BUFFER_BIT);
  for(var x = 0; x < num_pinos ; x++){
    matriz = new Matrix4();
    pinos.push(new pino("pino",matriz));
    posicion_aleatoria(x);
    altura_aleatoria(x);
    viewMatrix.setLookAt(dcha_izq, mi_lejania_y, mi_altura,dcha_izq+Math.cos(angle),mi_lejania_y+Math.sin(angle),mi_altura, 0, 0, 1);
    projMatrix.setPerspective(60, canvas.width/canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(matriz);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
    gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles

  }
}

function pintarBosque(){
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  for(x in pinos) {
    viewMatrix.setLookAt(dcha_izq, mi_lejania_y, mi_altura,dcha_izq+Math.cos(angle),mi_lejania_y+Math.sin(angle),mi_altura, 0, 0, 1);
    //viewMatrix.setLookAt(dcha_izq,mi_lejania_y,mi_altura, punto_vista_x,punto_vista_y,mi_altura, 0, 0, 1);
    projMatrix.setPerspective(60, canvas.width/canvas.height, 1, 100);
    mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(pinos[x].matriz);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  }
}

function main() {
  // Retrieve <canvas> element
  //var canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex coordinates and color (the blue triangle is in the front)
  n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the vertex information');
    return;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);
  gl.enable(gl.DEPTH_TEST);

  // Get the storage location of u_MvpMatrix
  u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }


  //bosque();
  //pintarBosque();
  //modelMatrix.setTranslate(lados, profundidad, 0.1);
  //viewMatrix.setLookAt(dcha_izq,mi_lejania_y,mi_altura,0,0,mi_altura, 0, 0, 1);
  projMatrix.setPerspective(90, canvas.width/canvas.height, 1, 100);
  // Calculate the model view projection matrix
  //mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
  // Pass the model view projection matrix to u_MvpMatrix
  //gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
  //gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>
  //gl.drawArrays(gl.TRIANGLES, 0, n);   // Draw the triangles
  bosque();

}





//Funcion de movimiento respecto a las teclas
function whichButton(event){
  if(event.keyCode=='39'){//si la tecla presionada es direccional derecho
    moveAngle = moveAngle -(2);
    angle = moveAngle * Math.PI/180;
    pintarBosque();
  }
  if(event.keyCode=='37'){//si la tecla presionada es direccional izquierdo
    moveAngle = moveAngle -(-2);
    angle = moveAngle * Math.PI/180;
    pintarBosque();
  }
  if(event.keyCode=='38'){//si la tecla presionada es direccional arriba
    mi_lejania_y = mi_lejania_y + Math.sin(angle);
    dcha_izq = dcha_izq + Math.cos(angle);
    pintarBosque();
  }
  if(event.keyCode=='40'){// si la tecla presionada es direccional abajo
    mi_lejania_y = mi_lejania_y - Math.sin(angle);
    dcha_izq = dcha_izq - Math.cos(angle);
    pintarBosque();

  }
}
function initVertexBuffers(gl) {
  var verticesColors = new Float32Array([
    // Vertex coordinates and color
     0.0, 0.0,  2.0,  0.0, 0.3,  0.0, // The back green one
    -0.5, 0.5,  0.0,  0.0,  0.3,  0.0,
     0.5, -0.5,  0.0,  0.0,  0.3,  0.0,

     0.0,  0.0,  2.0,  0.0,   0.6,  0.0, // The middle yellow one
    -0.5, -0.5,  0.0,  0.0,  0.6,  0.0,
     0.5, 0.5,  0.0,  0.0,  0.6,  0.0,
  ]);
  var n = 6;

  // Create a buffer object
  var vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Write the vertex information and enable it
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);

  var FSIZE = verticesColors.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
  gl.enableVertexAttribArray(a_Color);

  return n;
}
