const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world, backgroundImg;

var canvas, angle, ground, portero, porteria, pelotas;
var jugadorIMG, pelotaIMG, porteroIMG, porteriaIMG;
var pelota = [], jugador = [];

var isGameOver = false;
var score = 0;


function preload() {
  porteroIMG = loadImage("./assets/espera1.jpg");
  porteriaIMG = loadImage("./assets/fondo1.jpg");
  pelotaIMG = loadImage("./assets/pelota1.jpg");
  //backgroundMusic = loadSound("./assets/background_music.mp3");
}

function setup() {
  canvas = createCanvas(1200,600);
  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES)
  angle = 15


  ground = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
  World.add(world, ground);

  jugador =  new Jugador (350, 350, 160, 310, angle);

  pelotas = new Pelota(180, 110, 100, 50, angle);

  porteria = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
  World.add(world, porteria);
}

function draw() {
  //background(189);
  //image(backgroundImg, 0, 0, width, height);

  //if (!backgroundMusic.isPlaying()) {
    //backgroundMusic.play();
    //backgroundMusic.setVolume(0.1);
  //}

  Engine.update(engine);
 
  push();
  translate(ground.position.x, ground.position.y);
  fill("brown");
  rectMode(CENTER);
  rect(0, 0, width * 2, 1);
  pop();

  push();
  translate(porteria.position.x, porteria.position.y);
  //rotate(jugador.angle);
  imageMode(CENTER);
  image(porteriaIMG, 0, 0, 160, 310);
  pop();


   for (var i = 0; i < pelota.length; i++) {
    mostrarPelota(pelota[i], i);
    collisionWithPorteria(i);
  }

  pelotas.display();
  

  fill("#6d4c41");
  textSize(40);
  text(`Puntuación:${score}`, width - 200, 50);
  textAlign(CENTER, CENTER);
}

function collisionWithPorteria(index) {
  for (var i = 0; i < jugador.length; i++) {
    if (pelota[index] !== undefined && jugador[i] !== undefined) {
      var collision = Matter.SAT.collides(pelota[index].body, jugador[i].body);

      if (collision.collided) {
        score+=5
        jugador[i].remove(i);
        
        isGameOver=true;

        Matter.World.remove(world, pelota[index].body);
        delete pelota[index];
      }
    }
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    var pelotadisparo = new pelotaDisparo(pelotas.x, pelotas.y);
    pelotadisparo.trajectory = [];
    Matter.Body.setAngle(pelotadisparo.body, pelotas.angle);
    pelota.push(pelotadisparo);
  }
}

function mostrarPelota(pelota, index) {
  if (pelotas) {
    pelotas.display();
    //pelotas.animate();
    if (pelotas.body.position.x >= width || pelotas.body.position.y >= height - 50) {
      //DisparoSound.play()  
      pelotas.remove(index);
      
    }
  }
}


function keyReleased() {
  if (keyCode === UP_ARROW && !isGameOver) {
    //SONIDO//pelotadisparo.play(); 
    pelota[pelota.length - 1].shoot();
    console.log("disparo");
    console.log(pelota.length);
  }
}

function gameOver() {
  swal(
    {
      title: `¡Fin del juego!`,
      text: "¡Gracias por jugar!",
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
      imageSize: "150x150",
      confirmButtonText: "Jugar de nuevo"
    },
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}