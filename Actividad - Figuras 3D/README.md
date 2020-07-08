# Actividad - Figuras 3D 🔶
Brandon Reyes Minero
A01335537

## Descripción
En esta actviidad se realizó la creación de 4 figuras utilizando WebGL y las librerías de GL-Matrix y JQuery. Cada figura cuenta con su propio método de creación ya que cuetan con diferentes vértices. 
Para la figura del rombo lo que se hizo fue rotar un cuadrado 45 grados y para el pacman se hizo un ciclo para que fuera creando los vértices empezando del ángulo 20 y terminando en el ángulo 340. 

```javascript
    for(var i = 20 ;i<=340;i++){
        vertices.push(r * Math.cos(i*Math.PI/180));
        vertices.push(r * Math.sin(i*Math.PI/180));
        vertices.push(0);
    }
```

## Demo

![Paint demo](https://media.giphy.com/media/TKACO3sqU3oW3jhSHe/giphy.gif)