# Flightbook API
Flightbook is a personal logbook for paraglider and hang glider pilots. The flights must be registered manually and the logbook is not connected to any GPS.

Why is-it not connected to GPS?
There exist a lot of application that are connected to the GPS but often you don’t want to register the track but you just like to have a trace of the flight. For example: Tandem pilots

How is construct this project?
The entire project is construct in two parts.
- An API – Current repository
- A Web and Mobile application – https://github.com/laggery/Flightbook-MobileApp

## History
I started with this project in 2013 and first it was used from some Friends and me. 2015 I published the first mobile application version and developed a Symfony web page. 2020 I decided to redevelop the mobile application with the Ionic Framework, the backend with nestjs and make the entire project open source.

## Getting started

Start docker-compose.yml
```
docker-compose -f docker/docker-compose.yml up -d
```

Create a .env file
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=flightbook_dev
DATABASE_PASSWORD=dev
DATABASE_NAME=flightbook_dev
DATABASE_SYNCHRONIZE=false
DATABASE_SCHEMA=public
DATABASE_SSL=false

AWS_S3_ENDPOINT=http://localhost
AWS_BUCKET=flightbook-bucket
AWS_ACCESS_KEY_ID=flightbook_dev
AWS_SECRET_ACCESS_KEY=flightbook_dev_secret

JWT_SECRET=mySecret
TOKEN_EXPIRATION=1000h

FIREBASE_CREDENTIAL_JSON=

# Origin
ORIGIN_INSTRUCTOR=localhsot:4200

# Mobile App URL
MOBILE_APP_URL=http://localhost:8100

# Email
EMAIL_HOST:
EMAIL_USER:
EMAIL_PASSWORD:
EMAIL_PORT:
EMAIL_FROM:

# Payment
STRIPE_SECRET_KEY=
STRIPE_ENDPOINT_SECRET=
STRIPE_PRICE=

REVENUECAT_URL=https://api.revenuecat.com
REVENUECAT_ENTITLEMENT=
REVENUECAT_AUTH=
REVENUECAT_STRIPE_PUBLIC_KEY=

#map
MAP_URL=
MAP_ATTRIBUTIONS=
MAP_CROSS_ORIGIN=
```

Open minio http://localhost:9001/ and create a new bucket with name `flightbook-bucket`

Start nestjs app
```
npm run start:dev
```

## Db migration scripts
```
npm run migration:generate --name=appointmentType
```

## Security
If you discover security related issues, please email yannick.lagger@flightbook.ch instead of using the issue tracker.

## Licence
Copyright (C) 2013-2020 Yannick Lagger, Switzerland.
Flightbook is released under the [GPL3 License](https://opensource.org/licenses/GPL-3.0)

## Other used open source project
- 

## Authors
- Yannick Lagger yannick.lagger@flightbook.ch