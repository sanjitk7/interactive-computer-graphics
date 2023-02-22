from sys import argv
from PIL import Image
from pprint import pprint

vertex_list = []
current_color = (255,255,255)

def get_commands_from_input(f_path):
     # get all commands from input file
    legal_command_start = ["png", "xyrgb", "xyc", "xyzw","tri","rgb"]
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

# constructing the image
def execute_commands(command):
    global current_color
    for command in commands:
        if command[0] == "png":
            recent_open_image_name = command[3]
            image = create_image_rgb(int(command[1]), int(command[2]), recent_open_image_name)
        
        # creating pixel coordinates from (xyzw)            
        if command[0] == "xyzw":
            # print("command at xyzw: ",command)
            x, y, z, w = [float(i) for i in command[1:]]
            width, height = image.size
            pixel_coordinate_x,pixel_coordinate_y = (((x/w)+1)*(width/2),(((y/w)+1)*(height/2)))
            # print("pixel_coordinate to plot xyzw: ", round(pixel_coordinate_x), round(pixel_coordinate_y))
            r_x, r_y = round_coordinates(pixel_coordinate_x, pixel_coordinate_y)
            if (r_x <width and r_y<height):
                # print("PIXEL PUT: ",)
                image.im.putpixel((r_x,r_y), (*current_color, 255))
            vertex_list.append((x,y,z,w,(pixel_coordinate_x, pixel_coordinate_y)))
            # print("pixel_coordinate: ", pixel_coordinate)
            image.save(recent_open_image_name)
        
        if command[0] == "rgb":
            current_color = tuple([int(x) for x in command[1:]])
            print("current color update: ",current_color)
            
    recent_open_image_name = None
    return image


if __name__=="__main__":
    if len(argv)<2:
        pprint("Provide Input file!")
        quit()
    else:
        f_path = argv[1]
        
    commands = get_commands_from_input(f_path)
    print("COMMANDS: ", commands)
    
    image = execute_commands(commands)
    print("vertex_list: ",vertex_list)
    
    
    
            
            