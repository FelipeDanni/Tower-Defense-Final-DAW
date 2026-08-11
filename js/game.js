"use strict";

// Variables globales del juego
var contenedorTablero;
var modalTorre;
var btnComprar;
var btnCancelar;
var hudOro;

// Estados del juego
var oroJugador = 100;
var celdaSeleccionada = null; // Guardamos en memoria qué cuadradito se tocó

// Estructura de datos: Matriz del mapa (0 = Terreno, 1 = Camino, 2 = Slot Torre)
var mapaNivel1 = [
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 2, 0, 0, 2, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 2, 0, 1, 2, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

function inicializarJuego() {
    contenedorTablero = document.getElementById("tablero-juego");
    modalTorre = document.getElementById("modal-torre");
    btnComprar = document.getElementById("btn-comprar");
    btnCancelar = document.getElementById("btn-cancelar");
    hudOro = document.getElementById("hud-oro");

    // Asignar eventos a los botones del modal
    btnCancelar.addEventListener("click", cerrarModal);
    btnComprar.addEventListener("click", comprarTorre);

    dibujarMapa();
}

function dibujarMapa() {
    // Limpiamos el contenedor antes de dibujar
    contenedorTablero.innerHTML = ""; 

    for (var i = 0; i < mapaNivel1.length; i++) {
        var fila = mapaNivel1[i];
        
        for (var j = 0; j < fila.length; j++) {
            var celdaValor = fila[j];
            var celdaDiv = document.createElement("div"); 
            
            celdaDiv.classList.add("celda");

            // Asignar clase según el número de la matriz
            if (celdaValor === 0) {
                celdaDiv.classList.add("terreno");
            } else if (celdaValor === 1) {
                celdaDiv.classList.add("camino");
            } else if (celdaValor === 2) {
                celdaDiv.classList.add("slot-torre");
                // Evento click solo a los lugares construibles
                celdaDiv.addEventListener("click", clickSlotTorre);
            }

            // Inyectamos la celda en el HTML
            contenedorTablero.appendChild(celdaDiv);
        }
    }
}

function clickSlotTorre(evento) {
    // evento.target nos dice exactamente a qué cuadrado le hicimos clic
    celdaSeleccionada = evento.target;
    modalTorre.classList.remove("oculto");
}

function cerrarModal() {
    modalTorre.classList.add("oculto");
    celdaSeleccionada = null; // Limpiamos la memoria
}

function comprarTorre() {
    if (oroJugador >= 50 && celdaSeleccionada !== null) {
        // Restar oro y actualizar el HUD en el DOM
        oroJugador = oroJugador - 50;
        hudOro.textContent = oroJugador;
        
        // Cambiar clases para que se vea como una torre construida
        celdaSeleccionada.classList.remove("slot-torre");
        celdaSeleccionada.classList.add("torre-construida");
        
        // Evitamos que se pueda construir otra torre encima
        celdaSeleccionada.removeEventListener("click", clickSlotTorre);
        
        cerrarModal();
    } else {
        // Si no tiene oro, por ahora cerramos el modal igual
        cerrarModal();
    }
}