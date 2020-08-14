const t = require('tap')
const Fastify = require('fastify')

function buildFastify (t) {
  const fastify = Fastify()
  t.tearDown(() => fastify.close())
  return fastify
}

function buildRepository (mocks = {}) {
  return {
    list: () => mocks.list || [],
    create: () => mocks.create || {},
    view: () => mocks.view || {},
    update: () => mocks.update || {},
    delete: () => mocks.delete || {}
  }
}

t.test('fastify-crud-generator', async t => {
  t.test('without a prefix', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify
        .register(require('../crud'), {
          repository: buildRepository()
        })
        .after(() => {
          const res = fastify.printRoutes()
          const ref = `\
└── / (GET|POST)
    └── :id (DELETE)
        :id (GET)
        :id (PATCH)
`
          t.equal(res, ref, 'should have generated all routes in the root')
        })
    } catch (err) {
      t.error(err, 'should not throw any error')
    }
  })

  t.test('with a prefix', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify
        .register(require('../crud'), {
          prefix: '/products',
          repository: buildRepository()
        })
        .after(() => {
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
        })
    } catch (err) {
      t.error(err, 'should not throw any error')
    }
  })

  t.test('with custom route URLs', async t => {
    t.plan(1)
    const fastify = buildFastify(t)
    try {
      await fastify
        .register(require('../crud'), {
          prefix: '/products',
          repository: buildRepository(),
          list: { url: '/list' },
          create: { url: '/create' }
        })
        .after(() => {
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
        })
    } catch (err) {
      t.error(err, 'should not throw any error')
    }
  })
})