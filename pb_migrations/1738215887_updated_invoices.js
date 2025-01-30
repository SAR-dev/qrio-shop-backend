/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_711030668")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_8YTdUE5dve` ON `invoices` (`ref`)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("number2765055692")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text342834851",
    "max": 16,
    "min": 16,
    "name": "ref",
    "pattern": "^[A-Z0-9]+$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_711030668")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2765055692",
    "max": null,
    "min": null,
    "name": "productsFee",
    "onlyInt": false,
    "presentable": false,
    "required": true,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("text342834851")

  return app.save(collection)
})
