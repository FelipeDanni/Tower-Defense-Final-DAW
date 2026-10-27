# Documentación: Prompts IA - Examen Final DAW

## 1. Herramienta y Modelo Utilizados
* **Herramienta:** Gemini (Google).
* **Modelo:** Gemini Flash.

---

## 2. Prompts Relevantes, Respuestas y Explicación del Uso

### Prompt 1: Arquitectura y Maquetación Flexbox
* **Instrucción dada a la IA:**  
  *"Generá la estructura inicial en HTML5 y una hoja de estilos `game.css` utilizando exclusivamente Flexbox (sin usar Grid ni Float) para renderizar un tablero interactivo de celdas bidimensionales en un juego de defensa de torres, separando terrenos, caminos y slots de construcción."*
* **Respuesta / Fragmento generado:**  
  Estructura de contenedores flexibles (`display: flex`, `flex-wrap: wrap`), distribución de carriles para enemigos y celdas del mapa sin romper el diseño responsive.
* **Explicación del uso:**  
  Se utilizó para garantizar el cumplimiento estricto de las pautas de CSS de la cátedra (maquetación responsive únicamente mediante Flexbox, prohibiendo Grid y Float).

---

### Prompt 2: Motor del Juego y Lógica de Colisiones (ES5)
* **Instrucción dada a la IA:**  
  *"Diseñá la función principal de actualización (`actualizarJuego`) en JavaScript puro (ES5) con `use strict` mediante un `setInterval` que controle el avance de enemigos por coordenadas de matriz, el cálculo de rango de disparo de torres y la actualización dinámica del DOM (vidas, oro y puntos)."*
* **Respuesta / Fragmento generado:**  
  Bucle del juego (`game loop`), iteración de arrays de enemigos y proyectiles, cálculo de distancias euclidianas para el rango de ataque y detección de condiciones de victoria y derrota.
* **Explicación del uso:**  
  Asistencia en la lógica matemática de disparo y colisión respetando la restricción de sintaxis ES5 (declaración con `var`, sin funciones flecha ni `let`/`const`).

---

### Prompt 3: Persistencia de Datos y Validación de Formulario
* **Instrucción dada a la IA:**  
  *"Implementá funciones en JavaScript para guardar el récord y el historial de las últimas 5 partidas en `localStorage`, además de validar un formulario de contacto con expresiones regulares (Regex) para nombre alfanumérico y correo válido sin usar alertas bloqueantes."*
* **Respuesta / Fragmento generado:**  
  Serialización y parseo de arreglos con `JSON.stringify` y `JSON.parse` para `localStorage`, expresiones regulares `/^[a-zA-Z0-9]+$/` y validación de correo vinculada a la apertura del cliente de email.
* **Explicación del uso:**  
  Cumplir con el requisito de persistencia mínima en el almacenamiento local y la validación obligatoria del formulario de contacto mediante Regex.