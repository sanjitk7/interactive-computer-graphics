// Code from Lecture Example 

/**
 * Sends per-vertex data to the GPU and connects it to a VS input
 * 
 * @param data    a 2D array of per-vertex data (e.g. [[x,y,z,w],[x,y,z,w],...])
 * @param program a compiled and linked GLSL program
 * @param vsIn    the name of the vertex shader's `in` attribute
 * @param mode    (optional) gl.STATIC_DRAW, gl.DYNAMIC_DRAW, etc
 * 
 * @returns the ID of the buffer in GPU memory; useful for changing data later
 */
function supplyDataBufferObj(data, program, vsIn, mode) {
    if (mode === undefined) mode = glObj.STATIC_DRAW
    
    let buf = glObj.createBuffer()
    glObj.bindBuffer(glObj.ARRAY_BUFFER, buf)
    let f32 = new Float32Array(data.flat())
    glObj.bufferData(glObj.ARRAY_BUFFER, f32, mode)
    
    let loc = glObj.getAttribLocation(program, vsIn)
    glObj.vertexAttribPointer(loc, data[0].length, glObj.FLOAT, false, 0, 0)
    glObj.enableVertexAttribArray(loc)
    
    return buf;
}


function setupGeomeryObj(geom) {
    var triangleArray = glObj.createVertexArray()
    glObj.bindVertexArray(triangleArray)

    for(let name in geom.attributes) {
        let data = geom.attributes[name]
        supplyDataBufferObj(data, programObj, name)
    }

    var indices = new Uint16Array(geom.triangles.flat())
    var indexBuffer = glObj.createBuffer()
    glObj.bindBuffer(glObj.ELEMENT_ARRAY_BUFFER, indexBuffer)
    glObj.bufferData(glObj.ELEMENT_ARRAY_BUFFER, indices, glObj.STATIC_DRAW)

    return {
        mode: glObj.TRIANGLES,
        count: indices.length,
        type: glObj.UNSIGNED_SHORT,
        vao: triangleArray
    }
}