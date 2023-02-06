from sys import argv
from PIL import Image

def hex_to_rgb(hex):
    return tuple(int(hex.strip()[i:i+2], 16) for i in (0, 2, 4))

if __name__=="__main__":
    if len(argv)<2:
        print("Provide Inputfile!")
        quit()
    else:
        # print(argv[1])
        f_path = argv[1]
    
    # get all commands from input file
    legal_command_start = ["png", "xyrgb", "xyc"]
    commands = []
    with open(f_path) as f:
        for line in f:
            # print("Line: ",line)
            if line.strip()=="":
                # print("Ignored Empty String!")
                continue
            if line.strip().split()[0].strip() in legal_command_start:
                commands.append(line.strip().split())
            # else:
            #     print("Ignored Illegal: ",line)
        # print(commands)

    # constructing the image
    # image = Image.new("RGBA", (width, height), (0,0,0,0))
    
    for command in commands:
        if command[0] == "png":
            w,h = int(command[1]), int(command[2])
            image = Image.new("RGBA", (w,h), (0,0,0,0))
            image.save(command[3])
            recent_open_image_name = command[3]
        if command[0] == "xyrgb":
            # print("command: ",command)
            x, y, r, g, b = [int(i) for i in command[1:]]
            image.im.putpixel((x,y), (r, g, b, 255))
            image.save(recent_open_image_name)
        if command[0] == "xyc":
            # print("command: ",command)
            x,y = [int(i) for i in command[1:3]]
            hex = command[3]
            r,g,b = hex_to_rgb(hex[1:])
            image.im.putpixel((x,y), (r, g, b, 255))
            image.save(recent_open_image_name)
            
    
    
    
    
    
    