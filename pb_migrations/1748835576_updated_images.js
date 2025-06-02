/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3607937828")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file1602912115",
    "maxSelect": 1,
    "maxSize": 2000000,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/vnd.mozilla.apng",
      "image/webp"
    ],
    "name": "source",
    "presentable": true,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [
      "0x1500",
      "0x500",
      "0x100"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3607937828")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file1602912115",
    "maxSelect": 1,
    "maxSize": 2000000,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/vnd.mozilla.apng",
      "image/webp"
    ],
    "name": "source",
    "presentable": true,
    "protected": false,
    "required": true,
    "system": false,
    "thumbs": [
      "0x500",
      "0x100"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
