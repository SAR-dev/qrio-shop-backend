/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text724990059",
        "max": 0,
        "min": 0,
        "name": "title",
        "pattern": "",
        "presentable": true,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2560465762",
        "max": 20,
        "min": 2,
        "name": "slug",
        "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file3277268710",
        "maxSelect": 1,
        "maxSize": 1,
        "mimeTypes": [
          "image/vnd.mozilla.apng",
          "image/png",
          "image/jpeg",
          "image/webp"
        ],
        "name": "thumbnail",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [
          "0x50",
          "0x500"
        ],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_3292755704",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_p9OkpdqDOq` ON `categories` (`title`)",
      "CREATE UNIQUE INDEX `idx_rdna83IlOu` ON `categories` (`slug`)"
    ],
    "listRule": null,
    "name": "categories",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3292755704");

  return app.delete(collection);
})
