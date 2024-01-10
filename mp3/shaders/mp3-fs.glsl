#version 300 es
precision highp float;
uniform vec4 color;
uniform vec3 lightdir;
uniform vec3 lightcolor;
uniform vec3 halfway;
uniform bool useSpecular;
uniform bool useColorRamp;
in vec3 fnormal;
in vec4 tempcolor;
in vec4 vPosition;
out vec4 fragColor;
void main() {

    vec3 n = normalize(fnormal);
    float lambert = max(dot(lightdir, n),0.0);
    float blinn = pow(max(dot(-halfway, n), 0.5), 150.0);
    vec4 currentColor = tempcolor;


    // IF COLOR RAMP: set color of pre-lit fragments with more 3 colors
    vec4 nP = normalize(vPosition);
    vec4 color1 = vec4(0, 1, 0, 1);
    vec4 color2 = vec4(1, 0, 0, 1);
    vec4 color3 = vec4(0, 0, 1, 1);
    if (useColorRamp){
        if (nP.z < 0.5) {
            currentColor = (nP.z * 2.0 * color2) + (1.0 - (nP.z * 2.0))*color1;
        } else {
            currentColor = (((nP.z - 0.5) * 2.0) * color3) + ((1.0 - (nP.z - 0.5)*2.0)*color2);

        }
    }

    // IF SPECULAR: adding blinn component for specularity of light if option is selected, else only do diffuse lighting
    if (useSpecular){
        fragColor = vec4(currentColor.rgb * (lightcolor * lambert) + currentColor.rgb * (lightcolor*blinn)*100.5, float(currentColor.a));
    } else {
        fragColor = vec4(currentColor.rgb * (lightcolor * lambert), float(currentColor.a));
    }


    // fragColor = color;
    // fragColor = vec4(tempcolor.rgb * (lightcolor * lambert) + (lightcolor*blinn)*20.5, float(tempcolor.a));
    // fragColor = vec4((lightcolor*blinn)*20.5, float(tempcolor.a));
    // fragColor = vec4(tempcolor.rgb * (lightcolor * lambert), float(tempcolor.a));
    // fragColor = vec4(color.rgb * lambert, color.a);


    
}