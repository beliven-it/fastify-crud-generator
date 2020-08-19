# fastify-crud-generator

A plugin to rapidly generate CRUD routes for any entity

![Node.js CI](https://github.com/heply/fastify-crud-generator/workflows/Node.js%20CI/badge.svg?branch=master)

## Install

```bash
$ npm i --save fastify-crud-generator
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

## Options

When registering the plugin in your app, you can pass
the following options to fine-tuning the CRUD routes generation:

| Name                | Description                                                         |
|---------------------|---------------------------------------------------------------------|
| `prefix`            | Add a prefix to all generated routes.                               |
| `repository`        | (MANDATORY) A repository object to access the underline data layer. |
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

### Repository

This is the only **mandatory** option during the plugin registration.

A `repository` object is the data layer the generator will use to implement
the classic CRUD actions on the entity (list, create, view, update, delete).

Passing an external `repository` object permits to use any kind of data layer
for the entity (*e.g. SQL, NoSQL, file storage, etc.*)

```js
{
  prefix: '/products',
  repository: productRepository
}
```

A `repository` object must implement the following interface:

```js
{
  list: async (req) => { ... },
  create: async (req) => { ... },
  view: async (req) => { ... },
  update: async (req) => { ... },
  delete: async (req) => { ... }
}
```

All methods accept a single `req` argument, which is the
[original request object](https://www.fastify.io/docs/latest/Request/)
catched by the route.

You can find more info about the **repository pattern** [here](https://medium.com/@pererikbergman/repository-design-pattern-e28c0f3e4a30).

### Route options

The `list`, `create`, `view`, `update` and `delete` options allow to fine tune
the generated routes according to the available configuration provided by Fastify.

Take a look at [the official documentation](https://www.fastify.io/docs/latest/Routes/#routes-option) for more details.

## Test

```bash
$ npm test
```

## Acknowledgements

This project is inspired by:

* [fastify-autocrud](https://www.npmjs.com/package/fastify-autocrud)

And kindly sponsored by:

[![heply](https://raw.githack.com/heply/brand/master/heply-logo.svg)](https://www.heply.it)

## License

Licensed under [MIT](./LICENSE)
