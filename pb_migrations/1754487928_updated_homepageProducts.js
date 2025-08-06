/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_972686290")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3607937828",
    "hidden": false,
    "id": "relation3760176746",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "images",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_972686290")

  // remove field
  collection.fields.removeById("relation3760176746")

  return app.save(collection)
})
