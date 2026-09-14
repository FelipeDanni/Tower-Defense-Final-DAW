"use strict";

/* --- VARIABLES GLOBALES --- */
var contenedorTablero;
var modalTorre;
var modalGameOver;
var modalVictoria;
var btnComprar;
var btnCancelar;
var btnReiniciar;
var btnReiniciarVictoria;
var hudOro;
var hudVidas;
var hudPuntos;
var spanPuntajeFinal;
var spanPuntajeVictoria;

var oroJugador = 100;
var vidasJugador = 10;
var puntosJugador = 0;
var celdaSeleccionada = null;
var loopJuego = null;
var enemigos = [];
var torresActivas = [];

var mapaNivel1 = [
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 2, 0, 0, 2, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 1, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

var caminoCoordenadas = [
    [0, 2], [1, 2], [2, 2], [2, 3], [2, 4], 
    [2, 5], [2, 6], [3, 6], [4, 6], [4, 7], 
    [4, 8], [4, 9]
];

/* --- INICIALIZACIÓN --- */
function inicializarJuego() {
    contenedorTablero = document.getElementById("tablero-juego");
    modalTorre = document.getElementById("modal-torre");
    modalGameOver = document.getElementById("modal-game-over");
    modalVictoria = document.getElementById("modal-victoria");
    
    btnComprar = document.getElementById("btn-comprar");
    btnCancelar = document.getElementById("btn-cancelar");
    btnReiniciar = document.getElementById("btn-reiniciar");
    btnReiniciarVictoria = document.getElementById("btn-reiniciar-victoria");
    
    hudOro = document.getElementById("hud-oro");
    hudVidas = document.getElementById("hud-vidas");
    hudPuntos = document.getElementById("hud-puntos");
    spanPuntajeFinal = document.getElementById("puntaje-final");
    spanPuntajeVictoria = document.getElementById("puntaje-victoria");

    btnCancelar.addEventListener("click", cerrarModal);
    btnComprar.addEventListener("click", comprarTorre);
    btnReiniciar.addEventListener("click", reiniciarPartida);
    btnReiniciarVictoria.addEventListener("click", reiniciarPartida);

    dibujarMapa();
    spawnEnemigo();
    loopJuego = setInterval(actualizarJuego, 800);
}

/* --- DIBUJAR MAPA --- */
function dibujarMapa() {
    contenedorTablero.innerHTML = ""; 
    for (var i = 0; i < mapaNivel1.length; i++) {
        var fila = mapaNivel1[i];
        for (var j = 0; j < fila.length; j++) {
            var celdaValor = fila[j];
            var celdaDiv = document.createElement("div"); 
            celdaDiv.classList.add("celda");
            celdaDiv.setAttribute("id", "celda-" + i + "-" + j);

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

/* --- GAME LOOP Y LÓGICA --- */
function actualizarJuego() {
    // 1. Verificar derrota
    if (vidasJugador <= 0) {
        clearInterval(loopJuego); 
        spanPuntajeFinal.textContent = puntosJugador;
        modalGameOver.classList.remove("oculto"); 
        return; 
    }
    
    // 2. Verificar victoria (Llegar a 150 puntos)
    if (puntosJugador >= 150) {
        clearInterval(loopJuego);
        spanPuntajeVictoria.textContent = puntosJugador;
        modalVictoria.classList.remove("oculto");
        return;
    }
    
    dispararTorres(); 
    moverEnemigos();  
}

function spawnEnemigo() {
    enemigos.push({
        pasoActual: 0,
        vida: 50
    });
}

function dispararTorres() {
    for (var i = 0; i < torresActivas.length; i++) {
        var torre = torresActivas[i];
        var disparoRealizado = false;

        for (var j = 0; j < enemigos.length; j++) {
            if (disparoRealizado) break; 
            
            var enemigo = enemigos[j];
            if (enemigo.pasoActual < caminoCoordenadas.length) {
                var coordE = caminoCoordenadas[enemigo.pasoActual];
                
                var distancia = Math.abs(torre.fila - coordE[0]) + Math.abs(torre.columna - coordE[1]);

                if (distancia <= torre.rango) {
                    enemigo.vida = enemigo.vida - torre.danio;
                    disparoRealizado = true;

                    if (enemigo.vida <= 0) {
                        enemigos.splice(j, 1);
                        j = j - 1; 
                        
                        oroJugador = oroJugador + 15;
                        puntosJugador = puntosJugador + 10;
                        hudOro.textContent = oroJugador;
                        hudPuntos.textContent = puntosJugador;
                    }
                }
            }
        }
    }
}

function moverEnemigos() {
    var enemigosPrevios = document.querySelectorAll(".enemigo");
    for (var k = 0; k < enemigosPrevios.length; k++) {
        enemigosPrevios[k].parentNode.removeChild(enemigosPrevios[k]);
    }

    for (var i = 0; i < enemigos.length; i++) {
        var enemigo = enemigos[i];
        if (enemigo.pasoActual < caminoCoordenadas.length) {
            var coord = caminoCoordenadas[enemigo.pasoActual];
            var celdaActual = document.getElementById("celda-" + coord[0] + "-" + coord[1]);

            if (celdaActual !== null) {
                var divEnemigo = document.createElement("div");
                divEnemigo.classList.add("enemigo");
                divEnemigo.style.opacity = Math.max(0.3, enemigo.vida / 50); 
                celdaActual.appendChild(divEnemigo);
            }
            enemigo.pasoActual = enemigo.pasoActual + 1;
        } else {
            vidasJugador = vidasJugador - 1;
            hudVidas.textContent = vidasJugador;
            enemigos.splice(i, 1);
            i = i - 1;
        }
    }

    if (Math.random() < 0.35 && vidasJugador > 0 && puntosJugador < 150) {
        spawnEnemigo();
    }
}

/* --- GESTIÓN DE TORRES Y REINICIO --- */
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
        
        var partesId = celdaSeleccionada.id.split("-");
        torresActivas.push({
            fila: parseInt(partesId[1], 10),
            columna: parseInt(partesId[2], 10),
            danio: 25,
            rango: 2
        });

        cerrarModal();
    } else {
        cerrarModal();
    }
}

function reiniciarPartida() {
    oroJugador = 100;
    vidasJugador = 10;
    puntosJugador = 0;
    enemigos = [];
    torresActivas = [];
    celdaSeleccionada = null;

    hudOro.textContent = oroJugador;
    hudVidas.textContent = vidasJugador;
    hudPuntos.textContent = puntosJugador;

    // Ocultar ambos modales
    modalGameOver.classList.add("oculto");
    modalVictoria.classList.add("oculto");
    
    clearInterval(loopJuego);
    
    dibujarMapa();
    spawnEnemigo();
    loopJuego = setInterval(actualizarJuego, 800);
}