FROM dunglas/frankenphp:latest

# Sistem paketleri + PostgreSQL için libpq-dev
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    zip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libpq-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Gerekli PHP extension'ları
RUN docker-php-ext-install \
        zip \
        pcntl \
        pdo \
        pdo_pgsql \
    && pecl install redis \
    && docker-php-ext-enable redis

# Composer'ı yükle
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Çalışma dizinini ayarla
WORKDIR /var/www/html

# Uygulama dosyalarını kopyala (varsa)
COPY . /var/www/html

# İzinleri ayarla
RUN chown -R www-data:www-data /var/www/html || true \
    && chmod -R 755 /var/www/html/storage 2>/dev/null || true \
    && chmod -R 755 /var/www/html/bootstrap/cache 2>/dev/null || true

# Port'u expose et (Caddyfile'da :80 kullanılıyor)
EXPOSE 80

# FrankenPHP'yi başlat (foreground'da çalışması için "run" komutu kullanılıyor)
# Caddyfile'ı açıkça belirtiyoruz
CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8000", "--workers=16"]