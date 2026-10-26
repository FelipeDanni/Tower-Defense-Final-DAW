"use strict";

var contenedorTablero;
var modalTorre;
var modalGameOver;
var modalVictoria;
var modalHistorial;
var btnComprarBasica;
var btnComprarPesada;
var btnCancelar;
var btnReiniciar;
var btnReiniciarVictoria;
var btnSiguienteNivel;
var btnVolverMenuDerrota;
var btnVolverMenuVictoria;
var btnHistorial;
var btnCerrarHistorial;
var listaHistorial;
var pantallaMenu;
var pantallaPartida;
var hudOro;
var hudVidas;
var hudPuntos;
var spanPuntajeFinal;
var spanPuntajeVictoria;
var tituloVictoria;
var audioFondo;

var oroJugador = 100;
var vidasJugador = 10;
var puntosJugador = 0;
var celdaSeleccionada = null;
var loopJuego = null;
var enemigos = [];
var torresActivas = [];
var eventosInicializados = false;

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

var mapaNivel2 = [
    [0, 2, 0, 0, 0, 0, 0, 2, 0, 0],
    [1, 1, 1, 2, 0, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 2, 1, 0, 2, 1, 0, 2, 1, 0],
    [0, 0, 1, 1, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1]
];

var caminoCoordenadasNivel2 = [
    [1, 0], [1, 1], [1, 2],
    [2, 2], [3, 2], [4, 2],
    [4, 3], [4, 4], [4, 5],
    [3, 5], [2, 5], [1, 5],
    [1, 6], [1, 7], [1, 8],
    [2, 8], [3, 8], [4, 8], [5, 8], [5, 9]
];

var nivelActual = 1;
var mapaActivo;
var caminoActivo;

function cargarNivel(numero) {
    nivelActual = numero;
    if (nivelActual === 1) {
        mapaActivo = mapaNivel1;
        caminoActivo = caminoCoordenadas;
    } else if (nivelActual === 2) {
        mapaActivo = mapaNivel2;
        caminoActivo = caminoCoordenadasNivel2;
    }
}

function inicializarJuego() {
    contenedorTablero = document.getElementById("tablero-juego");
    modalTorre = document.getElementById("modal-torre");
    modalGameOver = document.getElementById("modal-game-over");
    modalVictoria = document.getElementById("modal-victoria");
    pantallaMenu = document.getElementById("pantalla-menu");
    pantallaPartida = document.getElementById("pantalla-partida");

    btnComprarBasica = document.getElementById("btn-comprar-basica");
    btnComprarPesada = document.getElementById("btn-comprar-pesada");
    btnCancelar = document.getElementById("btn-cancelar");
    btnReiniciar = document.getElementById("btn-reiniciar");
    btnReiniciarVictoria = document.getElementById("btn-reiniciar-victoria");
    btnSiguienteNivel = document.getElementById("btn-siguiente-nivel");
    btnVolverMenuDerrota = document.getElementById("btn-volver-menu-derrota");
    btnVolverMenuVictoria = document.getElementById("btn-volver-menu-victoria");
    tituloVictoria = document.getElementById("titulo-victoria");

    hudOro = document.getElementById("hud-oro");
    hudVidas = document.getElementById("hud-vidas");
    hudPuntos = document.getElementById("hud-puntos");
    spanPuntajeFinal = document.getElementById("puntaje-final");
    spanPuntajeVictoria = document.getElementById("puntaje-victoria");

    if (modalHistorial) {
        modalHistorial.classList.add("oculto");
    }
    modalTorre.classList.add("oculto");
    modalGameOver.classList.add("oculto");
    modalVictoria.classList.add("oculto");

    oroJugador = 100;
    vidasJugador = 10;
    puntosJugador = 0;
    enemigos = [];
    torresActivas = [];
    celdaSeleccionada = null;
    nivelActual = 1;

    hudOro.textContent = oroJugador;
    hudVidas.textContent = vidasJugador;
    hudPuntos.textContent = puntosJugador;

    audioFondo = document.getElementById("audio-fondo");
    if (audioFondo) {
        audioFondo.volume = 0.2;
        audioFondo.play();
    }

    if (!eventosInicializados) {
        btnComprarBasica.addEventListener("click", function () { comprarTorre("basica"); });
        btnComprarPesada.addEventListener("click", function () { comprarTorre("pesada"); });
        btnCancelar.addEventListener("click", cerrarModal);
        btnReiniciar.addEventListener("click", reiniciarPartida);
        btnReiniciarVictoria.addEventListener("click", reiniciarPartida);
        btnSiguienteNivel.addEventListener("click", avanzarNivel);
        btnVolverMenuDerrota.addEventListener("click", volverAlMenu);
        btnVolverMenuVictoria.addEventListener("click", volverAlMenu);
        eventosInicializados = true;
    }

    clearInterval(loopJuego);
    cargarNivel(nivelActual);
    dibujarMapa();
    spawnEnemigo();
    loopJuego = setInterval(actualizarJuego, 800);
}

modalHistorial = document.getElementById("modal-historial");
btnHistorial = document.getElementById("btn-historial");
btnCerrarHistorial = document.getElementById("btn-cerrar-historial");
listaHistorial = document.getElementById("lista-historial");

if (btnHistorial) {
    btnHistorial.addEventListener("click", function () {
        listaHistorial.innerHTML = "";
        var historialGuardado = JSON.parse(localStorage.getItem("historialPartidas")) || [];

        if (historialGuardado.length === 0) {
            var liVacio = document.createElement("li");
            liVacio.classList.add("item-historial");
            liVacio.textContent = "No hay partidas registradas todavía.";
            listaHistorial.appendChild(liVacio);
        } else {
            for (var i = 0; i < historialGuardado.length; i++) {
                var partida = historialGuardado[i];
                var li = document.createElement("li");
                li.classList.add("item-historial");
                li.textContent = partida.nombre + " - " + partida.puntos + " pts (" + partida.resultado + ")";
                listaHistorial.appendChild(li);
            }
        }
        modalHistorial.classList.remove("oculto");
    });
}

if (btnCerrarHistorial) {
    btnCerrarHistorial.addEventListener("click", function () {
        modalHistorial.classList.add("oculto");
    });
}

function guardarEnHistorial(resultado) {
    var elementoNombre = document.getElementById("hud-nombre");
    var nombreJugador = (elementoNombre && elementoNombre.textContent) ? elementoNombre.textContent : "Anónimo";
    var historialGuardado = JSON.parse(localStorage.getItem("historialPartidas")) || [];

    historialGuardado.unshift({
        nombre: nombreJugador,
        puntos: puntosJugador,
        resultado: resultado
    });

    if (historialGuardado.length > 5) {
        historialGuardado.pop();
    }

    localStorage.setItem("historialPartidas", JSON.stringify(historialGuardado));
}

function dibujarMapa() {
    contenedorTablero.innerHTML = "";
    for (var i = 0; i < mapaActivo.length; i++) {
        var fila = mapaActivo[i];
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

function actualizarJuego() {
    if (vidasJugador <= 0) {
        clearInterval(loopJuego);
        spanPuntajeFinal.textContent = puntosJugador;

        var recordDerrota = parseInt(localStorage.getItem("recordPuntos"), 10) || 0;
        if (puntosJugador > recordDerrota) {
            localStorage.setItem("recordPuntos", puntosJugador);
            localStorage.setItem("recordNombre", document.getElementById("hud-nombre").textContent);
        }

        guardarEnHistorial("Derrota");
        modalGameOver.classList.remove("oculto");
        return;
    }

    var puntosMeta = (nivelActual === 1) ? 150 : 300;

    if (puntosJugador >= puntosMeta) {
        clearInterval(loopJuego);
        spanPuntajeVictoria.textContent = puntosJugador;

        var recordVictoria = parseInt(localStorage.getItem("recordPuntos"), 10) || 0;
        if (puntosJugador > recordVictoria) {
            localStorage.setItem("recordPuntos", puntosJugador);
            localStorage.setItem("recordNombre", document.getElementById("hud-nombre").textContent);
        }

        if (nivelActual === 1) {
            tituloVictoria.textContent = "¡Nivel 1 Completado!";
            btnSiguienteNivel.classList.remove("oculto");
            btnReiniciarVictoria.classList.add("oculto");
        } else {
            tituloVictoria.textContent = "¡Victoria Definitiva!";
            btnSiguienteNivel.classList.add("oculto");
            btnReiniciarVictoria.classList.remove("oculto");
            guardarEnHistorial("Victoria");
        }

        modalVictoria.classList.remove("oculto");
        return;
    }

    dispararTorres();
    moverEnemigos();
}

function spawnEnemigo() {
    var esTanque = (nivelActual === 2 && Math.random() < 0.3);
    var vidaInicial = esTanque ? 150 : ((nivelActual === 1) ? 50 : 80);

    enemigos.push({
        pasoActual: 0,
        vida: vidaInicial,
        vidaMax: vidaInicial,
        tipo: esTanque ? "tanque" : "comun"
    });
}

function dispararTorres() {
    for (var i = 0; i < torresActivas.length; i++) {
        var torre = torresActivas[i];
        var disparoRealizado = false;

        for (var j = 0; j < enemigos.length; j++) {
            if (disparoRealizado) {
                break;
            }

            var enemigo = enemigos[j];
            if (enemigo.pasoActual > 0 && enemigo.pasoActual < caminoActivo.length) {
                var coordE = caminoActivo[enemigo.pasoActual];
                var distancia = Math.abs(torre.fila - coordE[0]) + Math.abs(torre.columna - coordE[1]);

                if (distancia <= torre.rango) {
                    enemigo.vida = enemigo.vida - torre.danio;
                    disparoRealizado = true;

                    if (enemigo.vida <= 0) {
                        var recompensaOro = (enemigo.tipo === "tanque") ? 30 : 15;
                        var recompensaPuntos = (enemigo.tipo === "tanque") ? 20 : 10;

                        enemigos.splice(j, 1);
                        j = j - 1;

                        oroJugador = oroJugador + recompensaOro;
                        puntosJugador = puntosJugador + recompensaPuntos;
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
        if (enemigo.pasoActual < caminoActivo.length) {
            var coord = caminoActivo[enemigo.pasoActual];
            var celdaActual = document.getElementById("celda-" + coord[0] + "-" + coord[1]);

            if (celdaActual !== null) {
                var divEnemigo = document.createElement("div");
                divEnemigo.classList.add("enemigo");

                if (enemigo.tipo === "tanque") {
                    divEnemigo.classList.add("enemigo-tanque");
                }

                divEnemigo.style.opacity = Math.max(0.3, enemigo.vida / enemigo.vidaMax);
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

    if (Math.random() < 0.35 && vidasJugador > 0 && puntosJugador < ((nivelActual === 1) ? 150 : 300)) {
        spawnEnemigo();
    }
}

function clickSlotTorre(evento) {
    celdaSeleccionada = evento.target;
    modalTorre.classList.remove("oculto");

    if (nivelActual >= 2) {
        btnComprarPesada.classList.remove("oculto");
    } else {
        btnComprarPesada.classList.add("oculto");
    }
}

function cerrarModal() {
    modalTorre.classList.add("oculto");
    celdaSeleccionada = null;
}

function comprarTorre(tipo) {
    var costo = (tipo === "basica") ? 50 : 100;
    var danio = (tipo === "basica") ? 25 : 60;
    var rango = (tipo === "basica") ? 2 : 3;
    var claseCSS = (tipo === "basica") ? "torre-construida" : "torre-pesada";

    if (oroJugador >= costo && celdaSeleccionada !== null) {
        oroJugador = oroJugador - costo;
        hudOro.textContent = oroJugador;

        celdaSeleccionada.classList.remove("slot-torre");
        celdaSeleccionada.classList.add(claseCSS);
        celdaSeleccionada.removeEventListener("click", clickSlotTorre);

        var partesId = celdaSeleccionada.id.split("-");
        torresActivas.push({
            fila: parseInt(partesId[1], 10),
            columna: parseInt(partesId[2], 10),
            danio: danio,
            rango: rango
        });

        cerrarModal();
    } else {
        cerrarModal();
    }
}

function avanzarNivel() {
    modalVictoria.classList.add("oculto");

    enemigos = [];
    torresActivas = [];
    celdaSeleccionada = null;

    clearInterval(loopJuego);
    cargarNivel(2);
    dibujarMapa();
    spawnEnemigo();
    loopJuego = setInterval(actualizarJuego, 800);
}

function reiniciarPartida() {
    oroJugador = 100;
    vidasJugador = 10;
    puntosJugador = 0;
    enemigos = [];
    torresActivas = [];
    celdaSeleccionada = null;
    nivelActual = 1;

    hudOro.textContent = oroJugador;
    hudVidas.textContent = vidasJugador;
    hudPuntos.textContent = puntosJugador;

    modalGameOver.classList.add("oculto");
    modalVictoria.classList.add("oculto");

    clearInterval(loopJuego);
    cargarNivel(nivelActual);
    dibujarMapa();
    spawnEnemigo();
    loopJuego = setInterval(actualizarJuego, 800);
}

function volverAlMenu() {
    clearInterval(loopJuego);
    modalGameOver.classList.add("oculto");
    modalVictoria.classList.add("oculto");
    modalTorre.classList.add("oculto");

    pantallaPartida.classList.add("oculto");
    pantallaMenu.classList.remove("oculto");

    contenedorTablero.innerHTML = "";

    oroJugador = 100;
    vidasJugador = 10;
    puntosJugador = 0;
    enemigos = [];
    torresActivas = [];
    celdaSeleccionada = null;
    nivelActual = 1;

    if (audioFondo) {
        audioFondo.pause();
        audioFondo.currentTime = 0;
    }

    mostrarRecord();
}

function mostrarRecord() {
    var elementoRecord = document.getElementById("texto-record");
    if (elementoRecord) {
        var recordGuardado = parseInt(localStorage.getItem("recordPuntos"), 10) || 0;
        var nombreGuardado = localStorage.getItem("recordNombre") || "Nadie";
        if (recordGuardado > 0) {
            elementoRecord.textContent = "Récord: " + recordGuardado + " pts (" + nombreGuardado + ")";
        } else {
            elementoRecord.textContent = "Récord Histórico: 0";
        }
    }
}

mostrarRecord();