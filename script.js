// Récupération des éléments HTML5
const score = document.querySelector(".score");
const startScreen = document.querySelector(".start__screen");
const gameArea = document.querySelector(".game__area");
const level = document.querySelector(".level");

// Chargement des fichiers audio
const gameStart = new Audio();
const gameOver = new Audio();

gameStart.src = "audio/game.mp3";
gameOver.src = "audio/game_over.mp3";

// Création de l'objet levelSpeed
const levelSpeed = {
  easy: 5,
  moderate: 7,
  difficult: 10,
};

// Création de l'objet keys
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

// Ecoute de l'événement "keydown" sur le document
document.addEventListener("keydown", (e) => {
  // Suppression du comportement par défaut
  e.preventDefault();
  keys[e.key] = true;
});

// Ecoute de l'événement "Keyup" sur le document
document.addEventListener("keyup", (e) => {
  // Suppression du comportement par défaut
  e.preventDefault();
  keys[e.key] = false;
});

// Création de l'objet player
const player = {
  speed: 5,
  score: 0,
};

// Ecoute de l'événement "click"
level.addEventListener("click", (e) => {
  // Récupération du niveau de difficulté
  player.speed = levelSpeed[e.target.id];
});

// Création de la fonction is Collide qui va permettre de gérer la collision entre les véhicule
const isCollide = (a, b) => {
  // La méthode getBoundingClientRect() retourne un objet DOMRect fournissant des informations sur la taille d'un élément et sa position relative par rapport à la zone d'affichage.
  aRect = a.getBoundingClientRect();
  bRect = b.getBoundingClientRect();

  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
};

// Création de la fonction moveLines qui va permettre de faire bouger les lignes de la route
const moveLines = () => {
  // Récupération des éléments html ayant la classe road__lines
  const lines = document.querySelectorAll(".road__lines");
  // Pour chaque ligne
  lines.forEach((item) => {
    if (item.y >= 700) {
      item.y -= 750;
    }

    item.y += player.speed;
    item.style.top = item.y + "px";
  });
};

// Création de la fonction endgame qui va gérer le scénario défaite
const endgame = () => {
  player.start = false;
  // Stop gameStart musique
  gameStart.pause();
  // Mise en route de gameOver musique
  gameOver.play();
  // Retrait de la classe hide
  startScreen.classList.remove("hide");
  startScreen.innerHTML =
    "Game Over <br><br> Votre score est de : " +
    player.score +
    ".<br> Cliquez ici pour rejouer.";
};

// Création de la fonction moveEnemy ayant comme paramètre car qui va gérer le déplacement des autres véhicules
const moveEnemy = (car) => {
  // Récupération des éléments HTML ayant la classe enemy__car
  const enemy = document.querySelectorAll(".enemy__car");
  // Pour chaque enemy
  enemy.forEach((item) => {
    // Condition if qui vérifie la collision
    if (isCollide(car, item)) {
      console.log("Collision !!");
      // Appel de la fonction endgame()
      endgame();
    }

    // condition if
    if (item.y >= 750) {
      item.y = -350;
      item.style.left = Math.floor(Math.random() * 350) + "px";
    }
    item.y += player.speed;
    item.style.top = item.y + "px";
  });
};

// Création de la fonction gamePlay qui va permettre de gérer la logique du jeu
const gamePlay = () => {
  // Récupération de l'élément ayant la classe car
  const car = document.querySelector(".car");
  const road = gameArea.getBoundingClientRect();
  // Condition if
  if (player.start) {
    // Retrait de la classe hide
    score.classList.remove("hide");
    // Appel de la fonction moveLines
    moveLines();
    // Appel de la fonction moveEnemey ayant commen paramètre car
    moveEnemy(car);

    if (keys.ArrowUp && player.y > road.top + 30) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown && player.y < road.bottom - 85) {
      player.y += player.speed;
    }
    if (keys.ArrowLeft && player.x > 0) {
      player.x -= player.speed;
    }
    if (keys.ArrowRight && player.x < road.width - 50) {
      player.x += player.speed;
    }

    car.style.top = player.y + "px";
    car.style.left = player.x + "px";

    // La méthode window.requestAnimationFrame() indique au navigateur qu'on souhaite exécuter une animation et demande que celui-ci exécute une fonction spécifique de mise à jour de l'animation, avant le prochain rafraîchissement à l'écran du navigateur.
    window.requestAnimationFrame(gamePlay);

    // Incrémentation du score
    player.score++;
    const ps = player.score - 1;
    score.innerHTML = "Score: " + ps;
  }
};

// Déclaration de la fonction start qui va permettre la création des différents éléments pour le jeu
const start = () => {
  gameArea.classList.remove("hide");
  startScreen.classList.add("hide");
  gameArea.innerHTML = "";

  player.start = true;
  // Stop gameOver musique
  gameOver.pause();
  // mise en route de la musique
  gameStart.play();
  gameStart.loop = true;
  player.score = 0;
  window.requestAnimationFrame(gamePlay);

  // boucle for
  for (let i = 0; i < 5; i++) {
    // Création d'élément div ayant la classe road__lines
    const roadLine = document.createElement("div");
    roadLine.setAttribute("class", "road__lines");
    roadLine.y = i * 150;
    roadLine.style.top = roadLine.y + "px";
    // Ajout de l'élément div créé dans le DOM
    gameArea.appendChild(roadLine);
  }

  // Création de l'élément div ayant la classe car
  const car = document.createElement("div");
  car.setAttribute("class", "car");
  // Ajout de l'élément div créé dans le DOM
  gameArea.appendChild(car);

  player.x = car.offsetLeft;
  player.y = car.offsetTop;

  // console.log("Top Position : " + car.offsetTop);
  // console.log("Left Position : "+ car.offsetLeft)

  // boucle for
  for (let i = 0; i < 3; i++) {
    // Création d'élément div ayant la classe enemy__car
    const enemyCar = document.createElement("div");
    enemyCar.setAttribute("class", "enemy__car");
    enemyCar.y = (i + 1) * 350 * -1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
    // Ajout de l'élément div créé dans le DOM
    gameArea.appendChild(enemyCar);
  }
};

// Ecoute de l'élément click sur la zone de jeu et appel de la fonction start
startScreen.addEventListener("click", start);
