// the vertex position is changed in the gpu by computing an angle whose value depends on the gl_VertexID of each vertex
function draw4(milliseconds) {

    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program)

    let initMatrixBindingPoint = gl.getUniformLocation(program, 'initMatrix')
    let secondsBindPoint = gl.getUniformLocation(program, 'seconds')
    
    gl.uniformMatrix4fv(initMatrixBindingPoint, false, initMatrix)
    gl.uniform1f(secondsBindPoint, milliseconds/1000)

    gl.bindVertexArray(geom.vao)

    gl.drawElements(geom.mode, geom.count, geom.type, 0) // then draw things

    // requestAnimationFrame calls its callback at as close to your screen's refresh rate as it can manage; its argument is a number of milliseconds that have elapsed since the page was first loaded.
    requestAnimationFrame(draw4)
}

// initialize and setup logo draw
async function setup_gpu(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = await fetch('GPU/mp2-gpu-opt-vs.glsl').then(res => res.text())
    let fs = await fetch('GPU/mp2-gpu-opt-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    let data = await fetch('required/logo.json').then(r=>r.json())
    
    window.geom = setupGeomery(data)
    
    console.log("gpu setup is called and data is : ",data)
    draw4()
}

// window.addEventListener('load',setup)