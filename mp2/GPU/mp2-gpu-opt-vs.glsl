#version 300 es

in vec4 position;
in vec4 color;

uniform float seconds;

out vec4 vColor;

void main() {

    vColor = color;

    float ang =  float(gl_VertexID) + 6.0*seconds;

    gl_Position = position + vec4(0.07*cos(ang), 0.15*sin(ang), 1.5*sin(ang), 1);
}

