#version 300 es

in vec4 position;
in vec4 color;

uniform mat4 initMatrix;
uniform float seconds;

out vec4 vColor;

void main() {

    vColor = color;

    float ang = 2.399963229728653 * float(gl_VertexID) + 2.0*seconds;

    gl_Position = position + vec4(0.05*cos(ang), 0.05*sin(ang), 0, 2);
}

