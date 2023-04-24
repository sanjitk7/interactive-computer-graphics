#version 300 es
precision highp float;

uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;
uniform bool fog;

in vec3 fnormal;
in vec4 tempcolor;
in vec2 texCoord;

out vec4 fragColor;

uniform sampler2D image;

void main() {

    // lighting
    vec3 n = normalize(fnormal);
    float lambert = max(dot(lightdir, n),0.0);
    float blinn = pow(max(dot(-halfway, n), 0.0), 150.0);
    
    // color
    vec4 currentColor = tempcolor;
    vec4 background_fog_color = vec4(normalize(vec3(167,166,157)), 1);

    vec3 col = vec3(texture(image, texCoord)[0], texture(image, texCoord)[1], texture(image, texCoord)[2]);

    vec4 final_color_before_fog = vec4(currentColor.rgb * (lightcolor * lambert * col), float(currentColor.a));

    float fog_density = 15.0;

    if (fog) {
        fragColor =  (1.0 - pow(gl_FragCoord.z, fog_density)) * final_color_before_fog + pow(gl_FragCoord.z, fog_density) * background_fog_color;
    } else {
        fragColor = final_color_before_fog;
    }


    // fragColor = final_color_before_fog;


    
}