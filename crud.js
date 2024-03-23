'use strict'

const createError = require('@fastify/error')

const MissingControllerError = createError(
  'ERR_MISSING_CRUD_CONTROLLER',
  'Missing CRUD controller for %s'
)

function crud (fastify, opts, next) {
  const { controller } = opts

  if (!controller) return next(new MissingControllerError(opts.prefix || '/'))

  const config = {
    ...opts,
    list: { url: '/', ...opts.list },
    create: { url: '/', ...opts.create },
    view: { url: '/:id', ...opts.view },
    update: { url: '/:id', ...opts.update },
    delete: { url: '/:id', ...opts.delete }
  }

  if (controller.list) {
    fastify.get(config.list.url, {
      handler: controller.list,
      ...config.list
    })
  }

  if (controller.create) {
    fastify.post(config.create.url, {
      handler: controller.create,
      ...config.create
    })
  }

  if (controller.view) {
    fastify.get(config.view.url, {
      handler: controller.view,
      ...config.view
    })
  }

  if (controller.update) {
    fastify.patch(config.update.url, {
      handler: controller.update,
      ...config.update
    })
  }

  if (controller.delete) {
    fastify.delete(config.delete.url, {
      handler: controller.delete,
      ...config.delete
    })
  }

  next()
}

module.exports = crud
