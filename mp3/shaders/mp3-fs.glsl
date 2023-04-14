#version 300 es
precision highp float;
uniform vec4 color;
uniform vec3 lightdir;
in vec3 fnormal;
in vec4 tempcolor;
out vec4 fragColor;
void main() {

    float lambert = dot(lightdir, fnormal);

    // fragColor = color;
    fragColor = vec4(tempcolor.rgb * lambert, float(tempcolor.a));
    // fragColor = vec4(color.rgb * lambert, color.a);
    
}