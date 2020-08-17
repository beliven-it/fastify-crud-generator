'use strict'

const createError = require('fastify-error')

const MissingRepositoryError = createError(
  'FST_MISSING_CRUD_REPOSITORY',
  'Missing CRUD repository for %s'
)

function crud (fastify, opts, next) {
  if (!opts.repository) throw new MissingRepositoryError(opts.prefix || '/')

  const routeOpts = {
    list: { url: '/', ...opts.list },
    create: { url: '/', ...opts.create },
    view: { url: '/:id', ...opts.view },
    update: { url: '/:id', ...opts.update },
    delete: { url: '/:id', ...opts.delete }
  }
  const config = {
    ...opts,
    ...routeOpts,
  }

  fastify.get(config.list.url, {
    handler: async (req, reply) => {
      try {
        const res = await config.repository.list(req)
        reply.send(res)
      } catch (err) {
        throw err
      }
    },
    ...config.list
  })

  fastify.post(config.create.url, {
    handler: async (req, reply) => {
      try {
        const res = await config.repository.create(req)
        reply.send(res)
      } catch (err) {
        throw err
      }
    },
    ...config.create
  })

  fastify.get(config.view.url, {
    handler: async (req, reply) => {
      try {
        const res = await config.repository.view(req)
        reply.send(res)
      } catch (err) {
        throw err
      }
    },
    ...config.view
  })

  fastify.patch(config.update.url, {
    handler: async (req, reply) => {
      try {
        const res = await config.repository.update(req)
        reply.send(res)
      } catch (err) {
        throw err
      }
    },
    ...config.update
  })

  fastify.delete(config.delete.url, {
    handler: async (req, reply) => {
      try {
        const res = await config.repository.delete(req)
        reply.send(res)
      } catch (err) {
        throw err
      }
    },
    ...config.delete
  })

  next()
}

module.exports = crud