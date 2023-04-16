function spheroidal(terrainGrid, degree,  gridSize){

    for (let m = 1; m <= degree; m++){

        
        for (let k=0; k < gridSize;k++){
            for (let l=0; l < gridSize;l++){

                // create grid position indices 

                n = gridSize + 1
                i = k*n + l

                current_vertex = terrainGrid.attributes.position

                // neighbors = [i-1, i+1, i-n,i+n]
                // neighbors = [
                //             terrainGrid.attributes.position[i-1], 
                //             terrainGrid.attributes.position[i+1],
                //             terrainGrid.attributes.position[i-n],
                //             terrainGrid.attributes.position[i+n]
                //         ]
                
                neighbors = []

                // test for edge vertices cases
                // left edge cant have left neighbor
                if (i-1>0){
                    neighbors.push(current_vertex[i-1])
                }
                // top edge cant have top neighbor
                if (i-n > 0){
                    neighbors.push(current_vertex[i-n])
                }

                // right side doesnt have bounds in our grid indexing
                neighbors.push(current_vertex[i+1])
                neighbors.push(current_vertex[i+n])


                // taking average of neighbors
                average_neighbor = [0,0,0]
                for (let x=0; x< neighbors.length; x++){
                    average_neighbor = add(average_neighbor, neighbors[x])
                }
                num_neighbors = 4
                average_neighbor = div(average_neighbor,num_neighbors)

                // find vector pointing to average and move partially in that direction
                vector_towards_average = mul(sub(current_vertex[i], average_neighbor),-1)
                partial_vector = mul(vector_towards_average, 0.3)

                terrainGrid.attributes.position[i][2] = current_vertex[i][2] + partial_vector[2]
                
                
            }
        }

    }

    return terrainGrid
}