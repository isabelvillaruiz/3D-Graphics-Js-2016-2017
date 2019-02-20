var VSHADER_SOURCE =
  'attribute vec3 a_VertexPosition;\n' +
  'attribute vec2 a_TextureCoord;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'varying highp vec3 v_Lighting;\n' +
  'varying highp vec2 v_TextureCoord;\n' +
  'varying highp vec4 v_vertexPosition;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * vec4(a_VertexPosition, 1.0);\n' +
  '  v_TextureCoord = a_TextureCoord;\n' +
  '  v_vertexPosition = vec4(a_VertexPosition, 1.0);\n' +
  '  highp vec3 ambientLight = vec3(0.5 , 0.5, 0.5);\n' +
  '  v_Lighting = ambientLight;\n' +
  '}\n';


var x = false;

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying highp vec3 v_Lighting;\n' +
  'varying highp vec2 v_TextureCoord;\n' +
  'varying highp vec4 v_vertexPosition;\n' +
  'varying highp vec4 v_Fog_Colored;\n' +

  'uniform highp vec3 u_Fog_Colored;\n' +

  //vec3(0.5, 0.5, 0.5)
  'highp vec3 fogColor = (u_Fog_Colored);\n' +
  'const highp float FogDensity = 0.1;\n' +
  'const highp float fogStart = -1.0;\n' +
  'const highp float fogEnd = 0.5;\n' +


  'uniform sampler2D u_Sampler;\n' +

  'uniform sampler2D u_image0;\n' +
  'uniform sampler2D u_image1;\n' +
  'void main() {\n' +

  '	 highp float fogFactor = ((v_vertexPosition.z/v_vertexPosition.w)-fogStart) / (fogEnd - fogStart);\n' +
  '	 fogFactor = clamp( fogFactor, 0.0, 1.0 );\n' +

  '  highp vec4 color0 = texture2D(u_image0, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
  '  highp vec4 color1 = texture2D(u_image1, vec2(v_TextureCoord.s, v_TextureCoord.t));\n' +
  '  highp vec4 total_color = (color0 * color1);\n' +

  '  gl_FragColor = vec4(fogColor*(1.0-fogFactor), 1.0) + fogFactor*vec4( (total_color.rgb * v_Lighting.rgb) , total_color.a)  ;\n' +
  '}\n';

var mi_altura = 0.5;
var mi_altura2 = 0.5;
var position_y = 20;
var position_x = 20;
var angle = 0;
var moveAngle = 0;
//var angulo_vision = [Math.cos(angle),Math.sin(angle)];
var gl;
var canvas;



var FogUniform;

var level = 1;

var mMatrix   = new Matrix4();
var vMatrix   = new Matrix4();
var pMatrix   = new Matrix4();
var mvpMatrix = new Matrix4();

var u_MvpMatrix;
var u_Fog_Colored;

var cubos =[];
var suelo =[];
var cube_player = [];


var cubeTexture;
var marbleTexture;
var floorTexture;

var texturas = ["fotos/textura1.png","fotos/textura2.png","fotos/textura3.png","fotos/textura4.png","fotos/textura5.png","fotos/textura6.png"];
var suelos = ["fotos/suelo1.png","fotos/suelo2.png","fotos/suelo3.png","fotos/suelo4.png","fotos/suelo5.png","fotos/suelo6.png"];
//var cubeVerticesBuffer;
var cubeVerticesIndexBuffer;
var cubeVerticesTextureCoordBuffer;

var vertexFloorBuffer;
var floorVerticesTextureCoordBuffer;
var floorVerticesIndexBuffer;


var canvas2d = document.getElementById('2d');
var ctx_2d = canvas2d.getContext('2d');
// var my_maze = new Maze(MAZESZ);
var my_maze;

var puntos = 0;
var tiempo = 70;



function cubo(id,matriz){
this.id = id;
this.matriz = matriz;
}

function floor(id,matriz){
  this.id = id;
  this.matriz = matriz;
  //suelo.push(new floor("suelo",matriz));
}



function time_out(){
  tiempo = tiempo-1;
  setTimeout("time_out()",1000);
  ctx_2d.clearRect(0,0,1250,600);
  ctx_2d.font = '20px sans';
  ctx_2d.fillStyle = "white";
  ctx_2d.fillText("Puntos = " + puntos, 150, 50);
  ctx_2d.fillText("Tiempo = " + tiempo, 150, 100);
  if(tiempo == 0){
    alert("HAS PERDIDO, INTENTALO DE NUEVO");
    location.reload(true);
  }
}



function laberinto(){
  var pos = 0;
  var matriz = new Matrix4();
  suelo.push(new floor("suelo",matriz));
  for (var i = 0; i < my_maze.rooms.length; i++){
      for (var j = 0; j < my_maze.rooms.length; j++){
         if(my_maze.rooms[i][j] === false){
            var matriz = new Matrix4();
            cubos.push(new cubo("cubo",matriz));
            cubos[pos].matriz = cubos[pos].matriz.translate(i,j, 1/2);
            cubos[pos].matriz = cubos[pos].matriz.scale(1/2,1/2,1/2);
            pos = pos +1;
          }
      }
  }
}



function initial_position(){
  for(var i = 0; i < my_maze.rooms.length; i++){
    if(my_maze.rooms[i][i]==true){
      my_maze.pos.x = i;
      my_maze.pos.y = i;
    }
  }
}




function choques(x,y){
  console.log("lab",my_maze.rooms[x][y])
  console.log(x);
  console.log(y);
  if(my_maze.rooms[x][y] === false){
    return true;
  }
  if(x == 0){
    if(y == 0){
      alert("CONGRATS");
      level = level +1;
      console.log("nivel una vez pasado",level)
      levels(level);
    }
  }
}


function color_fogs(level){
  if(level==1){
    FogUniform = gl.getUniformLocation(gl.program, "u_Fog_Colored");
    gl.uniform3fv(FogUniform,[0.1,0.7,0.7]);
  }else if (level==2){
    FogUniform = gl.getUniformLocation(gl.program, "u_Fog_Colored");
    gl.uniform3fv(FogUniform,[0.1,0.7,0.1]);
  }else if(level==3){
    FogUniform = gl.getUniformLocation(gl.program, "u_Fog_Colored");
    gl.uniform3fv(FogUniform,[0.7,0.1,0.1]);
  }else if(level==4){
    FogUniform = gl.getUniformLocation(gl.program, "u_Fog_Colored");
    gl.uniform3fv(FogUniform,[0.8,0.8,0.0]);
  }else if(level==5){
    FogUniform = gl.getUniformLocation(gl.program, "u_Fog_Colored");
    gl.uniform3fv(FogUniform,[0.1,0.1,0.1]);
  }else if(level==6){
    FogUniform = gl.getUniformLocation(gl.program, "u_Fog_Colored");
    gl.uniform3fv(FogUniform,[0.0,0.0,0.0]);
  }
}


function levels(level){
  console.log("NIVEL",level);
  switch (level) {
    case 2:
      alert("LEVEL 2 ¡GOOD LUCK!!");
      puntos = tiempo;
      tiempo = puntos + tiempo + 70;
      cubos.splice(1,cubos.length);
      suelo.splice(1,suelo.length);
      main();
      break;
    case 3:
      alert("LEVEL 3 ¡GOOD LUCK!!");
      puntos = tiempo;
      tiempo = puntos + tiempo + 20;

      cubos.splice(1,cubos.length);
      suelo.splice(1,suelo.length);
      main();
      break;
    case 4:
      alert("LEVEL 4 ¡GOOD LUCK!!");
      puntos = tiempo;
      tiempo = puntos + tiempo + 20;

      cubos.splice(1,cubos.length);
      suelo.splice(1,suelo.length);
      main();
      break;
    case 5:
      alert("LEVEL 5 ¡GOOD LUCK!!");
      puntos = tiempo;
      tiempo = puntos + tiempo + 20;
      cubos.splice(1,cubos.length);
      suelo.splice(1,suelo.length);
      main();
      break;
    case  6:
      alert("LEVEL 6 ¡GOOD LUCK!!");
      puntos = tiempo;
      tiempo = puntos + tiempo + 20;
      cubos.splice(1,cubos.length);
      suelo.splice(1,suelo.length);
      main();
      break;
    case 7:
      alert("¡HAS GANADO!");
      puntos = tiempo;
      alert("Tu puntuacion ha sido de: " + puntos)
      location.reload(true);
  }
}


function main() {



  canvas = document.getElementById('webgl');

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

  u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
  if (!u_MvpMatrix) {
    console.log('Failed to get the storage location of u_MvpMatrix');
    return;
  }

  if(level==1){
    alert('*************** LABERINTO DE LOS ELEMENTOS  ***************\n\n' +
          'Consigue terminar el laberinto lo mas rápido posible.\n' +
                  "                                           \n" +
                  " ASWD  --> Movimineto camara                \n" +
                  " Pulsar T para Camara Aerea                \n" +
                  " Pulsar E para Camara en 3º Persona        \n" +
                  " Cruza los 6 niveles para ganar            \n" +
                  " Lea el 'leeme' para mas especificaciones. \n" +
                  " ¡¡¡¡¡BUENA SUERTE!!!!!                    \n");
    time_out();
  }

  color_fogs(level);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
  my_maze = new Maze(MAZESZ);
  my_maze.randPrim(new Pos(0, 0));
  //my_maze.determ(new Pos(0, 0));
    // my_maze.pos.x = 1;
    // my_maze.pos.y = 1;
   initial_position();
   position_x = my_maze.pos.x;
   position_y = my_maze.pos.y ;

  ctx_2d.clearRect(0,0,canvas.width,canvas.height);
  ctx_2d.font = '20px verdana';
  ctx_2d.fillStyle = "white";
  ctx_2d.fillText("Puntos = " + puntos, 150, 50);

  my_maze.draw(ctx_2d, 0, 0, 5, 0);

  pMatrix.setPerspective(90, canvas.width/canvas.height, 0.005, 200);



  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  laberinto();


  initBuffers();
  initTextures();
  initFloorBuffer();
  initFloorTextures();

  pintarLaberinto();
  //requestAnimationFrame(pintarLaberinto);
  pintarFloor();
  //requestAnimationFrame(pintarFloor);

}



var button = [0,1];

//Funcion de movimiento respecto a las teclas
function whichButton(event){
  if(event.keyCode=='68'){//si la tecla presionada es direccional derecho
      moveAngle = moveAngle -(2);
      angle = moveAngle * Math.PI/180;

  }
  if(event.keyCode=='65'){//si la tecla presionada es direccional izquierdo
      moveAngle = moveAngle -(-2);
      angle = moveAngle * Math.PI/180;
  }
  if(event.keyCode=='87'){//si la tecla presionada es direccional arriba
      pos_x = ((position_x + 0.06*Math.cos(angle)));
      pos_y = ((position_y + 0.06*Math.sin(angle)));
      futura_position_x = Math.round(pos_x);
      futura_position_y = Math.round(pos_y);
      if(choques(futura_position_x,futura_position_y) != true){
        position_y = position_y + 0.06*Math.sin(angle);
        position_x = position_x + 0.06*Math.cos(angle);
    }
  }
  if(event.keyCode=='83'){// si la tecla presionada es direccional abajo
    pos_x = ((position_x - 0.06*Math.cos(angle)));
    pos_y = ((position_y - 0.06*Math.sin(angle)));
    futura_position_x = Math.round(pos_x);
    futura_position_y = Math.round(pos_y);
    if(choques(futura_position_x,futura_position_y) != true){
      position_y = position_y - 0.06*Math.sin(angle);
      position_x = position_x - 0.06*Math.cos(angle);
      }
    }
  if(event.keyCode=='84'){
    if(button[0] == '0'){
      mi_altura = 5;
      mi_altura2 = 0;
      button[0] = "84";
      console.log(button[0]);
    }else if (button[0] == '84'){
      mi_altura = 0.5;
      mi_altura2 = 0.5;
      button[0] = "0";
      console.log(button[0]);
    }
  }
  if(event.keyCode=='69'){
    if(button[1] == '1'){
      mi_altura = 2;
      mi_altura2 = 0;
      button[1] = "69";
      console.log(button[0]);
    }else if (button[1] == '69'){
      mi_altura = 0.5;
      mi_altura2 = 0.5;
      button[1] = "1";
      console.log(button[0]);
    }
  }
}


function initBuffers() {


  cubeVerticesBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);

  var vertices = new Float32Array([
    -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,   // Front face
    -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0, -1.0,   // Back face
    -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0,   // Top face
    -1.0, -1.0, -1.0,  1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,   // Bottom face
     1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,   // Right face
    -1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0    // Left face
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
//////////////////////////////////////////////////////////////////////////////////
  cubeVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);

  var textureCoordinates = new Float32Array([
    0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Front
    0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Back
    0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Top
    0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Bottom
    0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0,  // Right
    0.0,  0.0,     1.0,  0.0,     1.0,  1.0,     0.0,  1.0   // Left
  ]);

  gl.bufferData(gl.ARRAY_BUFFER, textureCoordinates, gl.STATIC_DRAW);
//////////////////////////////////////////////////////////////////////
  cubeVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

  var cubeVertexIndices = new Uint16Array([
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23    // left
  ]);

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, cubeVertexIndices, gl.STATIC_DRAW);
  /////////////////////////////////////////////////////////////////////////////////
}



function initFloorBuffer() {

    //              v1 .  .  .  .  . v2
    //           .                 .
    //       .                  .
    //    .                  .
    // v0 .  .  .   .   .  v3

  var verticesFloor = new Float32Array([
    -100.0,  -100.0, 0.0, //v0
    -100.0,  100.0, 0.0, //v1
     100.0,   100.0, 0.0, //v2
     100.0, -100.0,  0.0, //v3

    // -100.0, -100.0,  0.0, //v0
    // 100.0,  100.0,  0.0, //v2
    //  100.0, -100.0,  0.0, //v3
  ]);

  // Create a buffer object
  vertexFloorBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexFloorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesFloor, gl.STATIC_DRAW);

//////////////////////////////////////////////////////////////////////////////////
  var textureFloorCoordinates = new Float32Array([
    0.0,  0.0,     200.0,  0.0,     200.0,  200.0,     0.0,  200.0,  // Front
    //0.0,  0.0,     200.0,  0.0,     200.0,  200.0,     0.0,  200.0,  // Front

  ]);

  floorVerticesTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, floorVerticesTextureCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, textureFloorCoordinates, gl.STATIC_DRAW);
//////////////////////////////////////////////////////////////////////


  var floorVertexIndices = new Uint16Array([
    0,  1,  2,   0,  2,  3
  ]);

  floorVerticesIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, floorVertexIndices, gl.STATIC_DRAW);
  /////////////////////////////////////////////////////////////////////////////////
}


///////////////////////INICIALIZAR TEXTURAS LABERINTO/////////////////////////////
function initTextures() {
  cubeTexture = gl.createTexture();
  //Cube texture es donde se guarda a textura
  gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
  //A partir de ahora me refiero a una textura 2d que dse refiere a CubeTexture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));
              //
  var cubeImage = new Image();
  cubeImage.onload = function() { handleTextureLoaded(cubeImage, cubeTexture); }
  cubeImage.src = "fotos/pared2.png";



  marbleTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, marbleTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));
  var marbleImage = new Image();
  marbleImage.onload = function() { handleTextureLoaded(marbleImage, marbleTexture); }
  console.log("NIVEL-TEXTURA",texturas[level]);
  marbleImage.src = texturas[level-1];
}

function handleTextureLoaded(image, texture) {

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
        gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
}

////////////////////////////INICIALIZAR TEXTURAS "FLOOR"//////////////////////////////////
function initFloorTextures() {
  floorTexture = gl.createTexture();
  //Cube texture es donde se guarda a textura
  gl.bindTexture(gl.TEXTURE_2D, floorTexture);
  //A partir de ahora me refiero a una textura 2d que dse refiere a CubeTexture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
              new Uint8Array([0, 0, 255, 255]));
              //
  var floorImage = new Image();
  floorImage.onload = function() { handleTextureLoaded_floor(floorImage); }
  floorImage.src = suelos[level-1];
}

function handleTextureLoaded_floor(image) {
  gl.bindTexture(gl.TEXTURE_2D, floorTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //CUANDO TE ACERCAS, define la resolucion al acercarte, como interpolar la textur segun te acercas
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
  //CUANDO TE ALEJAS lo mismo para alejarte del punto.
  //MIPMAP --> Una imagen con imagenes dentro minimizadas.
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.bindTexture(gl.TEXTURE_2D, null);
  //Acaba de configurar la textura
}


function pintarLaberinto() {

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  requestAnimationFrame(pintarLaberinto);
  my_maze.pos.x = Math.round(position_x);
  my_maze.pos.y = Math.round(position_y);
  my_maze.draw(ctx_2d, 0, 0, 5, 0)

  for(x in cubos) {
    vMatrix.setLookAt(position_x, position_y, mi_altura,position_x+Math.cos(angle),position_y+Math.sin(angle),mi_altura2, 0, 0, 1);
    mvpMatrix.set(pMatrix).multiply(vMatrix).multiply(cubos[x].matriz);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    var vertexPositionAttribute = gl.getAttribLocation(gl.program, "a_VertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    var textureCoordAttribute = gl.getAttribLocation(gl.program, "a_TextureCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);


    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesTextureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

    //************TEXTURAS COMBINADAS*****************************//

    var u_image0Location = gl.getUniformLocation(gl.program, "u_image0");
    var u_image1Location = gl.getUniformLocation(gl.program, "u_image1");



    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, marbleTexture);

    gl.uniform1i(u_image0Location, 0);
    gl.uniform1i(u_image1Location, 1);

    gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);



  }
}

function pintarFloor() {

  //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  requestAnimationFrame(pintarFloor);
  my_maze.pos.x = Math.round(position_x);
  my_maze.pos.y = Math.round(position_y);
  my_maze.draw(ctx_2d, 0, 0, 5, 0);


  for(x in suelo) {
    vMatrix.setLookAt(position_x, position_y, mi_altura,position_x+Math.cos(angle),position_y+Math.sin(angle),mi_altura2, 0, 0, 1);
    mvpMatrix.set(pMatrix).multiply(vMatrix).multiply(suelo[x].matriz);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    var vertexPositionAttribute = gl.getAttribLocation(gl.program, "a_VertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);

    var textureCoordAttribute = gl.getAttribLocation(gl.program, "a_TextureCoord");
    gl.enableVertexAttribArray(textureCoordAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER,vertexFloorBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER,floorVerticesTextureCoordBuffer);
    gl.vertexAttribPointer(textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);




    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, floorTexture);
    gl.uniform1i(gl.getUniformLocation(gl.program, "u_Sampler"), 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, floorVerticesIndexBuffer);

    gl.drawElements(gl.TRIANGLES, 6 , gl.UNSIGNED_SHORT, 0);

  }

}
