'use strict'

const createError = require('@fastify/error')

const MissingControllerError = createError(
  'ERR_MISSING_CRUD_CONTROLLER',
  'Missing CRUD controller for %s'
)

function crud (fastify, opts, next) {
  const { controller } = opts
  if (!controller) return next(new MissingControllerError(opts.prefix || '/'))

  const { list, create, view, update, delete: del } = controller

  const config = {
    ...opts,
    list: { url: '/', ...opts.list },
    create: { url: '/', ...opts.create },
    view: { url: '/:id', ...opts.view },
    update: { url: '/:id', ...opts.update },
    delete: { url: '/:id', ...opts.delete }
  }

  if (list) {
    fastify.get(config.list.url, {
      handler: list,
      ...config.list
    })
  }

  if (create) {
    fastify.post(config.create.url, {
      handler: create,
      ...config.create
    })
  }

  if (view) {
    fastify.get(config.view.url, {
      handler: view,
      ...config.view
    })
  }

  if (update) {
    fastify.patch(config.update.url, {
      handler: update,
      ...config.update
    })
  }

  if (del) {
    fastify.delete(config.delete.url, {
      handler: del,
      ...config.delete
    })
  }

  next()
}

module.exports = crud
