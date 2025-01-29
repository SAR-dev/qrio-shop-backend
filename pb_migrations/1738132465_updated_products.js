/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "number146069935",
    "max": null,
    "min": null,
    "name": "sizeInCubicCm",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "number2697266437",
    "max": null,
    "min": null,
    "name": "weightInGm",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // remove field
  collection.fields.removeById("number146069935")

  // remove field
  collection.fields.removeById("number2697266437")

  return app.save(collection)
})
