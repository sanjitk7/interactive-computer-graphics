// from lecture examples and textures page
function setup_texture_gl(glContext, imageObject, slot) {
    let texture = glContext.createTexture();
    glContext.activeTexture(glContext.TEXTURE0 + slot);
    glContext.bindTexture(glContext.TEXTURE_2D, texture);
    // glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.REPEAT);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.REPEAT);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.LINEAR_MIPMAP_LINEAR);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.LINEAR);
    glContext.texImage2D(
        glContext.TEXTURE_2D,
        0,
        glContext.RGBA,
        glContext.RGBA,
        glContext.UNSIGNED_BYTE,
        imageObject, 
    );
    glContext.generateMipmap(glContext.TEXTURE_2D)
}

// similar to addNormals function - adds texture to our object geom of terrain as an attribute
function addTexture(grid){
    console.log("addTexture")
    grid.attributes.texture = []
    let texCoordinates = new Array(grid.attributes.position.length)
    for(let i=0; i<grid.attributes.position.length; i+=1) 
        texCoordinates[i] = [grid.attributes.position[i][0], grid.attributes.position[i][1]]
        grid.attributes.texture = texCoordinates;
}