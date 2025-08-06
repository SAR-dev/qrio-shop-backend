/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_972686290")

  // update field
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
      "FOUR_WITH_COVER",
      "FOUR_IN_ROW",
      "PROMOTION"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_972686290")

  // update field
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
      "FOUR_WITH_COVER",
      "PROMOTION"
    ]
  }))

  return app.save(collection)
})
