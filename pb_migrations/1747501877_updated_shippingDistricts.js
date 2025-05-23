/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320940961")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number3402113753",
    "max": null,
    "min": null,
    "name": "shippingCost",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3320940961")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number3402113753",
    "max": null,
    "min": null,
    "name": "price",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
