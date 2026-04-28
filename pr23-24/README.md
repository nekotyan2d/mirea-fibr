# Контрольная работа 4

В ходе выполнения контрольной работы 4 были выполнены следующие практические задачи:

1. Практическая работа 19:
    - реализовано небольшое REST API для работы с пользователями
    - использован ORM Sequilize для создания моделей и работы с PostgreSQL
    - добавлены эндпоинты с префиксом `/pg/` для CRUD операций

2. Практическая работа 20:
    - в прошлом проекте реализованы MongoDB схемы и по ним добавлены модели
    - добавлены новые эндпоинты с префиксом `/mongo` для CRUD операций с MongoDB
    - создание эндпоинтов для операций PostgreSQL и MongoDB в отдельных файлах (`pg.ts` и `mongo.ts`) и регистрация эндпоинтов в `index.ts`

3. Практическая работа 21:
    - за основу была взята практическая работа 11, в которой было реализовано небольшое REST API для работы с пользователями и товарами
    - добавлено кэширование с помощью Redis эндпоинтов `/api/products`, `/api/products/:id`на 10 минут, а `/api/users`, `/api/users/:id` на 1 минуту, так как данные пользователей могут изменяться намного чаще товаров
    - добавлен cacheMiddleware для взятия данных из кэша вместо повторного обращения к базе данных

4. Практическая работа 22-23:
    - реализован placeholder-бэкэнд на express, отвечающий на GET `/` порт, на котором он запущен
    - в `Dockerfile` описаны сборка и запуск NodeJS приложения на базе `node:24-alpine`
    - в `nginx.conf` прописан конфигурационный файл nginx и указаны адреса бэкэнд сервисов для балансировки нагрузки
    - в `docker-compose.yml` добавлены балансировщик нагрузки nginx и 3 сервиса placeholder-бэкэнда
    - для тестирования альтернативного балансировщика нагрузки в практической работе 22 был выбран HAProxy и добавлен в `docker-compose.yml` как дополнительный сервис
    - добавлен `haproxy.cfg` с конфигурацией для HAProxy и добавлен его маппинг в контейнер

## Структура проекта

```
pr19-20
├── index.ts #точка входа в приложение, в котором регистрируются эндпоинты для PostgreSQL и MongoDB
├── mongo.ts #эндпоинты для работы с MongoDB
├── package.json
├── package-lock.json
└── pg.ts #эндпоинты для работы с PostgreSQL
pr21
├── controllers #контроллеры для обработки логики эндпоинтов
│   ├── auth
│   │   ├── Login.ts
│   │   ├── Refresh.ts
│   │   └── Register.ts
│   ├── products
│   │   ├── CreateProduct.ts
│   │   ├── DeleteProduct.ts
│   │   ├── GetProductById.ts
│   │   ├── GetProducts.ts
│   │   └── UpdateProduct.ts
│   └── users
│       ├── BanUser.ts
│       ├── GetMe.ts
│       ├── GetUserById.ts
│       ├── GetUsers.ts
│       └── UpdateUser.ts
├── middleware
│   ├── auth.ts
│   ├── cache.ts #middleware для кэширования данных в Redis
│   └── role.ts
├── types
│   └── app.ts
├── app.ts #точка входа в приложение
├── config.ts
├── db.ts
├── docker-compose.yml
├── package.json
├── package-lock.json
├── redis.ts #подключение к Redis и экспорт клиента и функций для работы с кэшем
└── tsconfig.json
pr22
├── backend #placeholder-бэкэнд
│   ├── .dockerignore
│   ├── Dockerfile #описание сборки и запуска приложения в контейнере
│   ├── index.ts #точка входа в приложение
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── docker-compose.yml #описание сервисов и их взаимодействия
├── haproxy.cfg #конфигурация для HAProxy
└── nginx.conf #конфигурация для nginx
pr23-24
├── backend
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.ts
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── docker-compose.yml
├── nginx.conf
└── README.md
```
