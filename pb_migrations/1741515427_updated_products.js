/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "select3050457783",
    "maxSelect": 1,
    "name": "displayType",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "PROMOTION",
      "DISCOUNT",
      "TRENDING"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("select3050457783")

  return app.save(collection)
})
