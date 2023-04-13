#version 300 es
precision highp float;
uniform vec4 color;
in vec3 fnormal;
out vec4 fragColor;
void main() {
    // fragColor = color;
    fragColor = vec4(fnormal, 1);
}