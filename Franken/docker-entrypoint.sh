#!/bin/bash
set -e

# Composer bağımlılıklarını kontrol et ve yükle
if [ ! -d "vendor" ]; then
    echo "Installing Composer dependencies..."
    composer install --optimize-autoloader
fi

# Laravel için gerekli dizinleri oluştur
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# İzinleri ayarla
chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

# PHP-FPM'i arka planda başlat
php-fpm -D

# Nginx'i ön planda başlat
exec nginx -g 'daemon off;'
