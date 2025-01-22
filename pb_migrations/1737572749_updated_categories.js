/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3292755704")

  // remove field
  collection.fields.removeById("file3277268710")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3607937828",
    "hidden": false,
    "id": "relation3277268710",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "thumbnail",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3292755704")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "file3277268710",
    "maxSelect": 1,
    "maxSize": 1,
    "mimeTypes": [
      "image/vnd.mozilla.apng",
      "image/png",
      "image/jpeg",
      "image/webp"
    ],
    "name": "thumbnail",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x50",
      "0x500"
    ],
    "type": "file"
  }))

  // remove field
  collection.fields.removeById("relation3277268710")

  return app.save(collection)
})
