#version 300 es
in vec4 position;
in vec3 normal;
in vec2 texture;
in vec4 objcolor;

out vec3 fnormal;
out vec4 tempcolor;
out vec2 texCoord;

uniform mat4 p;
uniform mat4 mv;

void main() {
    gl_Position = p * mv * position;
    fnormal = mat3(mv) * normal;
    tempcolor = vec4(1, 1, 1, 1);
    texCoord = texture;
}