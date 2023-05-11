const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])
const FoggyBackground = new Float32Array([0.15, 0.2, 0.18, 1])
window.once = false
window.twice = 0
window.temp1 = 0
window.temp2 = 0
window.temp3 = 0
window.temp4 = 0
window.reset = false
window.particles = []
window.particleCount = 50

// SINGLE GEOMETRY APPROACH - render spheres
function draw(milliseconds) {
    gl.clearColor(...FoggyBackground) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindVertexArray(geom.vao)

    // general diffuse lighting
    let lightdir =  normalize([1,1,2])
    let halfway = normalize(add(lightdir, [0,0,0]))

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), lightdir) // light dir
    gl.uniform3fv(gl.getUniformLocation(program, 'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(program, 'lightcolor'), [1,1,1]) // white light

    for (let i=0; i<window.particleCount;i++){
        thisParticle = window.particles[i]
        // console.log("this particle", thisParticle)
        // console.log("this particle", thisParticle.radius)
        window.m1 = m4trans(thisParticle.position[0], thisParticle.position[1], thisParticle.position[2])

        scaleFactorByRadius = 0.3*thisParticle.radius
        window.m2 = m4mul(m1,
            m4scale(scaleFactorByRadius,scaleFactorByRadius,scaleFactorByRadius)
            )

        // if (!once){
        //     once = true
        //     console.log("m1",m1)
        //     // console.log("m2",m2)
        // }

        
        gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m2))
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

    if ((milliseconds/1000)%7 > 0 && (milliseconds/1000)%7 < 0.1){
        console.log("reset!")
        window.reset = true
    }

    if (window.reset){
        console.log("reINIT!")
        window.particles = []
        createInitialParticles(particleCount)
        window.reset = false
    }

    // window.v = m4view([Math.sin(milliseconds/1000),5,0], [0,0,0], [0,1,0])
    // window.v = m4view([1,Math.sin(milliseconds/1000),0], [0,0,0], [0,1,0])
    window.v = m4mul(
        m4view([1,9,0], [0,0,0], [0,1,1]),
        m4rotX(Math.PI/2),
        m4trans(0,0,2)
        )
    window.m = m4mul(
        m4trans(0,0,0)
        )
    
    
        
    // initalize particles
    // createInitialParticles(particleCount)

    createInitialForces()
    // if (twice<2){
    //     ++twice
    //     console.log(twice, ": forces at time",window.particles[4].otherForces) 
    // }

    // if (temp1<1){
    //     for (let i=0;i<particleCount;i++){
    //         console.log("forcees",window.particles[i].otherForces[0])
    //     }
    //     temp1++
        
    // }
    
    eulersMethod()
    checkInvisibleBoxCollision()
    draw()
    // if (twice<2){
    //     ++twice
    //     console.log(twice, ": forces at time",window.particles[4].otherForces) 
    // }
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
    // window.m = m4mul(
    //     m4trans(0,0,2),
    //     m4rotY(0.4), 
    //     m4rotX(Math.PI)
    //     )
    
    // window.initial_view = m4mul(
    //     m4rotX(-0.4),
    //     m4view([2,-5,5], [0,0,0], [0,1,0])
    // )
    
    createInitialParticles(particleCount)
    for (let i=0; i<window.particleCount;i++){
        console.log("init setup: ",window.particles[i].velocity)  
    }
    // console.log("setup inital particle position and attributes: ",window.particles[4])


    // do single sphere setup
    window.geom = setupGeomery(sphere_geom)

    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}



window.addEventListener('load',setup)