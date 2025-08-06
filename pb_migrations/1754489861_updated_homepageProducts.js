/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_972686290")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "select976907234",
    "maxSelect": 1,
    "name": "layout",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "FOUR_IN_ONE",
      "FOUR_WITH_COVER"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_972686290")

  // remove field
  collection.fields.removeById("select976907234")

  return app.save(collection)
})
