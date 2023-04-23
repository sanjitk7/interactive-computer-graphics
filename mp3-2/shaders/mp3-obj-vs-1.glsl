#version 300 es
in vec4 position;
in vec3 normal;

out vec3 fnormal;
out vec4 tempcolor;
out vec4 vPosition;

uniform mat4 p;
uniform mat4 mv;
uniform bool useSpecular;
void main() {
    gl_Position = p * mv * position;
    fnormal = mat3(mv) * normal;
    vPosition = position;
    tempcolor = vec4(1, 1, 1, 1);
}