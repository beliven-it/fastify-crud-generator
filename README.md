# fastify-crud-generator

A plugin to rapidly generate CRUD routes for any entity

![Node.js CI](https://github.com/heply/fastify-crud-generator/workflows/Node.js%20CI/badge.svg?branch=master)

## Install

```bash
npm i --save fastify-crud-generator
```

## Usage

```js
fastify
  .register(require('fastify-crud-generator'), {
    prefix: '/products'
  })
  .after(() => console.log(fastify.printRoutes()))
```

It can be registered as many times as you need, with different prefix:

```js
const crud = require('fastify-crud-generator')

fastify
  .register(crud, {
    prefix: '/products'
  })
  .register(crud, {
    prefix: '/orders'
  })
  .after(() => console.log(fastify.printRoutes()))
```

By default, the following routes will be registered:

```
GET    (prefix)/
POST   (prefix)/
GET    (prefix)/:id
PATCH  (prefix)/:id
DELETE (prefix)/:id
```

## Options

When registering the plugin in your app, you can pass
the following options to fine-tuning the CRUD routes generation:

| Name                | Description                                                         |
|---------------------|---------------------------------------------------------------------|
| `prefix`            | Add a prefix to all generated routes.                               |
| `controller`        | (MANDATORY) A controller object providing handlers for each route.  |
| `list`              | Route options for **list** action.                                  |
| `create`            | Route options for **create** action.                                |
| `view`              | Route options for **view** action.                                  |
| `update`            | Route options for **update** action.                                |
| `delete`            | Route options for **delete** action.                                |

### Prefix

This option can be used to prefix all routes with a common path, usually the plural
name of the entity according to REST best practices:

```js
{
  prefix: '/products'
}
```

The `prefix` option can also be used to define API version for the generated routes:

```js
{
  prefix: '/v1/products'
}
```

**NOTE:** if no `prefix` is specified, all routes will be added at the root level.

### Controller

This is the only **mandatory** option during the plugin registration.

A `controller` object provides the route handlers used to implement the classic
CRUD actions for the registered entity (list, create, view, update, delete).

Passing an external `controller` object allows the maximum flexibility in terms
of business logic and underlying data layer for any entity (*e.g. SQL, NoSQL,
file storage, etc.*)

```js
{
  prefix: '/products',
  controller: productController
}
```

A `controller` object must implement the following interface:

```js
{
  list: async (req, reply) => { ... },
  create: async (req, reply) => { ... },
  view: async (req, reply) => { ... },
  update: async (req, reply) => { ... },
  delete: async (req, reply) => { ... }
}
```

All methods accept a `req / reply` argument apir, which are the original
[request](https://www.fastify.io/docs/latest/Request/) and
[reply](https://www.fastify.io/docs/latest/Reply/) objects
passed to the route.

### Route options

The `list`, `create`, `view`, `update` and `delete` options allow to fine tune
the generated routes according to the available configuration provided by Fastify.

Take a look at the [official documentation](https://www.fastify.io/docs/latest/Routes/#routes-option)
for more details.

## Test

```bash
npm test
```

## Acknowledgements

This project is inspired by:

* [fastify-autocrud](https://www.npmjs.com/package/fastify-autocrud)

And kindly sponsored by:

[![heply](https://raw.githack.com/heply/brand/master/heply-logo.svg)](https://www.heply.it)

## License

Licensed under [MIT](./LICENSE)
