/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2696437584")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_eeVblZLh6p` ON `shippingCharges` (\n  `shippingCompany`,\n  `shippingArea`\n)"
    ],
    "name": "shippingCharges"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2696437584")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_eeVblZLh6p` ON `shippingRates` (\n  `shippingCompany`,\n  `shippingArea`\n)"
    ],
    "name": "shippingRates"
  }, collection)

  return app.save(collection)
})
