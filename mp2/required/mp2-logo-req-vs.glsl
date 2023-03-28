#version 300 es

in vec4 position;
in vec4 color;

uniform float seconds;
// uniform float angle;

out vec4 vColor;

void main() {

    vColor = color;
    gl_Position = position;

    // offsetting the xy coordinates by some value for all vertices to create motion
    gl_Position = vec4(
        position.xy*cos(seconds*0.6180339887498949) + 0.5*sin(seconds),
        position.zw
    );
}

