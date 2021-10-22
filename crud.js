'use strict'

const createError = require('fastify-error')

const MissingControllerError = createError(
  'ERR_MISSING_CRUD_CONTROLLER',
  'Missing CRUD controller for %s'
)

function crud (fastify, opts, next) {
  if (!opts.controller) {
    return next(new MissingControllerError(opts.prefix || '/'))
  }

  const routeOpts = {
    list: { url: '/', ...opts.list },
    create: { url: '/', ...opts.create },
    view: { url: '/:id', ...opts.view },
    update: { url: '/:id', ...opts.update },
    delete: { url: '/:id', ...opts.delete }
  }
  const config = {
    ...opts,
    ...routeOpts
  }

  fastify.get(config.list.url, {
    handler: async (req, reply) => {
      return config.controller.list(req, reply)
    },
    ...config.list
  })

  fastify.post(config.create.url, {
    handler: async (req, reply) => {
      return config.controller.create(req, reply)
    },
    ...config.create
  })

  fastify.get(config.view.url, {
    handler: async (req, reply) => {
      return config.controller.view(req, reply)
    },
    ...config.view
  })

  fastify.patch(config.update.url, {
    handler: async (req, reply) => {
      return config.controller.update(req, reply)
    },
    ...config.update
  })

  fastify.delete(config.delete.url, {
    handler: async (req, reply) => {
      return config.controller.delete(req, reply)
    },
    ...config.delete
  })

  next()
}

module.exports = crud
