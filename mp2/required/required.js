

function draw1(milliseconds) {
    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program)        // pick the shaders

    // values that do not vary between vertexes or fragments are called "uniforms"
    let secondsBindPoint = gl.getUniformLocation(program, 'seconds')
    gl.uniform1f(secondsBindPoint, milliseconds/1000)

    gl.bindVertexArray(geom.vao)  // and the buffers
    gl.drawElements(geom.mode, geom.count, geom.type, 0) // then draw things

    // requestAnimationFrame calls its callback at as close to your screen's refresh rate as it can manage; its argument is a number of milliseconds that have elapsed since the page was first loaded.
    requestAnimationFrame(draw1)
}

// const uiuc_logo_blue = new Float32Array([0.075, 0.16, 0.292, 1])
// const uiuc_logo_orange = new Float32Array([1, 0.373, 0.02, 1])

// function draw2() {
//     console.log("draw2 was called")
//     gl.clear(gl.COLOR_BUFFER_BIT) 
//     gl.useProgram(program)        // pick the shaders
    
//     gl.bindVertexArray(geom.vao)  // and the buffers
//     gl.drawElements(geom1.mode, geom1.count, geom1.type, 0) // then draw things

//     gl.bindVertexArray(geom1.vao)  // and the buffers
//     gl.drawElements(geom1.mode, geom1.count, geom1.type, 0) // then draw things
//     requestAnimationFrame(draw2)
// }

async function setup_logo(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = await fetch('required/mp2-logo-req-vs.glsl').then(res => res.text())
    let fs = await fetch('required/mp2-logo-req-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    let data = await fetch('required/logo.json').then(r=>r.json())
    // let data1 = await fetch('triangle.json').then(r=>r.json())
    window.geom = setupGeomery(data)
    // window.geom1 = setupGeomery(data1)
    console.log("data is : ",data)
    draw1()
}

// window.addEventListener('load',setup)
