#!/bin/sh
set -ex

gulp build
rsync -av --progress --checksum _output/ public/ daniel@d.sb:/var/www/alisonanddaniel.wedding/public/
rsync -av --progress --checksum nginx.conf daniel@d.sb:/var/www/alisonanddaniel.wedding/
