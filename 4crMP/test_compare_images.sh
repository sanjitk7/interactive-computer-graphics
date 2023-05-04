echo "\n**********Start calculating pixel-wise diff**********n"

python compareImages.py mpray_sphere.png data/img/mpray_sphere.png diffResult/mpray_sphere
python compareImages.py mpray_sun.png data/img/mpray_sun.png diffResult/mpray_sun
python compareImages.py mpray_behind.png data/img/mpray_behind.png diffResult/mpray_behind
python compareImages.py mpray_color.png data/img/mpray_color.png diffResult/mpray_color
python compareImages.py mpray_overlap.png data/img/mpray_overlap.png diffResult/mpray_overlap
python compareImages.py mpray_shadow-basic.png data/img/mpray_shadow-basic.png diffResult/mpray_shadow-basic

python compareImages.py mpray_suns.png data/img/mpray_suns.png diffResult/mpray_suns

echo "\n**********Finish calculating pixel-wise diff**********n"