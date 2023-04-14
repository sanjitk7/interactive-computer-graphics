/*
Terrain Generation using Faulting Method by Mandelbrot
This is a 3-fold process with - nxn rect grid creation, random fault planes and computation of vertex normals
*/
function computeTerrainGridTriangles(offset, gridSize) {
  // everytime we call the function we re-create grid based on optionsTree params - this would be a geom style object
  terrainGrid = { triangles: [], attributes: { position: []}};

// identify grid positions for each traingle vertex
  for (let i = 0; i <= gridSize; i++){
    for (let j = 0; j<= gridSize; j++){
        
        // we compute the next position from the starting positions based on resolution - distance from bw each 2 points will be offset/gridSize
        nextPosition = [(-(offset*0.5) + (offset/gridSize) * i), (-(offset*0.5) + (offset/gridSize) * j), 0]

        terrainGrid.attributes.position.push(nextPosition)
    }
  }

// create triangles by joinging 

  for (let k = 0; k < gridSize; k++){
    for (let l = 0; l< gridSize; l++){
        n = gridSize + 1
        i = l*n + k
        tri1 = [i, i+1, i+n]
        tri2 = [i+1, i+n+1, i+n]
        // terrainGrid.triangles = terrainGrid.triangles.concat([tri1, tri2])
        terrainGrid.triangles.push(tri1)
        terrainGrid.triangles.push(tri2)
    }
  }

  return terrainGrid
}


function randomFloatFromInterval(min, max) {
    return Math.random() * (max - min + 1) + min
  }

/* create given number of slices by picking random points in the terrain grid
This is done by 3 sub parts - 1. selecting a random p in the grid, 2. selecting a random angle from (0,2pi),
3. creating an orth n vector as suggested using sin and cos, shifting z coordinate of entire world based on sign of the dot product (b - p).n
*/
function createRandomFaults(offset, slices, terrainGrid){

    console.log("offset:",offset)
    pi = 3.141592653
    fault_change = 0.005
    for (let i = 0;i < slices; i++){
        random_p = [randomFloatFromInterval(-0.5,0.5)*offset, randomFloatFromInterval(-1,1)*offset,0]

        random_angle = randomFloatFromInterval(-2*pi, 2*pi)

        random_n_vector = [Math.cos(random_angle), Math.sin(random_angle), 0]

        console.log("random_p:",random_p)

        // for each vertex
        for (let j = 0; j < terrainGrid.attributes.position.length ; j++){
            
            diff_b_p = sub(terrainGrid.attributes.position[j], random_p)
            
            check_fault_dir = dot(diff_b_p, random_n_vector)
            
            // console.log("bef:",terrainGrid.attributes.position[i])
            // move z coordniate based on sign of prev dot product
            if (check_fault_dir > 0) {
                terrainGrid.attributes.position[j][2] = terrainGrid.attributes.position[j][2] + fault_change
            } else{
                terrainGrid.attributes.position[j][2] = terrainGrid.attributes.position[j][2] - fault_change
            }
            // console.log("aft:",terrainGrid.attributes.position[i])
        }

    }

    // we also have to scale z wrt x 
    all_z = []
    all_y = []
    all_x = []
    for (let i = 0;i < terrainGrid.attributes.position.length; i++){
        all_x.push(terrainGrid.attributes.position[i][0])
        all_y.push(terrainGrid.attributes.position[i][1])
        all_z.push(terrainGrid.attributes.position[i][2])
    }
    min_x = Math.min(...all_x)
    min_z = Math.min(...all_z)
    max_x = Math.max(...all_x)
    max_z = Math.max(...all_z)

    if ((max_x - min_x) > 0) {
        for (let i = 0;i < terrainGrid.attributes.position.length; i++){
            // scale it to bounds of the x or y coordinates
            terrainGrid.attributes.position[i][2] = ((terrainGrid.attributes.position[i][2] - min_z)/(max_z - min_z))*((max_x - min_x)*0.5)
            // terrainGrid.attributes.position[i][2] = terrainGrid.attributes.position[i][2] * ((max_x - min_x))/2
        }
    }


    // terrainGrid.attributes.position = vertices

    return terrainGrid

}

