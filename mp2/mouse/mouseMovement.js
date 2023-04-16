
// here we use the current mouse position data taken from a js event handler to apply translation to wards that direction - logo moves in same direction at same speed (for 10 points)
function draw6(milliseconds) {

    // console.log("mousePosition:",mousePosition)

    // using the translation and rotation matrix creating functions provided in the examples of readings
    window.translation = m4trans(mousePosition.x/500, -(mousePosition.y/500),0)
    window.scale = m4scale(0.5,0.5,0)

    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program) 

    // uniforms
    let secondsBindPoint = gl.getUniformLocation(program, 'seconds')
    let translationMatrixBindingPoint = gl.getUniformLocation(program, 'translationMatrix')
    let scaleMatrixBindingPoint = gl.getUniformLocation(program, "scaleMatrix" )
    let initMatrixBindingPoint = gl.getUniformLocation(program, 'initMatrix')

    gl.uniform1f(secondsBindPoint, milliseconds/1000)

    gl.uniformMatrix4fv(translationMatrixBindingPoint, false, translation)
    gl.uniformMatrix4fv(scaleMatrixBindingPoint, false, scale)
    gl.uniformMatrix4fv(initMatrixBindingPoint, false, initMatrix)


    gl.bindVertexArray(geom.vao) 


    gl.drawElements(geom.mode, geom.count, geom.type, 0) 

    requestAnimationFrame(draw6)
}




// initialize and setup mouse draw
async function setup_mouse(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = await fetch('mouse/mp2-mouse-opt-vs.glsl').then(res => res.text())
    let fs = await fetch('mouse/mp2-mouse-opt-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    let data = await fetch('required/logo.json').then(r=>r.json())
    
    window.geom = setupGeomery(data)
    
    window.mousePosition = {x: undefined, y: undefined}
    window.addEventListener('mousemove', (event) => {
        mousePosition = { x: event.clientX, y: event.clientY };
    });


    console.log("mouse setup data is : ",data)
    draw6()

}

// window.addEventListener('load',setup)
