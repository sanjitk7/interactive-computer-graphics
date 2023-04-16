// the fragment color is changed in the fragment shader by computing randomized values using non-linear functions of
// of the time varying "milliseconds value" -> seconds as GPU uniform
function draw5(milliseconds) {

    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program)
    
    let secondsBindPoint = gl.getUniformLocation(program, 'seconds')
    
    gl.uniform1f(secondsBindPoint, milliseconds/1000)

    gl.bindVertexArray(geom.vao)

    gl.drawElements(geom.mode, geom.count, geom.type, 0) 

    requestAnimationFrame(draw5)
}

// initialize and setup logo draw
async function setup_psych(event) {
    console.log("hi")
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = await fetch('psychedelic/mp2-psych-opt-vs.glsl').then(res => res.text())
    let fs = await fetch('psychedelic/mp2-psych-opt-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    let data = await fetch('psychedelic/fullCanvasQuad.json').then(r=>r.json())
    
    window.geom = setupGeomery(data)
    
    console.log("psych setup is called and data is : ",data)
    draw5()
}