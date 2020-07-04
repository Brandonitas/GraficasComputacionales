# Actividad - Triangulo Sierpinski 📝
Brandon Reyes Minero
A01335537

## Descripción
En esta actviidad se realizó el fractal del triángulo de Sierpinski. Es importante mencionar que un fractal es una forma geométrica fragmentada que se repite a cualquier escala. 

En cada iteración se dibujan 3 tríangulos por cada tríangulo en el paso anterior mediante una función recursiva.

```javascript
drawTriangleOne(x, y, size/2, subdivision-1);
drawTriangleOne(x + (size/2), y, size/2, subdivision-1);
drawTriangleOne(x + (size/4), y + size/2, size/2, subdivision-1);
```

## Demo

![Trifuerza demo](https://media.giphy.com/media/TIXHNMdBMrIK27TGOf/giphy.gif)