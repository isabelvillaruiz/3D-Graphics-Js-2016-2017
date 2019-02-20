//Isabel Villa Ruiz

var x=400, y=400;//coordenadas iniciales de la imagen
var shapes=[];
var bullets=[];
var yodas=[];
var img1 = new Image();
img1.src = 'estrellamuerte.png';
var img2 = new Image();
img2.src = 'yoda1.png';
var asteroides = 10;
var posiciony=[];
var posicionx=[];
var posx=[];
var posy=[];
var lifes = 6;

//Funcion constructora de la nave principal//
function nave(id,img,x,y){
  this.x = x;
  this.y = y;
  this.id =id;
  this.radious = 45;
  this.img = img;
  this.speed = 0;
  this.angle = 0;
  this.moveAngle = 0;

  //Dibuja la imagen nave y el area que la rodea.
  this.draw = function(){
    ctx.beginPath()
    //ctx.save();
    ctx.arc(this.x-2,this.y,this.radious,0,2* Math.PI,false);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.closePath()

    ctx.beginPath();
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.angle);
    ctx.clearRect(0,0,1000,500);//limpia todo el canvas
    ctx.drawImage(this.img,-40,-40);//dibuja la imagen
    ctx.restore();
    ctx.closePath();
  }

  //Mueve la nave
  this.move = function(){
    this.angle += this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }
}


//Funcion constructora de las balas que dispara la nave principal
function bullet(id,x,y,radious,angle,moveAngle) {
  this.id = id;
  this.x = x;
  this.y =y;
  this.radious = radious;
  this.angle = angle;
  this.moveAngle = moveAngle;
  var F;
  F = getShape("halcon");
  this.speed = F.speed + 20;
  //Pinta las balas
  this.draw = function(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radious, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }
  //Mueve las balas//
  this.move =function(){
    //this.angle += this.moveAngle * Math.PI / 180;
    this.x += this.speed * Math.sin(this.angle);
    this.y -= this.speed * Math.cos(this.angle);
  }
}

//Funcion que nos coge los objetos dentro del array "bullets"
function getBullet(id){
  	for(var x = 0; x < bullets.length; x++){
		if(bullets[x].id === id)
		  return bullets[x];
  	}
}

//Funcion constructora de las vidas extras (Yodas)//
function yoda(id, x, y) {
  	this.id = id;
  	this.x = x;
  	this.y = y;
    this.radious = 45;

  	this.draw = function(){
      ctx.save();
      ctx.beginPath();
  		ctx.drawImage(img2, this.x,this.y);
      ctx.arc(this.x+35 ,this.y+30,this.radious,0,2*Math.PI,false);
      ctx.lineWidth = 0;
      ctx.strokeStyle = "green";
      ctx.stroke();
	}

  	this.move = function(despx) {
      	this.x = this.x + despx;
  	}
}


function createyodas(){
	var pos, distance,name;
	distance = 300;
	pos = -50;
  for(var i = 0; i < 10; i++) {
    console.log("hola");
		name = "yoda" + i;
		posx.push(pos);
		posy.push(Math.random() * (c.height - img2.height));
		yodas.push(new yoda(name, pos, posiciony[i]));
		pos -= distance;

  }
}

//Funcion constructora de los asteroides enemigos. (Estrella de la muerte)
function asteroids(id, x, y) {
  	this.id = id;
  	this.x = x;
  	this.y = y;
    this.arcox = this.x +25;
    this.arcoy = this.y +30;
    this.radious = 30;

  	this.draw = function(){
      ctx.save();
      ctx.beginPath();
  		ctx.drawImage(img1, this.x,this.y);
      ctx.arc(this.arcox ,this.arcoy,this.radious,0,2*Math.PI,false);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "red";
      ctx.stroke();
	}

  	this.move = function(despx) {
      	this.x = this.x - despx;
        this.arcox = this.arcox -despx;
  	}
}


function createasteroids(){
	var pos, distance,name;
	distance = 300;
	pos = 900;
  for(var i = 0; i < 20; i++) {
    console.log("hola");
		name = "asteroids" + i;
		posicionx.push(pos);
		posiciony.push(Math.random() * (c.height - img1.height));
		shapes.push(new asteroids(name, pos, posiciony[i]));
		pos += distance;

  }
}
//Llama a todas las funciones draw de los objetos en los arrays
function drawShapes() {
    ctx.clearRect(0, 0, c.width, c.height);
    borders();
    for(x in shapes) {
      shapes[x].draw();
    }
    for(x in bullets) {
      console.log("Pintando bullets")
      bullets[x].draw();
    }
    for(x in yodas) {
      console.log("Pintando yodas")
      yodas[x].draw();
    }
}
//Funcion que coge objetos del array Shapes
function getShape(id){
  	for(var x = 0; x < shapes.length; x++){
		if(shapes[x].id === id)
		  return shapes[x];
  	}
}



//Funcion que comprueba los bordes del canvas//
function borders(){
   var N;
   N = getShape("halcon");
   console.log(N);
   if (N.x >1000){
     N.x = 0;
   }
   if (N.x < 0){
     N.x = 1000;
   }
   if(N.y<-50){
     N.y = 500;
   }
   if(N.y >500){
     N.y = -50;
   }
}

//Funcion que comprueba que los disparos al salir del canvas se eliminen//
function bullets_borders(){
  for (var x = 0; x < bullets.length; x++){
    console.log("Recorcholis");
    if(bullets[x] !== undefined){
      console.log("y mas Recorcholis");
      if ((bullets[x].x) >1000){
        console.log(bullets[x].x);
        bullets.splice(x,1);
      }
      if ((bullets[x].x) < 0){
        bullets.splice(x,1);
      }
      if((bullets[x].y)<-50){
        bullets.splice(x,1);
      }
      if((bullets[x].y) >500){
        bullets.splice(x,1);
      }
    }
  }
}


//Funcion que comprueba las colisiones de la nave con los asteroides
function colision(){
var K;
K = getShape("halcon");
  for(var x=1 ; x < shapes.length ; x++){
    part1 = Math.pow((K.x-shapes[x].arcox),2);
    part2 = Math.pow((K.y-shapes[x].arcoy),2);
    condition = Math.sqrt(part1+part2);
    resta_radios = K.radious + shapes[x].radious;
    if(condition <= resta_radios ){
      shapes.splice(x,1);
      console.log("TRUENOS Y CENTELLAS")
      lifes = lifes-1;
      document.getElementById('VIDAS').innerHTML = "Te quedan: "+ lifes +" Vidas";
      if(lifes == 0){
        confirm("GAME OVER");
        location.reload(true);
      }
    }
  }
}
//Funcion que comprueba las colisiones de la nave con los "yodas"//
function getyodalife(){
var K;
K = getShape("halcon");
  for(var x=0 ; x < yodas.length ; x++){
    part1 = Math.pow((K.x-yodas[x].x),2);
    part2 = Math.pow((K.y-yodas[x].y),2);
    condition = Math.sqrt(part1+part2 );
    resta_radios = K.radious + yodas[x].radious;
    if(condition < resta_radios ){
      yodas.splice(x,1);
      console.log("TRUENOS Y CENTELLAS")
      if(lifes<=5){
        lifes = lifes + 1;
        document.getElementById('VIDAS').innerHTML = "Te quedan: "+ lifes +" Vidas";
      }
    }
  }
}
//Funcion que comprueba las colisiones de los disparos con los asteroides
function acierto(){
  for(var x = 0; x < bullets.length; x++){
    for(var y = 1 ; y < shapes.length; y++){
      part1 = Math.pow((shapes[y].x-bullets[x].x),2);
      part2 = Math.pow((shapes[y].y-bullets[x].y),2);
      condition = Math.sqrt(part1+part2);
      resta_radios = bullets[x].radious + shapes[x].radious;
      if(condition < resta_radios ){
        bullets.splice(x,1);
        shapes.splice(y,1);
        console.log("TRUENOS Y CENTELLAS");
      }
    }
  }
}

//Funcion de movimiento respecto a las teclas
function whichButton(event){
var N;
N = getShape("halcon");
if(event.keyCode=='39'){//si la tecla presionada es direccional derecho


//N.x=N.x+5;//mueve la nave 5 pixeles a la derecha
N.moveAngle = N.moveAngle +1;
//
borders();
N.move();
borders();
console.log(N.x)
drawShapes();
borders();
console.log("hola");



}

if(event.keyCode=='37'){//si la tecla presionada es direccional izquierdo
//N.x=N.x-5;//mueve la nave 5 pixeles a la derecha
N.moveAngle = N.moveAngle -1;
//N.speed = 1;
borders();
N.move();
borders();
console.log(N.x)
drawShapes();
borders();
console.log("hola");

// rotateleft();

}

if(event.keyCode=='38'){//si la tecla presionada es direccional arriba

// y=y-5;//sube la nave
// nave();
//N.y=N.y-5;//mueve la nave 5 pixeles a la derecha
  N.speed =  N.speed + 1;
  borders();
  N.move();
  borders();
  console.log(N.x)
  drawShapes();
  borders();
  console.log("hola");
}

if(event.keyCode=='40'){// si la tecla presionada es direccional abajo

// y=y+5;//baja la nave
// nave();
//N.y=N.y+5;//mueve la nave 5 pixeles a la derecha
  N.speed =N.speed -1;
  borders();
  N.move();
  borders();
  console.log(N.x)
  drawShapes();
  borders();
  console.log("hola");
}
if(event.keyCode=='32'){
  console.log(N.moveAngle);
  bullets.push(new bullet("bullet",N.x,N.y,5,N.angle,N.moveAngle));
  console.log("barra espaciadora")
  drawShapes();
}
}
//Funcion que se llama cada 100ms para que renove posiciones de los movimientos
function render() {

for(var x = 0; x < shapes.length; x++){
  if(shapes[x] !== undefined){
    console.log("hola")
    colision();
    acierto();
    shapes[x].move(5);
    acierto();
    drawShapes();
    colision();
    if(shapes[x].x < 0){
      shapes[x].x = 900;
      drawShapes();
      acierto();
    }
  }
  drawShapes();
}
for (var x = 0; x < bullets.length; x++){
  if(bullets[x] !== undefined){
    acierto();
    console.log("hola 2");
    bullets[x].move();
    acierto();
    drawShapes();
    bullets_borders();
    if(bullets[x].x < 0){
      bullets[x].x = 900;
      drawShapes();
      bullets_borders();
      acierto();
    }
  }
   drawShapes();
 }


 for(var x = 0; x < yodas.length; x++){
   if(yodas[x] !== undefined){
     console.log("hola")
     getyodalife();
     yodas[x].move(2);
     drawShapes();
     getyodalife();
     if(yodas[x].x > 1000){
       yodas[x].x = 0;
       drawShapes();
       getyodalife();
     }
   }
   getyodalife();
   drawShapes();
 }
}
function main(){
  c=document.getElementById("myCanvas");
  ctx=c.getContext("2d");
  shapes.push(new nave("halcon",document.getElementById("ima"),400,200));
  //shapes.push(new asteroids("c2", 400, 100, 20, 'rgba(0, 255, 0, 0.7)'));
  createasteroids();
  createyodas();
  drawShapes();
  borders();
  bullets_borders();
  setInterval(render,100);
}
