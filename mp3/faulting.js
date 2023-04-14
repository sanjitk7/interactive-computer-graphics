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
