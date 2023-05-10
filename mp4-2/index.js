const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])
const FoggyBackground = new Float32Array([0.590088, 0.586554, 0.554753, 1])

var once = false
var use_texture_obj = false
var use_color_obj = false

var land_plane =
    {"triangles":
        [[0,1,2]
        ,[2,3,0]
        ]
    ,"attributes":
        {"position":
            [[-4.5,4.5,0.0]
            ,[ 4.5, 4.5,0.0]
            ,[4.5, -4.5, 0.0]
            ,[ -4.5,-4.5, 0.0]
            ],
        }
    }


// fog mode
window.use_fog = false

// movement directions
window.x = 0.0
window.y = 0.0
window.z = 0.0

// camera directions
window.pitch = 0.0
window.yaw = 0.0

/** Draw one frame */
function draw(milliseconds) {
    gl.clearColor(...FoggyBackground) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    
    // set up stuff for terrain
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)
    // do diffuse lighting by default and specular if chosen

    let lightdir =  normalize([1,1,2])
    let halfway = normalize(add(lightdir, [0,0,0]))

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), lightdir) // light dir
    gl.uniform3fv(gl.getUniformLocation(program, 'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(program, 'lightcolor'), [1,1,1]) // white light

    gl.uniform1i(gl.getUniformLocation(program, 'image'), 0)

    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m_terrain))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
    gl.drawElements(geom.mode, geom.count, geom.type, 0)


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
    let vs = await fetch('shaders/mp3-vs.glsl').then(res => res.text())
    let fs = await fetch('shaders/mp3-fs.glsl').then(res => res.text())

    window.program = compileAndLinkGLSL(gl, vs,fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    
    // initial model matrices on render
    window.m_terrain = m4mul(
        m4trans(0,0,2),
        m4rotY(0.4), 
        m4rotX(Math.PI)
        )
    
    window.initial_view = m4mul(
        m4rotX(-0.4),
        m4view([2,-5,5], [0,0,0], [0,1,0])
    )
    
    // do single sphere setup
    window.geom = setupGeomery(sphere_geom)

    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}



window.addEventListener('load',setup)