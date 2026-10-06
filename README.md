# Invitación · Fiesta Mexicana sorpresa de Margarita

Invitación digital animada para compartir por enlace. Es una sola página web, sin instalación ni dependencias.

- **Fecha:** sábado 24 de octubre de 2026, 7:00 PM
- **Lugar:** Terraza Los Abuelos, Beato

## Qué hace

- **Intro con piñata:** el invitado le da 3 toques para romperla y se abre el telón. Si nadie la toca en 20 segundos, se rompe sola. También hay un botón "Saltar intro".
- **Música:** suena en bucle desde el primer toque; el botón de arriba a la derecha la pausa o la reanuda.
- **Cuenta regresiva** hasta la hora de la fiesta.
- **Ubicación:** al tocar el lugar se abre un mapa con botones para Google Maps, Waze y copiar el enlace.
- **Confirmación:** al tocar "Favor confirmar asistencia" se elige "Sí podré ir" o "No podré ir" y se abre WhatsApp con el mensaje ya escrito.
- **Confeti** al tocar la invitación y al confirmar.

## Archivos

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Invitación normal: estructura y textos |
| `familia-41b62f76.html` | La misma invitación con el aviso "Válida para 4 personas" |
| `estilos.css` | Colores, tamaños y animaciones |
| `script.js` | Piñata, confeti, música, cuenta regresiva, mapa y WhatsApp |
| `fondo.jpg` | Imagen de fondo de la tarjeta |
| `favicon.png` | Icono de la pestaña del navegador (foto recortada a 192×192) |
| `musica-bucle.mp3` | Fragmento de unos 20 segundos que suena en bucle |

## Cómo verla

Abre `index.html` con doble clic en cualquier navegador.

## Cómo publicarla

Sube estos siete archivos juntos, en la misma carpeta, a cualquier servicio de páginas estáticas (por ejemplo Netlify, GitHub Pages o Vercel):

```
index.html
familia-41b62f76.html
estilos.css
script.js
fondo.jpg
favicon.png
musica-bucle.mp3
```

## Las dos invitaciones

Hay dos enlaces, y cada invitado recibe solo el suyo:

- **Normal:** el enlace principal del sitio (`index.html`).
- **Para 4 personas:** el mismo enlace terminado en `familia-41b62f76.html`. Muestra "Válida para 4 personas" y lo añade al mensaje de confirmación de WhatsApp.

El nombre del segundo archivo lleva un código al azar para que nadie lo adivine cambiando el enlace normal. Las dos páginas comparten `estilos.css` y `script.js`, pero los textos están repetidos: si cambias un texto en `index.html`, cámbialo también en `familia-41b62f76.html`.

## Cómo cambiar los datos

| Qué | Dónde |
| --- | --- |
| Nombre, fecha, hora y lugar que se ven | Textos en `index.html` |
| Fecha de la cuenta regresiva | `fiesta` en `script.js` |
| Teléfono de WhatsApp | `TEL` en `script.js`, y el texto y el enlace `wa.me` en `index.html` |
| Mensajes de WhatsApp | Los dos textos junto a `TEL` en `script.js` |
| Ubicación del mapa | Las coordenadas `19.218111,-70.523354`, que aparecen en `index.html` y en `script.js` |
| Música | Reemplaza `musica-bucle.mp3` por otro archivo con el mismo nombre |
| Colores | Variables al inicio de `estilos.css` |
| Imagen de fondo | Reemplaza `fondo.jpg` por otra imagen de proporción 3:4 |

Si cambias la fecha o el lugar, revisa también los mensajes de WhatsApp en `script.js`, porque los mencionan.

## Compatibilidad

- Se adapta a teléfonos, tabletas y computadoras, y mantiene la proporción 3:4 de la tarjeta.
- Necesita un navegador de 2022 en adelante (iOS 16 o superior, Chrome 105 o superior). En navegadores más viejos los textos se ven descuadrados.
- Los navegadores no dejan sonar música sin un toque, por eso arranca con el primer golpe a la piñata.
- Si el dispositivo tiene activada la opción de reducir movimiento, la invitación se muestra directamente, sin intro ni confeti.

## Al publicar cambios

Las dos páginas cargan `estilos.css?v=5` y `script.js?v=5`. Cada vez que cambies `estilos.css` o `script.js`, sube ese número (por ejemplo a `v=6`) en `index.html` y en `familia-41b62f76.html`. Así los teléfonos que ya abrieron la invitación descargan la versión nueva en lugar de usar la que tienen guardada.
