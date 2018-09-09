for x in 16 48 96 128 192 257 512 1024; do inkscape --export-png ../website/static/img/audius.logo${x}.png -w ${x} ../img/audius.logo.square.svg ; done
convert -density 384 ../img/audius.logo.square.svg -define icon:auto-resize ../website/static/img/favicon.ico
