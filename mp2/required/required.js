function draw1(milliseconds) {

    // using the translation and rotation matrix creating functions provided in the examples of readings
    window.translation = m4trans(Math.sin(milliseconds/1000), (Math.tanh(milliseconds/2000))-0.5, 0)
    window.rotation = m4rotZ(milliseconds/1000)
    window.scale = m4scale(Math.cos((milliseconds/1000)*0.75),Math.cos((milliseconds/1000)*0.75),0)


    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program)        // pick the shaders

    // values that do not vary between vertexes or fragments are called "uniforms"
    let secondsBindPoint = gl.getUniformLocation(program, 'seconds')
    let translationMatrixBindingPoint = gl.getUniformLocation(program, 'translationMatrix')
    let rotationMatrixBindingPoint = gl.getUniformLocation(program, 'rotationMatrix')
    let scaleMatrixBindingPoint = gl.getUniformLocation(program, "scaleMatrix" )
    let initMatrixBindingPoint = gl.getUniformLocation(program, 'initMatrix')

    gl.uniform1f(secondsBindPoint, milliseconds/1000)

    gl.uniformMatrix4fv(translationMatrixBindingPoint, false, translation)
    gl.uniformMatrix4fv(rotationMatrixBindingPoint, false, rotation)
    gl.uniformMatrix4fv(scaleMatrixBindingPoint, false, scale)
    gl.uniformMatrix4fv(initMatrixBindingPoint, false, initMatrix)


    gl.bindVertexArray(geom.vao)  // and the buffers


    gl.drawElements(geom.mode, geom.count, geom.type, 0) // then draw things

    // requestAnimationFrame calls its callback at as close to your screen's refresh rate as it can manage; its argument is a number of milliseconds that have elapsed since the page was first loaded.
    requestAnimationFrame(draw1)
}

// initialize and setup logo draw
async function setup_logo(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = await fetch('required/mp2-logo-req-vs.glsl').then(res => res.text())
    let fs = await fetch('required/mp2-logo-req-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    let data = await fetch('required/logo.json').then(r=>r.json())
    
    window.geom = setupGeomery(data)
    
    console.log("data is : ",data)
    draw1()
}

// window.addEventListener('load',setup)
