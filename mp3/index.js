// Using a fixed object rotating to start with

const SomeGray = new Float32Array([0.09, 0.09, 0.09, 1])

// our initial plane shape
var land_plane =
    {"triangles":
        [[0,1,2]
        ,[2,3,0]
        ]
        // [[3,2,1],
        //  [2,3,0],
        //  [1,2,0],
        //  [0,3,1]
        // ]
    ,"attributes":
        {"position":
            [[-4.5,4.5,0.0]
            ,[ 4.5, 4.5,0.0]
            ,[4.5, -4.5, 0.0]
            ,[ -4.5,-4.5, 0.0]
            ],
            
            // [[-0.5,-0.5,-0.5]
            // ,[ 0.5, 0.5,-0.5]
            // ,[-0.5, 0.5, 0.5]
            // ,[ 0.5,-0.5, 0.5]
            // ]

            // "color" : [
            //     [0.0,1.0,0.0],
            //     [0.0,1.0,0.0],
            //     [0.0,1.0,0.0],
            //     [0.0,1.0,0.0]
            // ]
              
        }
    }

// drawing and setting up a basic shape


/** Draw one frame */
function draw() {
    gl.clearColor(...IlliniBlue) // f(...[1,2,3]) means f(1,2,3)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    gl.useProgram(program)

    gl.bindVertexArray(geom.vao)

    let lightdir =  normalize([1,1,-2])
    let halfway = normalize(add(lightdir, [0,0,1]))

    gl.uniform3fv(gl.getUniformLocation(program, 'lightdir'), lightdir) // light dir
    gl.uniform3fv(gl.getUniformLocation(program, 'halfway'), halfway)
    gl.uniform3fv(gl.getUniformLocation(program, 'lightcolor'), [1,1,1]) // white light
    gl.uniform4fv(gl.getUniformLocation(program, 'color'), SomeGray)
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'mv'), false, m4mul(v,m))
    gl.uniformMatrix4fv(gl.getUniformLocation(program, 'p'), false, p)
    gl.drawElements(geom.mode, geom.count, geom.type, 0)

}

/** Compute any time-varying or animated aspects of the scene */
function timeStep(milliseconds) {
    let seconds = milliseconds / 1000;
    
    window.m = m4mul(m4rotY(seconds/2), m4rotX(-Math.PI/2))
    // window.m = m4mul(m4rotY(seconds/2), m4rotX(seconds))
    // window.m = IdentityMatrix

    window.v = m4view([1,5,3], [0,0,0], [0,1,0])

    draw()
    requestAnimationFrame(timeStep)
}

/** Compile, link, set up geometry */
async function setup(event) {
    window.gl = document.querySelector('canvas').getContext('webgl2',
        // optional configuration object: see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        {antialias: false, depth:true, preserveDrawingBuffer:true}
    )
    let vs = await fetch('shaders/mp3-vs.glsl').then(res => res.text())
    let fs = await fetch('shaders/mp3-fs.glsl').then(res => res.text())
    window.program = compileAndLinkGLSL(vs,fs)
    gl.enable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    addNormals(land_plane)
    window.geom = setupGeomery(land_plane)
    fillScreen()
    window.addEventListener('resize', fillScreen)
    requestAnimationFrame(timeStep)
}


// call back that is called with the options object from the html file's form (buttons) - contains parameters to be used while creation and rendering of scene
async function setupScene(scene, options){
    console.log("setupScene called with: scene = ", scene, " ,options = ",options)

    
    land_plane_with_grid = computeTerrainGridTriangles(5, options.resolution)
    console.log("terrainGrid:",terrainGrid)

    land_plane_with_faults = createRandomFaults(5, options.slices, land_plane_with_grid)

    console.log("terrainGridWithFaults:",land_plane)
    // let monkey = await fetch('../playground3/monkey.json').then(res => res.json())

    land_plane = land_plane_with_faults

    // add surface normals to our polygon created for diffuse lighting 
    addNormals(land_plane_with_faults)


    // console.log("land_plane:",land_plane_with_faults)

    window.geom = setupGeomery(land_plane_with_faults)
}

window.addEventListener('load',setup)