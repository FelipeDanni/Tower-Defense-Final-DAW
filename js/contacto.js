"use strict";

var formulario;
var inputNombre;
var inputEmail;
var inputMensaje;
var mensajeErrorContacto;

window.addEventListener("DOMContentLoaded", function() {
    formulario = document.getElementById("formulario-contacto");
    inputNombre = document.getElementById("contacto-nombre");
    inputEmail = document.getElementById("contacto-email");
    inputMensaje = document.getElementById("contacto-mensaje");
    mensajeErrorContacto = document.getElementById("mensaje-error-contacto");

    // Interceptamos el evento de envío
    formulario.addEventListener("submit", validarFormulario);
});

function validarFormulario(evento) {
    // Evitamos que la página se recargue por defecto
    evento.preventDefault(); 

    var nombre = inputNombre.value.trim();
    var email = inputEmail.value.trim();
    var mensaje = inputMensaje.value.trim();
    var errores = [];

    // 1. Validar nombre alfanumérico
    var regexAlfanumerico = /^[a-zA-Z0-9]+$/;
    if (nombre === "" || regexAlfanumerico.test(nombre) === false) {
        errores.push("El nombre debe ser alfanumérico (sin espacios ni símbolos).");
    }

    // 2. Validar email estricto (exige formato nombre@dominio.com)
    // Esta regex obliga a que termine con 3 o 4 letras, atrapando el error de ".co"
    var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,4}$/;
    if (email === "" || regexEmail.test(email) === false) {
        errores.push("Debe ingresar un correo electrónico válido (ej: usuario@mail.com).");
    }

    // 3. Validar mensaje
    if (mensaje.length <= 5) {
        errores.push("El mensaje debe tener estrictamente más de 5 caracteres.");
    }

    // 4. Mostrar errores o procesar el envío
    if (errores.length > 0) {
        mensajeErrorContacto.innerHTML = errores.join("<br>");
        mensajeErrorContacto.classList.remove("oculto");
    } else {
        mensajeErrorContacto.classList.add("oculto");
        
        var destinatario = "profesor@uai.edu.ar";
        var asunto = "Reporte de Torre de Defensa - " + nombre;
        var cuerpo = mensaje;
        
        window.location.href = "mailto:" + destinatario + "?subject=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(cuerpo);
        
        formulario.reset();
    }
}