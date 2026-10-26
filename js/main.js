"use strict";

var inputNombre;
var btnIniciar;
var mensajeError;
var pantallaMenu;
var pantallaPartida;
var hudNombre;

window.addEventListener("DOMContentLoaded", function () {
    inputNombre = document.getElementById("input-nombre");
    btnIniciar = document.getElementById("btn-iniciar");
    mensajeError = document.getElementById("mensaje-error");
    pantallaMenu = document.getElementById("pantalla-menu");
    pantallaPartida = document.getElementById("pantalla-partida");
    hudNombre = document.getElementById("hud-nombre");

    btnIniciar.addEventListener("click", validarIngreso);
});

function validarIngreso() {
    var nombre = inputNombre.value.trim();

    if (nombre.length < 3) {
        mensajeError.textContent = "Error: El nombre debe tener al menos 3 letras.";
        mensajeError.classList.remove("oculto");
    } else {
        mensajeError.classList.add("oculto");
        iniciarJuego(nombre);
    }
}

function iniciarJuego(nombreJugador) {
    pantallaMenu.classList.add("oculto");
    pantallaPartida.classList.remove("oculto");
    hudNombre.textContent = nombreJugador;
    inicializarJuego();
}