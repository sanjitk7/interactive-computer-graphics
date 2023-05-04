echo "\n-----------scipt started!-----------"


echo "\n-----------4crMP Tests: Required!-----------"


echo "\n-----------Running mpray_sphere-----------\n"
make run file="data/txt/mpray_sphere.txt"
echo "\n-----------Running mpray_sun-----------\n"
make run file="data/txt/mpray_sun.txt"
echo "\n-----------Running mpray_behind-----------\n"
make run file="data/txt/mpray_behind.txt"
echo "\n-----------Running mpray_color-----------\n"
make run file="data/txt/mpray_color.txt"
echo "\n-----------Running mpray_overlap-----------\n"
make run file="data/txt/mpray_overlap.txt"
echo "\n-----------Running mpray_shadow-basic-----------\n"
make run file="data/txt/mpray_shadow-basic.txt"

echo "\n-----------4crMP Tests: Optional!-----------"

echo "\n-----------Running mpray_suns-----------\n"
make run file="data/txt/mpray_suns.txt"
echo "\n-----------Running mpray_bulb-----------\n"
make run file="data/txt/mpray_bulb.txt"
echo "\n-----------Running mpray_neglight-----------\n"
make run file="data/txt/mpray_neglight.txt"


echo "\n-----------scipt finished!-----------"