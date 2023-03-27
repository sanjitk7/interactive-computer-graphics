

function draw1() {
    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program)        // pick the shaders
    gl.bindVertexArray(geom.vao)  // and the buffers
    gl.drawElements(geom.mode, geom.count, geom.type, 0) // then draw things
}

function draw2() {
    console.log("draw2 was called")
    gl.clear(gl.COLOR_BUFFER_BIT) 
    gl.useProgram(program)        // pick the shaders
    gl.bindVertexArray(geom1.vao)  // and the buffers
    gl.drawElements(geom1.mode, geom1.count, geom1.type, 0) // then draw things
}

async function setup(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2')
    let vs = await fetch('mp2-logo-req-vs.glsl').then(res => res.text())
    let fs = await fetch('mp2-logo-req-fs.glsl').then(res => res.text())
    compileAndLinkGLSL(vs,fs)
    let data = await fetch('logo.json').then(r=>r.json())
    let data1 = await fetch('triangle.json').then(r=>r.json())
    window.geom = setupGeomery(data)
    window.geom1 = setupGeomery(data1)
    console.log("data is : ",data,data1)
}

// window.addEventListener('load',setup)

// trigger on radio button change
function radioChanged() {
    let chosen = document.querySelector('input[name="example"]:checked').value
    cancelAnimationFrame(window.pending)
    window.pending = requestAnimationFrame(window['draw'+chosen])
}

// wait for all parts of the webpage to load and trigger graphics creation on radio button selection
window.addEventListener('load',(event)=>{
    document.querySelectorAll('input[name="example"]').forEach(elem => {
        elem.addEventListener('change', radioChanged)
    })
    setup()
    radioChanged()
})