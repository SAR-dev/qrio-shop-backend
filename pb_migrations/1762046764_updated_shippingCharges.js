/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2696437584")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_eeVblZLh6p` ON `shippingCharges` (\n  `shippingNote`,\n  `shippingArea`\n)"
    ]
  }, collection)

  // update field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1382748703",
    "max": 0,
    "min": 0,
    "name": "shippingNote",
    "pattern": "",
    "presentable": true,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2696437584")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_eeVblZLh6p` ON `shippingCharges` (\n  `shippingCompany`,\n  `shippingArea`\n)"
    ]
  }, collection)

  // update field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1382748703",
    "max": 0,
    "min": 0,
    "name": "shippingCompany",
    "pattern": "",
    "presentable": true,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
