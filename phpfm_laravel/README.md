# Laravel + Docker (Basit Kurulum)

Bu dizin Docker ile çalışacak basit bir Laravel geliştirme ortamı içerir.

**Hızlı Başlangıç**

1) Docker görüntülerini oluşturup servisleri ayağa kaldırın:

```powershell
# projenin kök dizininde çalıştırın
docker-compose up -d --build
```

docker-compose run --rm composer create-project --prefer-dist laravel/laravel .
2) Laravel skeleton'ını `backend/` klasörüne oluşturun (composer servisini kullanarak):

```powershell
# projenin kök dizininde çalıştırın
docker-compose run --rm composer create-project --prefer-dist laravel/laravel backend
```

docker-compose exec app php artisan key:generate
3) `.env` dosyasını oluşturun ve `APP_KEY` üretin:

```powershell
copy .env.example backend\.env
docker-compose exec app php artisan key:generate
```

docker-compose exec app php artisan migrate
4) Veritabanı migrasyonlarını çalıştırın (opsiyonel):

```powershell
docker-compose exec app php artisan migrate
```

5) Tarayıcıda açın: `http://localhost:8080`

**Notlar**
- MySQL root parolası `root`, uygulama DB: `laravel`, kullanıcı: `laravel`, parola: `secret` şeklinde yapılandırıldı (gerekirse `.env` üzerinde değiştirin).
- Geliştirme sırasında `vendor/` klasörünü ve `node_modules/`'u `.gitignore`'a eklemeyi unutmayın.

İsterseniz ben: docker-compose dosyasını test edebilir, .env'i ayarlayabilir veya konteyner içinde komut çalıştırıp Laravel'i başlatabilirim. Hangi adımı yapmamı istersiniz?
