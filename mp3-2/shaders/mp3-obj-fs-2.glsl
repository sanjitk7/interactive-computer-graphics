#version 300 es
precision highp float;

uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;

in vec3 fnormal;
in vec4 tempcolor;
in vec4 objFragColor;

out vec4 fragColor;

uniform sampler2D image;

void main() {

    vec3 n = normalize(fnormal);
    float lambert = max(dot(lightdir, n),0.0);
    float blinn = pow(max(dot(-halfway, n), 0.0), 150.0);
    vec4 currentColor = tempcolor;

    vec3 col = objFragColor.rgb;

    // fragColor = vec4((lightcolor * lambert * col), float(objFragColor.a));
    // fragColor = vec4(currentColor.rgb * (lightcolor * lambert), float(currentColor.a));
    fragColor = vec4(objFragColor);

}