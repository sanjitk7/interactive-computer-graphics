
# interpolation
def interpolation_color_tri(vertex_color_list, point, tri_vertices):
    global isDepth
    global issRGB
    global isRGBA
    global color_buffer
    
    
    vertex1= (*tri_vertices[0][4], tri_vertices[0][2],  tri_vertices[0][3])
    vertex2= (*tri_vertices[1][4], tri_vertices[1][2],  tri_vertices[1][3])
    vertex3= (*tri_vertices[2][4], tri_vertices[2][2],  tri_vertices[2][3])
    
    
    weight2 = (((vertex3[1]-vertex1[1])*(point[0]-vertex3[0])) + ((vertex1[0]-vertex3[0])*(point[1]-vertex3[1])))/(((vertex2[1]-vertex3[1]) * (vertex1[0]-vertex3[0]))+((vertex3[0]-vertex2[0])*(vertex1[1]-vertex3[1])))
    weight1 = (((vertex2[1]-vertex3[1])*(point[0]-vertex3[0])) + ((vertex3[0]-vertex2[0])*(point[1]-vertex3[1])))/(((vertex2[1]-vertex3[1]) * (vertex1[0]-vertex3[0]))+((vertex3[0]-vertex2[0])*(vertex1[1]-vertex3[1])))
    weight3 = 1 - weight1 - weight2
    
    # print("color_triangle_vertex: ", vertex_color_list)
    r = vertex_color_list[0][0]*weight1+vertex_color_list[1][0]*weight2+vertex_color_list[2][0]*weight3
    g = vertex_color_list[0][1]*weight1+vertex_color_list[1][1]*weight2+vertex_color_list[2][1]*weight3
    b = vertex_color_list[0][2]*weight1+vertex_color_list[1][2]*weight2+vertex_color_list[2][2]*weight3
    # print("vertex_color_list: ",vertex_color_list)
    a = vertex_color_list[0][3]*weight1+vertex_color_list[1][3]*weight2+vertex_color_list[2][3]*weight3
    
    if isRGBA:
        if point not in color_buffer:
            color_buffer[point] = [r,g,b,a]
        else:
            # get old rgba
            r_d, g_d, b_d, a_d = color_buffer[point][0:4]
            a_prime = a + (a_d*(1-a)) 
            r_prime = ((a/a_prime)*(r))+(((1-a)*(a_d))/a_prime)*r_d
            g_prime = ((a/a_prime)*(g))+(((1-a)*(a_d))/a_prime)*g_d
            b_prime = ((a/a_prime)*(b))+(((1-a)*(a_d))/a_prime)*b_d
            color_buffer[point] = [r_prime, g_prime, b_prime, a_prime]
            
        r,g,b,a = color_buffer[point]
    # print("cb: ",color_buffer,end="->")
    
    
    # if isHyp:
    #     w = (1/v1[3])*w_1+(1/v2[3])*w_2+(1/v3[3])*w_3
    #     r = (r/w)
    #     g = (g/w)
    #     b = (b/w)
        
    
    # interpolate w and z values - also attach a flag to deal with 'depth' keyword
    okToPutPixel = True
    
    if isDepth:
        # print("point: ",point)
        if tuple(point) in depth_buffer:
            val = (weight1*vertex1[2]+weight2*vertex2[2]+weight3*vertex3[2])/(weight1*vertex1[3]+weight2*vertex2[3]+weight3*vertex3[3])

            if val > -1 and val > depth_buffer[point]:
                okToPutPixel = False
            else:
                depth_buffer[point] = val
            
    
    return r,g,b,a,okToPutPixel