from sys import argv
from PIL import Image
from pprint import pprint
import math

# POINT: [x,y,z,w, (x_calc, y_calc)]

# Global Data Structures
vertex_list = []
current_color = (255,255,255)
vertex_colors_list = []
# render_points = []
isDepth = False
issRGB = False
depth_buffer = {}


def get_commands_from_input(f_path):
     # get all commands from input file
    legal_command_start = ["png", "xyrgb", "xyc", "xyzw","tri","rgb", "depth","sRGB"]
    commands = []
    with open(f_path) as f:
        for line in f:
            # print("Line: ",line)
            if line.strip()=="":
                # print("Ignored Empty String!")
                continue
            if line.strip().split()[0].strip() in legal_command_start:
                commands.append(line.strip().split())
            else:
                print("Ignored Illegal: ",line)
        # print(commands)
        return commands

def hex_to_rgb(hex):
    return tuple(int(hex.strip()[i:i+2], 16) for i in (0, 2, 4))

def create_image_rgb(w, h, output_file_name):
    # global image
    image = Image.new("RGBA", (w,h), (0,0,0,0))
    image.save(output_file_name)
    return image
    
# round pixels
def round_coordinates(x,y):
    return round(x),round(y)

# difference betweek two vectors
def difference(vec1, vec2):
    return [a_i - b_i for a_i, b_i in zip(list(vec1), list(vec2))]

# addition betweek two vectors
def addition(vec1, vec2):
    return [a_i + b_i for a_i, b_i in zip(list(vec1), list(vec2))]

# divide betweek vectors and scalar
def divide_scalar(vec, scalar):
    return [a_i/scalar for a_i in vec]

# multiply betweek vectors and scalar
def product_scalar(vec, scalar):
    return [a_i*scalar for a_i in vec]


def DDA(point1,point2,d):
    # print("points: ", point1, point2)
    v1, v2 = list(point1[4]), list(point2[4])
    # print(v1,v2 ,"hiß")
    points = []
    # points overlap in direction of the dimensioin to step in
    if (v1[d] == v2[d]):
        return points
    elif (v1[d] > v2[d]):
        v1, v2 = v2, v1
    # print("v2:",v2)
    del_vector = difference(v2,v1)
    # print("del: ",del_vector)
    d_vector = divide_scalar(del_vector,del_vector[d])
    o_vector = product_scalar(d_vector, math.ceil(v1[d]) - v1[d])
    # print("o: ",o_vector)
    p = addition(v1,o_vector)
    # print("p: ",p)
    while(p[d] < v2[d]):
        points.append(p)
        p = addition(p, d_vector)
    return points

def scanline(point1, point2, point3):

    points = []
    edge1 = DDA(point1,point2,1)
    edge2 = DDA(point2,point3,1)
    edge3 = DDA(point1,point3,1)
    edges = [edge1, edge2, edge3]
    # print("\nlist of edges and lengths: ",edges, len(edge1), len(edge2), len(edge3))
    
    # taking smallest two edges
    edges = sorted(edges, key = lambda edge: len(edge))
    # print("\n length sorted list of edges: ",edges)
    
    two_edges = edges[0] + edges[1]
    # print("\ntwo_edges: ",two_edges, len(two_edges))
    
    two_edges = sorted(two_edges, key = lambda point: point[1])
    # print("\ntwo_edges points sorted by step direction: ",two_edges, len(two_edges))
    
    
    for i, point in enumerate(edges[2]):
        # print("3rd side edge point:", point,i)
        # step in x to find all possible pixels while stepping in y a the other edges
        inside_line = DDA([None,None,None,None,point], [None,None,None,None,two_edges[i]],0)
        # print("inside_line: ",inside_line)
        for p in inside_line:
            points.append(p)
    return points
    
# Gamma Correction: LStorage converted to LDisplay
def sRGB_to_linear(rGBcolors):
    linear_colors = []
    for color in rGBcolors:
        # color_scaled = color/255
        if color <= 0.04045:
            linear_colors.append(color/12.92)
        else:
            linear_colors.append(((color + 0.055)/1.055)**2.4)
    print("sRGB to linear color: ",linear_colors)
    return linear_colors

# Gamma Correction:  LDisplay converted to LStorage
def linear_to_sRGB(linear_colors):
    sRGB = []
    for color in linear_colors:
        if color <= 0.0031308:
            sRGB.append(color*12.92)
        else:
            sRGB.append((color**(1/2.4)*1.055) - 0.055)
    return sRGB
    
# interpolation
def interpolation_color(vertex_color_list, point, tri_vertices):
    global isDepth
    global issRGB
    
    v1= (*tri_vertices[0][4], tri_vertices[0][2],  tri_vertices[0][3])
    v2= (*tri_vertices[1][4], tri_vertices[1][2],  tri_vertices[1][3])
    v3= (*tri_vertices[2][4], tri_vertices[2][2],  tri_vertices[2][3])
    
    w_1 = (((v2[1]-v3[1])*(point[0]-v3[0]))+((v3[0]-v2[0])*(point[1]-v3[1])))/(((v2[1]-v3[1])*(v1[0]-v3[0]))+((v3[0]-v2[0])*(v1[1]-v3[1])))
    w_2 = (((v3[1]-v1[1])*(point[0]-v3[0]))+((v1[0]-v3[0])*(point[1]-v3[1])))/(((v2[1]-v3[1])*(v1[0]-v3[0]))+((v3[0]-v2[0])*(v1[1]-v3[1])))
    w_3 = 1-w_1-w_2
    # print("ve color:",vertex_color_list)
    # print("ve: ",og_vertex)
    
    # if issRGB:
    #     vertex_color_list = []
    
    # print("color_triangle_vertex: ", vertex_color_list)
    r = vertex_color_list[0][0]*w_1+vertex_color_list[1][0]*w_2+vertex_color_list[2][0]*w_3
    g = vertex_color_list[0][1]*w_1+vertex_color_list[1][1]*w_2+vertex_color_list[2][1]*w_3
    b = vertex_color_list[0][2]*w_1+vertex_color_list[1][2]*w_2+vertex_color_list[2][2]*w_3
    
    
    # interpolate w and z values - also attach a flag to deal with 'depth' keyword
    okToPutPixel = True
    
    if isDepth:
        # print("point: ",point)
        if tuple(point) in depth_buffer:
            z = w_1*v1[2]+w_2*v2[2]+w_3*v3[2]
            w = w_1*v1[3]+w_2*v2[3]+w_3*v3[3]
            val = z/w

            if val > depth_buffer[point] and val > -1:
                okToPutPixel = False
            else:
                depth_buffer[point] = val
            
    
    return r,g,b,okToPutPixel

    
# constructing the image
def execute_commands(command):
    global current_color
    global vertex_colors_list
    global isDepth
    global issRGB
    # global render_points
    global depth_buffer
    for command in commands:
        if command[0] == "png":
            recent_open_image_name = command[3]
            image = create_image_rgb(int(command[1]), int(command[2]), recent_open_image_name)
        
        if command[0] == "depth":
            isDepth = True
            width, height = image.size
            # initializing depth to be 1
            for i in range(width):
                for j in range(height):
                    depth_buffer[(i,j)] = 1
        
        if command[0] == "sRGB":
            issRGB = True
                    
        # creating pixel coordinates from (xyzw)            
        if command[0] == "xyzw":
            # print("command at xyzw: ",command)
            x, y, z, w = [float(i) for i in command[1:]]
            width, height = image.size
            pixel_coordinate_x,pixel_coordinate_y = (((x/w)+1)*(width/2),(((y/w)+1)*(height/2)))
            
            vertex_list.append((x,y,z,w,(pixel_coordinate_x, pixel_coordinate_y)))
            
            # issRGB = False
            if issRGB:
                # print("sRGB vertex color!")
                scaled_current_color = [int(x)/255 for x in list(current_color)]
                linear_colors_vertex = sRGB_to_linear(scaled_current_color)
                # print("colors->linear_color for vertex storage: ",current_color,"->",linear_colors_vertex)
                vertex_colors_list.append(tuple(linear_colors_vertex))
            else:
                vertex_colors_list.append(current_color)
            
            
            # print("pixel_coordinate: ", pixel_coordinate)
            image.save(recent_open_image_name)
        
        if command[0] == "rgb":
            current_color = tuple([int(x) for x in command[1:]])
            print("current color update: ",current_color)
            print("current color list: ",vertex_colors_list)
            
        if command[0] == "tri":
            v1, v2 ,v3 = [int(x) for x in command[1:]]
            width, height = image.size
            print("triangle: ",v1,v2,v3)
            
            # if positive (do -1) - offset for 0 index in python lists
            if v1 > 0:
                v1 -=1
            if v2 > 0:
                v2 -=1
            if v3 > 0:
                v3-=1
            
            tri_vertices = [vertex_list[v1],vertex_list[v2],vertex_list[v3]]
            tri_vertices_colors = [vertex_colors_list[v1],vertex_colors_list[v2],vertex_colors_list[v3]]
            
            # sorted_tri_vertices = sorted(tri_vertices, key=lambda x: x[4][1])
            
            # do scanline for v1,v2 -> find points. v1,v3 -> find points. use points found from prev 2 lines to create lines and find points along them.
            scanline_result = scanline(tri_vertices[0], tri_vertices[1], tri_vertices[2])
            
            print("tri_vertices: ",tri_vertices)
            # print("scanline_result: ", scanline_result)
            
            
            # image library plots the pixels
            for point in scanline_result:
                
                
                # # check for z/w lesser than stored depth value
                # depth_update_ok = False
                
                # if isDepth:
                #     point[2]
                
                if (point[0] <width and point[1]<height):
                    interpolation_result = interpolation_color(tri_vertices_colors, tuple(point), tri_vertices)
                    # print("interpolation_result: ",interpolation_result)
                    put_color = interpolation_result[0:3]
                    isOkToPutPixel = interpolation_result[3]
                    if isOkToPutPixel:
                        if issRGB:
                            # print("put_color srgb: ",put_color)
                            sRGB = linear_to_sRGB(list(put_color))
                            image.im.putpixel((round(point[0]),round(point[1])), (int(sRGB[0]*255),int(sRGB[1]*255),int(sRGB[2]*255), 255))
                        else:
                            image.im.putpixel((round(point[0]),round(point[1])), (int(put_color[0]),int(put_color[1]),int(put_color[2]), 255))
                else:
                    print(point, end=",")
            # image.show(recent_open_image_name)
            image.save((recent_open_image_name))
            
            # render_points = render_points + scanline_result
            
    recent_open_image_name = None
    return image


if __name__=="__main__":
    if len(argv)<2:
        pprint("Provide Input file!")
        quit()
    else:
        f_path = argv[1]
        
    commands = get_commands_from_input(f_path)
    # print("COMMANDS: ", commands)
    
    image = execute_commands(commands)
    # image = render_image()
    print("vertex_list: ",vertex_list)
    print("vertex_colors_list: ",vertex_colors_list)
    
    
    
            
            