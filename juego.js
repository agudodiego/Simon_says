// "use strict"

const $titulo = document.querySelector(".titulo");

const $color0 = document.querySelector(".container__tecla0");
const $color1 = document.querySelector(".container__tecla1");
const $color2 = document.querySelector(".container__tecla2");
const $color3 = document.querySelector(".container__tecla3");

const $score = document.querySelector(".score");

const $btnStart = document.querySelector(".btn-start");

const $colores = [$color0, $color1, $color2, $color3];
let secuenciaSimon = [];
let jugada = 0; // representa cada jugada dentro de una ronda, en cada ronda se resetea
let contador = 0;
let puedeJugar;

// DECLARACION DE FUNCIONES ********************************

//funcion para prender/apagar cada tecla
const prenderApagarBoton = (indice, time) => {

    if (indice === "pausa") {
        // lo siguiente retorna una promesa vacia, es solo para agregar una pausa
        // 150 es el tiempoo de espera
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 450);
        })
    } else {
        //al entrar "enciendo" el color
        $colores[indice].classList.toggle("encendido");

        //luego de unos segundos "apaga" el color
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve($colores[indice].classList.toggle("encendido"));
            }, time);
        })
    }
}

//funcion asincrona para la secuencia de luces de bienvenida
const lucesBienvenida = async () => {
    // en cada await espero a que se complete la accion para
    // pasar a la siguiente linea.
    await prenderApagarBoton(0, 150);
    await prenderApagarBoton(1, 150);
    await prenderApagarBoton(2, 150);
    await prenderApagarBoton(3, 150);

    // repito una vez mas la secuencia de luces
    await prenderApagarBoton(0, 150);
    await prenderApagarBoton(1, 150);
    await prenderApagarBoton(2, 150);
    await prenderApagarBoton(3, 150);

    // hago una pausa antes de iniciar el juego
    setTimeout(() => {
        agregarColorSecuencia();
    }, 800);
}

//funcion que agrega aleatoreamente un color
function agregarColorSecuencia() {
    // genero un numero del 0 al 3
    let indiceAleatorio = Math.round(Math.random() * 3);
    // cargo el array con el numero más una "pausa"
    // |1|pausa|2|pausa|1|... asi quedaria el array
    secuenciaSimon.push(indiceAleatorio);
    secuenciaSimon.push("pausa");
    // cada vez que un nuevo color es agregado se ejecuta 
    // la secuencia de luces
    reproducirSecuencia();
}

//funcion que reproduce la secuencia aleatorea
const reproducirSecuencia = async () => {
    let tiempoEspera = 500;
    for (let i = 0; i < secuenciaSimon.length; i++) {
        await prenderApagarBoton(secuenciaSimon[i], tiempoEspera);
    }
    puedeJugar = true;
    // dps de esto queda a la espera de que el usuario haga su jugada
}

function resetearJuego() {
    $titulo.innerText = "Simon-Says...";
    puedeJugar = false;

    // habilito el juego
    $color0.classList.toggle("perdiste");
    $color1.classList.toggle("perdiste");
    $color2.classList.toggle("perdiste");
    $color3.classList.toggle("perdiste");

    // reseteo variables
    jugada = 0;
    contador = 0;

    // reseteo el array
    secuenciaSimon = [];
}


const compararConSecuencia = async (teclaPresionada) => {

    await prenderApagarBoton(teclaPresionada, 350);
    await prenderApagarBoton("pausa");
    if (teclaPresionada === secuenciaSimon[jugada]) {
        // aumento de a 2 para saltearme la "pausa"
        jugada = jugada + 2;
        // muestro en pantalla
        contador++;
        $score.innerText = `Total: ${contador}`
        // habilito nuevamente el juego
        puedeJugar = true;
    } else {
        // si apreto el color equivocado muestra perdiste
        $titulo.innerText = "😢 Perdiste 😢";

        // pongo el juego en gris
        $color0.classList.toggle("perdiste");
        $color1.classList.toggle("perdiste");
        $color2.classList.toggle("perdiste");
        $color3.classList.toggle("perdiste");

        // habilito boton de inicio para comenzar nuevamente
        $btnStart.removeAttribute("disabled");
        $btnStart.classList.toggle("deshabilitarBoton");
    }

    if (jugada === secuenciaSimon.length) {
        // cuando la cantidad de jugadas recorrio todos los colores
        // se resetea la jugada para comenzar una nueva ronda agregando un color
        puedeJugar = false;
        jugada = 0;
        agregarColorSecuencia();
    }
}


// JUGABILIDAD *********************************************

document.addEventListener("click", (e) => {

    if (e.target.matches(".btn-start")) {
        resetearJuego();        

        // deshabilito boton de inicio
        $btnStart.setAttribute("disabled", "true");
        $btnStart.classList.toggle("deshabilitarBoton");

        lucesBienvenida();
    }

    if (puedeJugar && e.target.matches(".container div")) {
        // guardo el data-attribute del div
        const teclaPresionada = Number(e.target.getAttribute("data-num"));
        // bloqueo la posibilidad de presionar algún boton
        puedeJugar = false;
        // mando la tecla presionada a compararse con la secuenciaSimon
        compararConSecuencia(teclaPresionada);
    }
});
