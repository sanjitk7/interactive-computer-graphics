#version 300 es
precision highp float;
uniform vec4 color;
uniform vec3 lightdir;
uniform vec3 lightcolor;
in vec3 fnormal;
in vec4 tempcolor;
out vec4 fragColor;
void main() {

    float lambert = max(dot(lightdir, normalize(fnormal)),0.0);

    // fragColor = color;
    fragColor = vec4(tempcolor.rgb * (lightcolor * lambert), float(tempcolor.a));
    // fragColor = vec4(color.rgb * lambert, color.a);
    
}