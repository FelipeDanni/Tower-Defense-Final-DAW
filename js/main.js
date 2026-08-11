"use strict";

// Declaración de variables al inicio (Regla de la cátedra)
var btnIniciar;
var inputNombre;
var mensajeError;
var pantallaMenu;
var pantallaPartida;
var hudNombre;

// Esperamos a que cargue el DOM
window.addEventListener("DOMContentLoaded", function () {
    // Asignación de elementos del DOM
    btnIniciar = document.getElementById("btn-iniciar");
    inputNombre = document.getElementById("input-nombre");
    mensajeError = document.getElementById("mensaje-error");
    pantallaMenu = document.getElementById("pantalla-menu");
    pantallaPartida = document.getElementById("pantalla-partida");
    hudNombre = document.getElementById("hud-nombre");

    // Eventos
    btnIniciar.addEventListener("click", validarIngreso);
});

function validarIngreso() {
    var nombre = inputNombre.value.trim();

    // Validación obligatoria: mínimo 3 letras
    if (nombre.length < 3) {
        mensajeError.textContent = "Error: El nombre debe tener al menos 3 letras.";
        mensajeError.classList.remove("oculto");
    } else {
        mensajeError.classList.add("oculto");
        iniciarJuego(nombre);
    }
}

function iniciarJuego(nombreJugador) {
    // Cambiar de pantalla sin recargar (Regla obligatoria)
    pantallaMenu.classList.add("oculto");
    pantallaPartida.classList.remove("oculto");
    
    // Inyectar el nombre validado en el HUD
    hudNombre.textContent = nombreJugador;

    // Arrancamos la lógica del tablero ubicada en game.js
    inicializarJuego(); 
}