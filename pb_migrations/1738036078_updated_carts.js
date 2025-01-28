/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id = users.id",
    "deleteRule": "@request.auth.id = users.id",
    "listRule": "@request.auth.id = users.id",
    "updateRule": "@request.auth.id = users.id",
    "viewRule": "@request.auth.id = users.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
