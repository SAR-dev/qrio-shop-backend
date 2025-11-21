/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2543263368")

  // remove field
  collection.fields.removeById("text1503093023")

  // remove field
  collection.fields.removeById("text3231592613")

  // remove field
  collection.fields.removeById("text1367709617")

  // remove field
  collection.fields.removeById("text3654087349")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2543263368")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1503093023",
    "max": 0,
    "min": 0,
    "name": "title1",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3231592613",
    "max": 0,
    "min": 0,
    "name": "title2",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1367709617",
    "max": 0,
    "min": 0,
    "name": "subtitle",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3654087349",
    "max": 0,
    "min": 0,
    "name": "buttonText",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
