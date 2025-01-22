/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number91800107",
    "max": null,
    "min": null,
    "name": "originalPrice",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(10, new Field({
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

  // update field
  collection.fields.addAt(11, new Field({
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

  // update field
  collection.fields.addAt(12, new Field({
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

  // update field
  collection.fields.addAt(13, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number91800107",
    "max": null,
    "min": null,
    "name": "original_price",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(10, new Field({
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
    "name": "image_1",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  // update field
  collection.fields.addAt(11, new Field({
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
    "name": "image_2",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  // update field
  collection.fields.addAt(12, new Field({
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
    "name": "image_3",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  // update field
  collection.fields.addAt(13, new Field({
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
    "name": "image_4",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "0x500"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
