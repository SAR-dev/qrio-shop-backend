/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4193306499")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 1,
    "name": "platform",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "FACEBOOK",
      "YOUTUBE",
      "INSTAGRAM",
      "WHATSAPP",
      "TIKTOK",
      "TWITTER"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4193306499")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 1,
    "name": "type",
    "presentable": true,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "FACEBOOK",
      "YOUTUBE",
      "INSTAGRAM",
      "WHATSAPP",
      "TIKTOK",
      "TWITTER"
    ]
  }))

  return app.save(collection)
})
