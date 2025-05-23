/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_711030668")

  // remove field
  collection.fields.removeById("number2160202909")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2696437584",
    "hidden": false,
    "id": "relation912298020",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "shippingCharge",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_711030668")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number2160202909",
    "max": null,
    "min": null,
    "name": "shippingFee",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("relation912298020")

  return app.save(collection)
})
