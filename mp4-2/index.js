const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])
const FoggyBackground = new Float32Array([0.590088, 0.586554, 0.554753, 1])
window.once = false

window.particles = []
window.particleCount = 50

/** Draw one frame */
function draw(milliseconds) {
    gl.clearColor(...FoggyBackground) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    // set up stuff for particles
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)
    // do diffuse lighting by default and specular if chosen

    let lightdir =  normalize([1,1,2])
    let halfway = normalize(add(lightdir, [0,0,0]))

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), lightdir) // light dir
    gl.uniform3fv(gl.getUniformLocation(program, 'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(program, 'lightcolor'), [1,1,1]) // white light

    // console.log(window.count)
    for (let i=0; i<window.particleCount;i++){
        thisParticle = window.particles[i]
        // console.log("this particle", thisParticle)
        // console.log("this particle", thisParticle.radius)
        window.m1 = m4trans(thisParticle.position[0], thisParticle.position[1], thisParticle.position[2])
        // window.m2 = mul(thisParticle.position[0], thisParticle.position[1], thisParticle.position[2],
        //     // m4scale(thisParticle.radius)
        //     m4scale(1)
        //     )
        // if (!once){
        //     once = true
        //     console.log(m1, m2)
        // }

        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m1))
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
        gl.uniform4fv(gl.getUniformLocation(program, 'sphere_color'), thisParticle.color) // white light
        gl.drawElements(geom.mode, geom.count, geom.type, 0)
    }

    // gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m))
    // gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
    // gl.drawElements(geom.mode, geom.count, geom.type, 0)


}


/** Compute any time-varying or animated aspects of the scene */
function timeStep(milliseconds) {

    window.v = m4view([1,5,3], [0,0,0], [0,1,0])


    draw()
    requestAnimationFrame(timeStep)
}

/** Compile, link, set up geometry for Terrain only*/
async function setup(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )

    // shaders when texture does not exist
    let vs = await fetch('shaders/mp5-vs.glsl').then(res => res.text())
    let fs = await fetch('shaders/mp5-fs.glsl').then(res => res.text())

    window.program = compileAndLinkGLSL(gl, vs,fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    
    // initial model matrices on render
    window.m = m4mul(
        m4trans(0,0,2),
        m4rotY(0.4), 
        m4rotX(Math.PI)
        )
    
    window.initial_view = m4mul(
        m4rotX(-0.4),
        m4view([2,-5,5], [0,0,0], [0,1,0])
    )
    
    
    // initalize particles
    createInitialParticles(particleCount)
    console.log("window.particles:",window.particles)


    // do single sphere setup
    window.geom = setupGeomery(sphere_geom)

    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}



window.addEventListener('load',setup)