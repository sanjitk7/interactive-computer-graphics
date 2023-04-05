#version 300 es
precision highp float;

in vec4 vColor;

uniform float seconds;

out vec4 fragColor;

void main() {

    float temp = tan(seconds*0.77);
    // fragColor = vec4(
    //     (sin(temp*gl_FragCoord.x) + cos(temp*gl_FragCoord.y)*1.5),
    //     tanh(temp*(gl_FragCoord.x/gl_FragCoord.y)*3.0),
    //     cos(temp*sin(gl_FragCoord.x + gl_FragCoord.y))/2.0,
    //     vColor.a
    // );

    fragColor = vec4(
        (sin(temp*gl_FragCoord.x) + tan(temp*gl_FragCoord.y)*1.5),
        (sin(temp*gl_FragCoord.x) + cos(temp*gl_FragCoord.y)),
        cos(temp*sin(gl_FragCoord.x * gl_FragCoord.y))/2.0,
        vColor.a
    );
}

