#version 300 es
in vec4 position;
in vec3 normal;
out vec3 fnormal;
out vec4 tempcolor;
uniform mat4 p;
uniform mat4 mv;
void main() {
    gl_Position = p * mv * position;
    fnormal = mat3(mv) * normal;;
    tempcolor = vec4(0, 0, 0.7, 1);
    // gl_Position = position;
}