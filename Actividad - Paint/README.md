# Actividad - Paint 🎨
Brandon Reyes Minero
A01335537

## Descripción
En esta actviidad se realizó un clon de un paint en el browser usando canvas, html, css y javascript. 
Se cuenta con un menú en el que el usuario puede seleccionar si desea dibujar o borrar, en caso de que quiera dibujar se desplegará un submenú con las opciones de dibujo como es el color, el grosor y la opción de borrar todo el canvas. Si seleccionó la opción de borrar se esconderá este menú y lo único que podrá hacer es borrar dentro del canvas.

## Funcionalidad

Se utilizó principalmente 3 eventos. En el evento mousedown se obtienen las coordenadas iniciales, en el mousemove se manda a llamar un metodo dibujar() que recibe las coordenadas iniciales y finales y en el mouseup se regresaban los variables a sus valores iniciales.

```javascript

    document.addEventListener('mousedown', (e) =>{
    })
    
    document.addEventListener('mousemove', (e)=>{
    })
    
    document.addEventListener('mouseup', (e)=>{
    })  
```

## Demo

![Paint demo](https://media.giphy.com/media/KGplrUqSUSNoJ26ZlB/giphy.gif)