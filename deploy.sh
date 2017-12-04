#!/bin/sh
set -ex

yarn install
composer install -o --apcu-autoloader
gulp build
rsync -av --progress --checksum _output/ public/ daniel@d.sb:/var/www/alisonanddaniel.wedding/public/
rsync -av --progress --checksum nginx.conf vendor daniel@d.sb:/var/www/alisonanddaniel.wedding/
