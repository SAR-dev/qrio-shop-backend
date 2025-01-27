/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_218332259")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number1655102503",
    "max": 10,
    "min": 1,
    "name": "priority",
    "onlyInt": true,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_218332259")

  // remove field
  collection.fields.removeById("number1655102503")

  return app.save(collection)
})
