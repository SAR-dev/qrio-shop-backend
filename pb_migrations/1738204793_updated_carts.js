/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_78z5olN9Mz` ON `carts` (\n  `users`,\n  `products`\n)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("bool989355118")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2236019783")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "bool989355118",
    "name": "completed",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
