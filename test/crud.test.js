const t = require('tap')
const Fastify = require('fastify')

function buildFastify (t) {
  const fastify = Fastify({ logger: false })
  t.tearDown(() => fastify.close())
  return fastify
}

function buildRepository (mocks = {}) {
  return {
    list: async () => mocks.list || [],
    create: async () => mocks.create || {},
    view: async () => mocks.view || {},
    update: async () => mocks.update || {},
    delete: async () => mocks.delete || {}
  }
}

t.test('fastify-crud-generator', async t => {
  t.test('without a repository', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify.register(require('../crud'))
    } catch (err) {
      t.true(err, 'should throw an error')
    }
  })

  t.test('without a prefix', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify.register(require('../crud'), {
        repository: buildRepository()
      })
      const res = fastify.printRoutes()
      const ref = `\
└── / (GET|POST)
    └── :id (DELETE)
        :id (GET)
        :id (PATCH)
`
      t.equal(res, ref, 'should have generated all routes in the root')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('with a prefix', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify.register(require('../crud'), {
        prefix: '/products',
        repository: buildRepository()
      })
      const res = fastify.printRoutes()
      const ref = `\
└── /
    └── products (GET|POST)
        └── / (GET|POST)
            └── :id (DELETE)
                :id (GET)
                :id (PATCH)
`
      t.equal(res, ref, 'should have generated all routes at the given prefix')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('with custom route URLs', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify.register(require('../crud'), {
        prefix: '/products',
        repository: buildRepository(),
        list: { url: '/list' },
        create: { url: '/create' }
      })
      const res = fastify.printRoutes()
      const ref = `\
└── /
    └── products/
        ├── list (GET)
        ├── create (POST)
        └── :id (DELETE)
            :id (GET)
            :id (PATCH)
`
      t.equal(res, ref, 'should have generated routes with custom URLs')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('with custom route handler', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    const responseMsg = 'ok'
    const handler = async (req, reply) => {
      return reply.send(responseMsg)
    }
    try {
      await fastify.register(require('../crud'), {
        prefix: '/products',
        repository: buildRepository(),
        list: { handler }
      })
      const res = await fastify.inject({
        url: '/products'
      })
      t.equal(res.payload, responseMsg, 'should use custom handler')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('calling the "list" route', async t => {
    t.plan(2)
    const fastify = buildFastify(t)
    try {
      const mocks = {
        list: [{ id: 1 }]
      }
      await fastify.register(require('../crud'), {
        repository: buildRepository(mocks)
      })
      const res = await fastify.inject({
        url: '/'
      })
      t.equal(res.statusCode, 200, 'should return 200')
      const payload = JSON.parse(res.payload)
      t.same(payload, mocks.list, 'should invoke the repository "list" method')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('calling the "create" route', async t => {
    t.plan(2)
    const fastify = buildFastify(t)
    try {
      const mocks = {
        create: { id: 1 }
      }
      await fastify.register(require('../crud'), {
        repository: buildRepository(mocks)
      })
      const res = await fastify.inject({
        url: '/',
        method: 'POST',
        body: mocks.create
      })
      t.equal(res.statusCode, 200, 'should return 200')
      const payload = JSON.parse(res.payload)
      t.same(payload, mocks.create, 'should invoke the repository "create" method')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('calling the "view" route', async t => {
    t.plan(2)
    const fastify = buildFastify(t)
    try {
      const mocks = {
        view: { id: 1 }
      }
      await fastify.register(require('../crud'), {
        repository: buildRepository(mocks)
      })
      const res = await fastify.inject({
        url: `/${mocks.view.id}`
      })
      t.equal(res.statusCode, 200, 'should return 200')
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, mocks.view, 'should invoke the repository "view" method')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('calling the "update" route', async t => {
    t.plan(2)
    const fastify = buildFastify(t)
    try {
      const mocks = {
        update: { id: 1 }
      }
      await fastify.register(require('../crud'), {
        repository: buildRepository(mocks)
      })
      const res = await fastify.inject({
        url: `/${mocks.update.id}`,
        method: 'PATCH',
        body: mocks.update
      })
      t.equal(res.statusCode, 200, 'should return 200')
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, mocks.update, 'should invoke the repository "update" method')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('calling the "delete" route', async t => {
    t.plan(2)
    const fastify = buildFastify(t)
    try {
      const mocks = {
        delete: { id: 1 }
      }
      await fastify.register(require('../crud'), {
        repository: buildRepository(mocks)
      })
      const res = await fastify.inject({
        url: `/${mocks.delete.id}`,
        method: 'DELETE'
      })
      t.equal(res.statusCode, 200, 'should return 200')
      const payload = JSON.parse(res.payload)
      t.deepEqual(payload, mocks.delete, 'should invoke the repository "delete" method')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })

  t.test('registering it twice with different prefix', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify.register(require('../crud'), {
        prefix: '/products',
        repository: buildRepository()
      })
      await fastify.register(require('../crud'), {
        prefix: '/orders',
        repository: buildRepository()
      })
      const res = fastify.printRoutes()
      const ref = `\
└── /
    ├── products (GET|POST)
    │   └── / (GET|POST)
    │       └── :id (DELETE)
    │           :id (GET)
    │           :id (PATCH)
    └── orders (GET|POST)
        └── / (GET|POST)
            └── :id (DELETE)
                :id (GET)
                :id (PATCH)
`
      t.equal(res, ref, 'should have generated all routes for both prefixes')
    } catch (err) {
      console.log(err)
      t.error(err, 'should not throw any error')
    }
  })
})
