#version 300 es

in vec4 position;
in vec4 color;

uniform float seconds;
uniform mat4 initMatrix;
uniform mat4 translationMatrix;
uniform mat4 rotationMatrix;
uniform mat4 scaleMatrix;

out vec4 vColor;

void main() {

    vColor = color;
    // gl_Position = position;

    // // offsetting the xy coordinates by some value for all vertices to create motion and 
    // gl_Position = vec4(
    //     position.xy*sin(seconds*0.75) + 0.5*cos(seconds),
    //     position.zw
    // );

    // // apply translation, rotation to position
    gl_Position = initMatrix * translationMatrix * rotationMatrix * scaleMatrix  * position;
}

