/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2719023664")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2167613160",
    "hidden": false,
    "id": "relation4018129786",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "productVariants",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2719023664")

  // remove field
  collection.fields.removeById("relation4018129786")

  return app.save(collection)
})
