#version 300 es
precision highp float;
uniform vec4 color;
uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;
in vec3 fnormal;
in vec4 tempcolor;
out vec4 fragColor;
void main() {

    vec3 n = normalize(fnormal);
    float lambert = max(dot(lightdir, n),0.0);
    float blinn = pow(max(dot(-halfway, n), 0.0), 150.0);

    // fragColor = color;
    fragColor = vec4(tempcolor.rgb * (lightcolor * lambert) + (lightcolor*blinn)*20.5, float(tempcolor.a));
    // fragColor = vec4((lightcolor*blinn)*20.5, float(tempcolor.a));
    // fragColor = vec4(tempcolor.rgb * (lightcolor * lambert), float(tempcolor.a));
    // fragColor = vec4(color.rgb * lambert, color.a);
    
}