/*
Terrain Generation using Faulting Method by Mandelbrot
This is a 3-fold process with - nxn rect grid creation, random fault planes and computation of vertex normals
*/
function computeTerrainGridTriangles(offset, gridSize) {
  // everytime we call the function we re-create grid based on optionsTree params - this would be a geom style object
  terrainGrid = { triangles: [], attributes: { position: [], color: []}};

// identify grid positions for each traingle vertex
  for (let i = 0; i <= gridSize; i++){
    for (let j = 0; j<= gridSize; j++){
        
        // we compute the next position from the starting positions based on resolution - distance from bw each 2 points will be offset/gridSize
        nextPosition = [(-(offset*0.5) + offset/gridSize * i), (-(offset*0.5) + offset/gridSize * j), 0]

        terrainGrid.attributes.position.push(nextPosition)
    }
  }

// create triangles by joinging 

  for (let k = 0; k < gridSize; k++){
    for (let l = 0; l< gridSize; l++){
        n = gridSize + 1
        i = l*n + k
        tri1 = [i, i+1, i+n]
        tri2 = [i+1, i+n, i+n+1]
        terrainGrid.triangles = terrainGrid.triangles.concat([tri1, tri2])
    }
  }

  return terrainGrid
}


function randomFloatFromInterval(min, max) {
    return Math.random() * (max - min + 1) + min
  }


// create given number of slices by picking random points in the terrain grid
function createRandomFaults(offset, slices, terrainGrid){

    vertices = terrainGrid.attributes.position
    pi = 3.141592653
    fault_change = 0.00777
    for (let i = 0;i < slices; i++){
        random_p = [randomFloatFromInterval(-1,1)*offset, randomFloatFromInterval(-1,1)*offset,0]
        // console.log(random_p)
        random_angle = randomFloatFromInterval(0, 2*pi)
        random_n_vector = [Math.cos(random_angle), Math.sin(random_angle), 0]

        // for each vertex
        for (let j = 0; j < vertices.length ; j++){
            diff_b_p = sub(vertices[j], random_p)
            check_fault_dir = dot(diff_b_p, random_n_vector)
            
            // move z coordniate based on sign of prev dot product
            if (check_fault_dir > 0) {
                vertices[i][2] = vertices[i][2] + fault_change
            } else{
                vertices[i][2] = vertices[i][2] - fault_change
            }
        }

    }

    // we also have to scale z wrt x 
    all_z = []
    all_y = []
    all_x = []
    for (let i = 0;i < vertices.length; i++){
        all_x.push(vertices[i][0])
        all_y.push(vertices[i][1])
        all_z.push(vertices[i][2])
    }
    min_x = Math.min(...all_x)
    min_z = Math.min(...all_z)
    max_x = Math.max(...all_x)
    max_z = Math.max(...all_z)

    if ((max_x - min_x) > 0) {
        for (let i = 0;i < vertices.length; i++){
            // scale it to bounds of the x or y coordinates
            vertices[i][2] = ((vertices[i][2] - min_z)/(max_z - min_z))*((max_x - min_x)*0.3)
            vertices[i][2] = vertices[i][2] * ((max_x - min_x)*0.3)/2
        }
    }


    terrainGrid.attributes.position = vertices

    return terrainGrid

}

