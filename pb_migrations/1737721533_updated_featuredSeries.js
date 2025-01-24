/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3374737034")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4092854851",
    "hidden": false,
    "id": "relation728267494",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "product1",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4092854851",
    "hidden": false,
    "id": "relation2992712540",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "product2",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4092854851",
    "hidden": false,
    "id": "relation3311803338",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "product3",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_4092854851",
    "hidden": false,
    "id": "relation1526894185",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "product4",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3374737034")

  // remove field
  collection.fields.removeById("relation728267494")

  // remove field
  collection.fields.removeById("relation2992712540")

  // remove field
  collection.fields.removeById("relation3311803338")

  // remove field
  collection.fields.removeById("relation1526894185")

  return app.save(collection)
})
