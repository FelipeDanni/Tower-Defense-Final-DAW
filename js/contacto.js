"use strict";

var formulario;
var inputContactoNombre;
var inputContactoEmail;
var inputContactoMensaje;
var mensajeErrorContacto;

window.addEventListener("DOMContentLoaded", function () {
    formulario = document.getElementById("formulario-contacto");
    inputContactoNombre = document.getElementById("contacto-nombre");
    inputContactoEmail = document.getElementById("contacto-email");
    inputContactoMensaje = document.getElementById("contacto-mensaje");
    mensajeErrorContacto = document.getElementById("mensaje-error-contacto");

    formulario.addEventListener("submit", validarFormulario);
});

function validarFormulario(evento) {
    evento.preventDefault();

    var nombre = inputContactoNombre.value.trim();
    var email = inputContactoEmail.value.trim();
    var mensaje = inputContactoMensaje.value.trim();
    var errores = [];

    var regexAlfanumerico = /^[a-zA-Z0-9]+$/;
    if (nombre === "" || regexAlfanumerico.test(nombre) === false) {
        errores.push("El nombre debe ser alfanumérico (sin espacios ni símbolos).");
    }

    var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (email === "" || regexEmail.test(email) === false) {
        errores.push("Debe ingresar un correo electrónico válido (ej: usuario@mail.com).");
    }

    if (mensaje.length <= 5) {
        errores.push("El mensaje debe tener estrictamente más de 5 caracteres.");
    }

    if (errores.length > 0) {
        mensajeErrorContacto.textContent = errores.join(" | ");
        mensajeErrorContacto.classList.remove("oculto");
    } else {
        mensajeErrorContacto.classList.add("oculto");

        var destinatario = "profesor@uai.edu.ar";
        var asunto = "Reporte de Torre de Defensa - " + nombre;
        var cuerpo = mensaje;

        // Abre directamente una pestaña de Gmail web con los datos cargados
        var urlGmail = "https://mail.google.com/mail/?view=cm&fs=1&to=" + destinatario + "&su=" + encodeURIComponent(asunto) + "&body=" + encodeURIComponent(cuerpo);
        window.open(urlGmail, "_blank");

        formulario.reset();
    }
}