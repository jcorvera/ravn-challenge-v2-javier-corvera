## Clothes Store

An API where we have a manager to manage articles and clients for buying products.

## Prject Scope

[https://www.notion.so/FINAL-PROJECT-TP-ea584bcf3c2647fdac339f0433274256](https://ravndevelopment.notion.site/Tiny-store-644766d0a53241f7985cc41118960292)

## Getting Started

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes.

Once you've clone this repository, you will need to configure the .env file;
accordingly to your evironment.

Next, you will need to run the following commands, which run docker-compose

```bash
$ docker-compose build
$ docker-compose up
```

For test purposes  I share the AWS keys to upload images:
```bash
S3_BUCKET_URL=https://clothes-store-ravn.s3.us-east-2.amazonaws.com/images
S3_BUCKET_NAME=clothes-store-ravn/images
S3_BUCKET_REGION=us-east-1
S3_BUCKET_ACCESS_KEY_ID=AKIATTAN5N3RK627V6WL
S3_BUCKET_SECRET_ACCESS_KEY=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
```

After that, you can follow link [http://localhost:3000/api/#](http://localhost:3000/api/#) to see the documentaion in swagger


## Run Test

This application has coverage for all services
```bash
# test coverage
$ docker exec  -i -t [container_id] bash
    $ npm run test:cov
```

## Manager credentials

- email: manager-store@gmail.com
- password: password


