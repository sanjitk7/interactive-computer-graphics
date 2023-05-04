# https://cs418.cs.illinois.edu/website/hw-raytracer.html

from sys import argv
from PIL import Image
from pprint import pprint
import numpy as np
import math

# utilFunctions
from utilFunctions import get_commands_from_input, initScene,sRGB_to_linear,linear_to_sRGB, ray_thing_intersection, get_object_normal,get_light_dir_dist, lamberts_law_illumination
from vectorUtils import normalize, norm


# global vars
times = 0
empty_array = np.zeros(3)

if __name__=="__main__":
    print("\nMAIN")
    
    global image
    global objects
    global light_bounces
    
    if len(argv)<2:
        pprint("Provide Input file!")
        quit()
    else:
        f_path = argv[1]
        
    commands = get_commands_from_input(f_path)
    
    # stage 1 - run through objects and initialize data structure to store them
    image, objects, lights, light_bounces, output_file_name = initScene(commands)
    
    # stage 2 - shoot, bounce and intersect rays for each pixel (from camera)
    width, height = image.size
    
    # default light source if light source isnt specified
    default_lights = [{
        "type": "sun",
        "position": np.array([1,0,0]),
        "diffuse": np.array([0,0,0])
    }]
    
    if len(lights) == 0:
        lights = default_lights

    # default vectors
    eye = np.array([0,0,0])
    up = np.array([0,1,0])
    forward = np.array([0,0,-1])
    right = np.array([1,0,0])
    
    # handle each light - ray emission
    for light_idx, light in enumerate(lights):
        # shoot ray at each pixel
        for i in range(height):
            for j in range(width):
                # print("RAY EMISSION FOR PIXEL :",j,i)
                
                origin = eye
                
                sx = (2*j - width)/max(width,height)
                sy = (height - 2*i)/max(width,height)
                
                # generate rays
                ray_direction = normalize(forward+ sx*right + sy*up)
                
                # print("jiji",j,i)
                current_color = (np.array(image.getpixel((j,i)))[:-1])/255
                current_color = sRGB_to_linear(current_color)
                
                # ray collision
                shadow = False
                ray_interaction_occur = True
                ray_interaction_objects = []
                lambert_illumination = np.array([0,0,0])
                
                
                # do ray collision for a default of 4 times
                for bounce_idx in range(light_bounces):
                    
                    first_object, t = ray_thing_intersection(objects, origin, ray_direction)
                    
                    # skip further bounce iteration if light doesn't hit anything in the first place
                    if (first_object==None and bounce_idx==0):
                        ray_interaction_occur = False
                    
                    if (first_object==None):
                        break
                    
                    # new ray create
                    ray_hit = origin + t * ray_direction
                    object_surface_normal = get_object_normal(first_object, ray_hit)
                    
                    # add bias - offset the new ray by a very small point to avoid self shadowing and move the reset the ray emission point for next iteration
                    origin_offset = ray_hit + (1e-5*object_surface_normal)
                    origin = origin_offset
                    
                    light_intersection, light_intersection_dist = get_light_dir_dist(light,ray_hit)
                    
                    # find the next interaction on ray bounce
                    next_object, next_object_t = ray_thing_intersection(objects, origin_offset, light_intersection)
                    
                    # if bounced ray hits object first before cam - shadow (set pixel 0) => no further bounces
                    if ((next_object_t < light_intersection_dist) and bounce_idx==0):
                        shadow = True
                        image.putpixel((j,i), tuple(np.append(np.array(image.getpixel((j, i)))[:-1], [255])))
                        break
                
                    # illumination
                    lambert_illumination = lamberts_law_illumination(first_object, light["diffuse"], light_intersection, object_surface_normal)
                   
                    
                    ray_interaction_objects += [{
                        "shine": first_object["shine"],
                        "illum": lambert_illumination
                    }]
                
                # if no shadow on this pixel iteration -> render the correct illuminated color -> if not shadow black
                
                ray_interaction_objects += [{"shine":empty_array,"illum":empty_array}]
                
                # setting the image colors based on ray_object_interactions
                if shadow == False:
                    ray_interaction_objects_reversed = ray_interaction_objects[::-1]
                    
                    final_color = empty_array
                    for shadow_object in ray_interaction_objects_reversed:
                        # final_color = (np.array([1,1,1]) - np.array(shadow_object["shine"])) * np.array(shadow_object["illum"]) + np.array(shadow_object["shine"]) * final_color
                        final_color = np.array(shadow_object["illum"])
                        
                    if not ((final_color == np.zeros(3)).all() and not ray_interaction_occur):
                        output_color = current_color + np.array(final_color)
                        output_color = tuple(linear_to_sRGB(output_color)*255)
                        image.putpixel((j,i), tuple(np.append(output_color, [255]).astype(int)))

                        
    print("times",times)
    print("\ncommands: ",commands)
    print("objects: ",objects)
    image.save(output_file_name)
    