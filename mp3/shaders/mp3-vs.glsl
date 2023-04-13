#version 300 es
in vec4 position;
in vec3 normal;
out vec3 fnormal;
uniform mat4 p;
uniform mat4 mv;
void main() {
    vec4 offset = vec4(position.xyz + normal.xyz*0.2, position.w);
    gl_Position = p * mv * offset;
    fnormal = normal;
    // gl_Position = position;
}