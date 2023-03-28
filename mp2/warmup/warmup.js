

// function draw2(milliseconds) {
//     gl.clear(gl.COLOR_BUFFER_BIT) 
//     gl.useProgram(program)        // pick the shaders

//     // values that do not vary between vertexes or fragments are called "uniforms"
//     let secondsBindPoint = gl.getUniformLocation(program, 'seconds')
//     gl.uniform1f(secondsBindPoint, milliseconds/1000)

//     gl.bindVertexArray(geom.vao)  // and the buffers
//     gl.drawElements(geom.mode, geom.count, geom.type, 0) // then draw things

//     // requestAnimationFrame calls its callback at as close to your screen's refresh rate as it can manage; its argument is a number of milliseconds that have elapsed since the page was first loaded.
//     requestAnimationFrame(draw2)
// }

// const uiuc_logo_blue = new Float32Array([0.075, 0.16, 0.292, 1])
// const uiuc_logo_orange = new Float32Array([1, 0.373, 0.02, 1])

function draw2(milliseconds) {
    console.log("draw 2 is called")
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    let secondsBindPoint = gl.getUniformLocation(program, 'seconds')
    gl.uniform1f(secondsBindPoint, milliseconds/1000)
    const connection = gl.POINTS
    const offset = 0                          // unused here, but required
    const count = 6+(0|milliseconds/100)%100  // number of vertices to draw
    let countBindPoint = gl.getUniformLocation(program, 'count')
    gl.uniform1i(countBindPoint, count)
    gl.drawArrays(connection, offset, count)
    window.animation = requestAnimationFrame(draw2)
}

async function setup_warmup(event) {
    console.log("setup_warmup!")
    window.gl = document.querySelector('canvas').getContext('webgl2')
    document.querySelector("canvas").style.backgroundColor = "yellow"
    let vs = await fetch('warmup/wmp2-vs.glsl').then(res => res.text())
    let fs = await fetch('warmup/wmp2-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
}