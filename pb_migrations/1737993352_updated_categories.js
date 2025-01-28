/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3292755704")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1655102503",
    "max": 10,
    "min": 1,
    "name": "priority",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3292755704")

  // update field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1655102503",
    "max": 10,
    "min": 1,
    "name": "priority",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
