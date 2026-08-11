"use strict";

/* --- DECLARACIÓN DE VARIABLES --- */
var contenedorTablero;
var modalTorre;
var btnComprar;
var btnCancelar;
var hudOro;
var hudVidas;

var oroJugador = 100;
var vidasJugador = 10;
var celdaSeleccionada = null;
var loopJuego = null;
var enemigos = [];

/* --- MATRIZ DEL MAPA (0: Terreno, 1: Camino, 2: Slot Torre) --- */
var mapaNivel1 = [
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 2, 0, 0, 2, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 1, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

/* --- RUTA DE COORDENADAS [fila, columna] --- */
var caminoCoordenadas = [
    [0, 2], [1, 2], [2, 2], [2, 3], [2, 4], 
    [2, 5], [2, 6], [3, 6], [4, 6], [4, 7], 
    [4, 8], [4, 9]
];

/* --- INICIALIZACIÓN --- */
function inicializarJuego() {
    contenedorTablero = document.getElementById("tablero-juego");
    modalTorre = document.getElementById("modal-torre");
    btnComprar = document.getElementById("btn-comprar");
    btnCancelar = document.getElementById("btn-cancelar");
    hudOro = document.getElementById("hud-oro");
    hudVidas = document.getElementById("hud-vidas");

    btnCancelar.addEventListener("click", cerrarModal);
    btnComprar.addEventListener("click", comprarTorre);

    dibujarMapa();
    
    spawnEnemigo();
    loopJuego = setInterval(actualizarJuego, 800); // Game Loop cada 800ms
}

/* --- RENDERIZADO DEL DOM --- */
function dibujarMapa() {
    contenedorTablero.innerHTML = ""; 

    for (var i = 0; i < mapaNivel1.length; i++) {
        var fila = mapaNivel1[i];
        
        for (var j = 0; j < fila.length; j++) {
            var celdaValor = fila[j];
            var celdaDiv = document.createElement("div"); 
            
            celdaDiv.classList.add("celda");
            celdaDiv.setAttribute("id", "celda-" + i + "-" + j); // ID dinámico vital para el movimiento

            if (celdaValor === 0) {
                celdaDiv.classList.add("terreno");
            } else if (celdaValor === 1) {
                celdaDiv.classList.add("camino");
            } else if (celdaValor === 2) {
                celdaDiv.classList.add("slot-torre");
                celdaDiv.addEventListener("click", clickSlotTorre);
            }

            contenedorTablero.appendChild(celdaDiv);
        }
    }
}

/* --- LÓGICA DE ENEMIGOS --- */
function spawnEnemigo() {
    enemigos.push({
        pasoActual: 0,
        vida: 100
    });
}

function actualizarJuego() {
    // Si las vidas llegan a 0, detenemos el Game Loop para evitar errores
    if (vidasJugador <= 0) {
        clearInterval(loopJuego);
        // Aquí podrías disparar un modal de Game Over (no alert)
        return; 
    }
    moverEnemigos();
}

function moverEnemigos() {
    var enemigosPrevios = document.querySelectorAll(".enemigo");
    
    // Limpieza manual del DOM (Evitamos fallos de duplicación)
    for (var k = 0; k < enemigosPrevios.length; k++) {
        enemigosPrevios[k].parentNode.removeChild(enemigosPrevios[k]);
    }

    // Actualización de posición de cada enemigo
    for (var i = 0; i < enemigos.length; i++) {
        var enemigo = enemigos[i];
        
        if (enemigo.pasoActual < caminoCoordenadas.length) {
            var coord = caminoCoordenadas[enemigo.pasoActual];
            var celdaActual = document.getElementById("celda-" + coord[0] + "-" + coord[1]);

            if (celdaActual !== null) {
                var divEnemigo = document.createElement("div");
                divEnemigo.classList.add("enemigo");
                celdaActual.appendChild(divEnemigo);
            }

            enemigo.pasoActual = enemigo.pasoActual + 1;
        } else {
            // El enemigo superó la defensa: actualización dinámica de estado
            vidasJugador = vidasJugador - 1;
            hudVidas.textContent = vidasJugador;
            
            enemigos.splice(i, 1);
            i = i - 1;
        }
    }

    // Probabilidad de aparición de nuevos enemigos
    if (Math.random() < 0.35 && vidasJugador > 0) {
        spawnEnemigo();
    }
}

/* --- LÓGICA DEL MODAL --- */
function clickSlotTorre(evento) {
    celdaSeleccionada = evento.target;
    modalTorre.classList.remove("oculto");
}

function cerrarModal() {
    modalTorre.classList.add("oculto");
    celdaSeleccionada = null;
}

function comprarTorre() {
    if (oroJugador >= 50 && celdaSeleccionada !== null) {
        oroJugador = oroJugador - 50;
        hudOro.textContent = oroJugador;
        
        celdaSeleccionada.classList.remove("slot-torre");
        celdaSeleccionada.classList.add("torre-construida");
        celdaSeleccionada.removeEventListener("click", clickSlotTorre);
        
        cerrarModal();
    } else {
        cerrarModal();
    }
}