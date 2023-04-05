// draw function from warmup mp
function draw2(milliseconds) {
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