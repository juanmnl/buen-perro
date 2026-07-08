# 🐾 Buen Perro

Sitio web estático en español con una guía de adiestramiento canino basada en evidencia
(refuerzo positivo, ciencia del comportamiento).

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Portada: los 4 pilares, mitos desacreditados, FAQ |
| `metodo.html` | La ciencia: condicionamiento, cuadrantes, clicker, luring/shaping/capturing/targeting, las 3 D, Premack |
| `cachorros.html` | Línea de tiempo 3 semanas–18 meses, socialización, esfínteres, inhibición de mordida, transportín, primeras noches |
| `obediencia.html` | Las 7 órdenes paso a paso: nombre, sienta, échate, quieto, ven, junto, suelta, déjalo + plan de 8 semanas |
| `conducta.html` | Problemas comunes, ansiedad por separación, lenguaje corporal, cuándo buscar profesional |
| `juegos.html` | Juegos de olfato, alimentación enriquecida, tug con reglas, masticación, menú diario de necesidades |
| `checklist.html` | Checklist interactiva de socialización (57 ítems, 6 categorías); progreso guardado en `localStorage` (`checklist.js`) |

## Cómo verlo

```sh
python3 -m http.server 1424
# → http://localhost:1424
```

Sin build ni dependencias: HTML + CSS + JS puro. Las fuentes se cargan de Google Fonts.

El clicker interactivo (portada y método) usa Web Audio para reproducir el sonido del marcador.
