/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("file392827873")

  // remove field
  collection.fields.removeById("file2388869723")

  // remove field
  collection.fields.removeById("file4184109773")

  // remove field
  collection.fields.removeById("file1728112494")

  // add field
  collection.fields.addAt(12, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3607937828",
    "hidden": false,
    "id": "relation3760176746",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "images",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "file392827873",
    "maxSelect": 1,
    "maxSize": 1,
    "mimeTypes": [
      "image/vnd.mozilla.apng",
      "image/png",
      "image/jpeg",
      "image/webp"
    ],
    "name": "image1",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "file2388869723",
    "maxSelect": 1,
    "maxSize": 1,
    "mimeTypes": [
      "image/vnd.mozilla.apng",
      "image/png",
      "image/jpeg",
      "image/webp"
    ],
    "name": "image2",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "file4184109773",
    "maxSelect": 1,
    "maxSize": 1,
    "mimeTypes": [
      "image/vnd.mozilla.apng",
      "image/png",
      "image/jpeg",
      "image/webp"
    ],
    "name": "image3",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "file1728112494",
    "maxSelect": 1,
    "maxSize": 1,
    "mimeTypes": [
      "image/vnd.mozilla.apng",
      "image/png",
      "image/jpeg",
      "image/webp"
    ],
    "name": "image4",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  // remove field
  collection.fields.removeById("relation3760176746")

  return app.save(collection)
})
