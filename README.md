## Бесплатный безлимитный хостинг личный файлов с использованием Telegram API

### Demo

1. Перед использвнаием демо - получите личный идентификатор в [боте](https://t.me/tg_file_hosting_bot)
2. Демо приложения доступно по [ссылке](https://telegram-file-hosting.netlify.app)
   - Логин: demo@mail.com
   - Пароль: 123456
3. После авторизации в разделе Profile укажите идентификатор полученный от бота **"Set chat ID"**

### Требования

- [Телеграм бот](https://core.telegram.org/bots)
- [Проект в Firebase](https://firebase.google.com)

### Перед запуском

Создать файл .env.local, содержащий:

- NEXT_PUBLIC_BOT_TOKEN - токен TG бота, с которым будет работать приложение
- FIREBASE_ADMIN_CREDITS - [данные учетной записи администратора Firebase Admin SDK](https://firebase.google.com/docs/admin/setup?hl=ru) в виде одной строки
- NEXT_PUBLIC_FIREBASE_CLIENT_CREDITS - данные приложения, добавленного в Firebase в виде одной строки
- FIREBASE_DATABASE_URL - адрес Realtime database Firebase
- URL - домен для обработки хуков ТГ бота на локальном сервере, например созданный через [ngrok](https://ngrok.com)
- NEXT_PUBLIC_URL - адрес опубликованного приложения, потребуется для автоматизированного деплоя

**Пример**

```
# TG Bot key
NEXT_PUBLIC_BOT_TOKEN=5337122268:AAFUrO1kIfDcXqAd1ddKtKWYqJD8jnqXYxY

# Firebase Credits
FIREBASE_ADMIN_CREDITS={ "type": "service_account", "project_id": "project", "private_key_id": "lorem", "private_key": "lorem", "client_email": "user@project.iam.gserviceaccount.com", "client_id": "lorem", "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": "https://oauth2.googleapis.com/token", "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs", "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-meaze%40project.iam.gserviceaccount.com" }

NEXT_PUBLIC_FIREBASE_CLIENT_CREDITS={ "apiKey": "lorem", "authDomain": "project.firebaseapp.com", "databaseURL": "https://project-db.firebasedatabase.app/", "projectId": "project", "storageBucket": "project.appspot.com", "messagingSenderId": "lorem", "appId": "lorem" }

FIREBASE_DATABASE_URL=https://project-db.firebasedatabase.app

# Netlify
URL=https://50f0-149-3-68-246.ngrok.io

# Application public URL
NEXT_PUBLIC_URL=https://example.com
```

### Установка

```
npm install
```

### Запуск dev-сервера

```
npm run dev
```

### Сборка

```
npm run build
```

### Запуск Storybook

```
npm run storybook
```
