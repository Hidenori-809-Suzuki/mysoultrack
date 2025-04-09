FROM php:8.3-fpm

# 必要な拡張をインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Composerをインストール（公式イメージからコピー）
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリ
WORKDIR /var/www/html

# 権限設定（開発用途向け、雑にやってるから本番ではちゃんとやれ）
RUN chown -R www-data:www-data /var/www/html

# Laravel起動時のENTRYPOINTは docker-compose.yml でコントロールする
