routerAdd("GET", "/api/homepage", (c) => {
    const homepageCarousel = arrayOf(new DynamicModel({
        redirectTo: '',
        title: '',
        subtitle: '',
        imageId: '',
        imageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                hc.redirectTo,
                COALESCE(hc.title, '') AS title,
                COALESCE(hc.subtitle, '') AS subtitle,
                COALESCE(i.id, '') AS imageId,
                COALESCE(i.source, '') AS imageSource
            FROM homepageCarousel hc 
            LEFT JOIN images i ON i.id = hc.images 
            ORDER BY hc.priority DESC   
        `)
        .all(homepageCarousel)

    return c.json(200, {
        homepageCarousel
    })
});

routerAdd("GET", "/api/homepage-products", (c) => {
    const productSections = arrayOf(new DynamicModel({
        id: '',
        title: '',
        subtitle: '',
        imageId: '',
        imageSource: '',
        layout: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                ps.id,
                ps.title,
                ps.subtitle,
                ps.layout,
                COALESCE(i.id, '') AS imageId,
                COALESCE(i.source, '') AS imageSource
            FROM homepageProducts ps
            LEFT JOIN images i ON i.id = ps.images
        `)
        .all(productSections)

    const products = arrayOf(new DynamicModel({
        sectionId: '',
        id: '',
        title: '',
        tagLine: '',
        slug: '',
        sellingPrice: '',
        discount: '',
        summary: '',
        productImageId: '',
        productImageSource: '',
        categoryTitle: '',
        categorySlug: '',
        seriesTitle: '',
        seriesSlug: ''
    }))

    $app.db()
        .newQuery(`
            WITH res AS (
                SELECT 
                    ps.id,
                    json_each.value AS productId
                FROM homepageProducts ps, json_each(ps.products)
                WHERE ps.id IN (${productSections.map(e => `'${e.id}'`).join(',')})
            )
            SELECT 
                r.id AS sectionId,
                p.id,
                p.title,
                p.slug,
                p.sellingPrice,
                p.discount,
                p.summary,
                COALESCE(ct.title, '') AS categoryTitle,
                COALESCE(ct.slug, '') AS categorySlug,
                COALESCE(s.title, '') AS seriesTitle,
                COALESCE(s.slug, '') AS seriesSlug,
                COALESCE(pi.id, '') AS productImageId,
                COALESCE(pi.source, '') AS productImageSource
            FROM products p
            JOIN res r ON r.productId = p.id 
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
        `)
        .all(products)

    const productSectionProducts = productSections.map(e => {
        return { ...e, products: [] }
    })

    products.forEach((product) => {
        const foundIndex = productSectionProducts.findIndex(e => e.id == product.sectionId)
        productSectionProducts[foundIndex].products = [...productSectionProducts[foundIndex].products, {
            ...product
        }]
    })

    return c.json(200, productSectionProducts)
})

routerAdd("GET", "/api/homepage-lists", (c) => {
    const seriesList = arrayOf(new DynamicModel({
        id: '',
        title: '',
        slug: '',
        seriesImageId: '',
        seriesImageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                s.id,
                s.title,
                s.slug,
                COALESCE(i.id, '') AS seriesImageId,
                COALESCE(i.source, '') AS seriesImageSource
            FROM series s
            LEFT JOIN images i ON i.id = s.thumbnail 
            ORDER BY s.priority DESC
            LIMIT 12
        `)
        .all(seriesList)

    const blogList = arrayOf(new DynamicModel({
        id: '',
        title: '',
        slug: '',
        category: '',
        publishedAt: '',
        summary: '',
        blogImageId: '',
        blogImageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                b.id,
                b.title,
                b.slug,
                b.category,
                b.publishedAt,
                b.summary,
                COALESCE(i.id, '') AS blogImageId,
                COALESCE(i.source, '') AS blogImageSource
            FROM blogs b
            LEFT JOIN images i ON i.id = b.cover 
            ORDER BY b.publishedAt DESC
            LIMIT 5
        `)
        .all(blogList)

    const categoryList = arrayOf(new DynamicModel({
        id: '',
        title: '',
        slug: '',
        categoryImageId: '',
        categoryImageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                c.id,
                c.title,
                c.slug,
                COALESCE(i.id, '') AS categoryImageId,
                COALESCE(i.source, '') AS categoryImageSource
            FROM categories c
            LEFT JOIN images i ON i.id = c.thumbnail 
            ORDER BY c.priority DESC
            LIMIT 30
        `)
        .all(categoryList)

    return c.json(200, {
        seriesList,
        blogList,
        categoryList
    })
})

routerAdd("GET", "/api/suggest-products/{id}", (c) => {
    const productId = c.request.pathValue("id");

    const suggestedProducts = arrayOf(new DynamicModel({
        id: '',
        title: '',
        tagLine: '',
        slug: '',
        sellingPrice: '',
        discount: '',
        summary: '',
        productImageId: '',
        productImageSource: '',
        categoryTitle: '',
        categorySlug: '',
        seriesTitle: '',
        seriesSlug: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.sellingPrice,
                p.discount,
                p.summary,
                COALESCE(ct.title, '') AS categoryTitle,
                COALESCE(ct.slug, '') AS categorySlug,
                COALESCE(s.title, '') AS seriesTitle,
                COALESCE(s.slug, '') AS seriesSlug,
                COALESCE(pi.id, '') AS productImageId,
                COALESCE(pi.source, '') AS productImageSource
            FROM products p
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
            WHERE p.categories = (SELECT ps.categories FROM products ps WHERE ps.id = {:id})
            OR p.series = (SELECT ps.series FROM products ps WHERE ps.id = {:id})
            OR EXISTS (
                    SELECT 1 
                    FROM json_each((SELECT ps.tags FROM products ps WHERE ps.id = {:id})) t
                    WHERE p.tags LIKE '%' || t.value || '%'
                )
            AND p.inStock = 1
            AND p.id != {:id}
            ORDER BY p.priority DESC 
            LIMIT 8
        `)
        .bind({
            "id": productId,
        })
        .all(suggestedProducts)

    return c.json(200, {
        suggestedProducts
    })
})

routerAdd("GET", "/api/invoice-products/{id}", (c) => {
    const invoiceId = c.request.pathValue("id");

    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError();

    const invoiceProducts = arrayOf(new DynamicModel({
        id: '',
        title: '',
        slug: '',
        amount: '',
        sellingPrice: '',
        discount: '',
        productImageId: '',
        productImageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                p.id,
                ip.amount,
                p.title,
                p.slug, 
                ip.sellingPrice ,
                ip.discount,
                COALESCE(pi.id, '') AS productImageId,
                COALESCE(pi.source, '') AS productImageSource
            FROM invoiceProducts ip 
            JOIN invoices i ON ip.invoices = i.id
            JOIN products p ON p.id =ip.products 
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            WHERE i.users = {:userId} 
            AND ip.invoices = {:invoiceId}
            ORDER BY p.id DESC
        `)
        .bind({
            "userId": userId,
            "invoiceId": invoiceId
        })
        .all(invoiceProducts)

    return c.json(200, {
        invoiceProducts
    })
})

routerAdd("GET", "/api/wishlist", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError();

    const wishedProducts = arrayOf(new DynamicModel({
        id: '',
        title: '',
        tagLine: '',
        slug: '',
        sellingPrice: '',
        discount: '',
        summary: '',
        productImageId: '',
        productImageSource: '',
        categoryTitle: '',
        categorySlug: '',
        seriesTitle: '',
        seriesSlug: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.sellingPrice,
                p.discount,
                p.summary,
                COALESCE(ct.title, '') AS categoryTitle,
                COALESCE(ct.slug, '') AS categorySlug,
                COALESCE(s.title, '') AS seriesTitle,
                COALESCE(s.slug, '') AS seriesSlug,
                COALESCE(pi.id, '') AS productImageId,
                COALESCE(pi.source, '') AS productImageSource
            FROM wishlists w
            JOIN products p ON w.products = p.id
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
            WHERE w.users = {:id}
            ORDER BY w.created DESC
        `)
        .bind({
            "id": userId,
        })
        .all(wishedProducts)

    return c.json(200, {
        wishedProducts
    })
})

routerAdd("POST", "/api/wishlist", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { productId } = c.requestInfo().body
    if (!productId) throw ForbiddenError()

    // check if wishlist exists
    const wishedProducts = arrayOf(new DynamicModel({
        id: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                w.id
            FROM wishlists w
            WHERE w.users = {:userId}
            AND w.products = {:productId}
        `)
        .bind({
            "productId": productId,
            "userId": userId
        })
        .all(wishedProducts)

    let added = false;

    $app.runInTransaction((txDao) => {
        if (wishedProducts.length > 0) {
            // if exists delete
            const record = txDao.findRecordById("wishlists", wishedProducts[0].id)
            txDao.delete(record)
        } else {
            // if does not exist add
            const collection = txDao.findCollectionByNameOrId("wishlists")
            const record = new Record(collection)
            record.set("products", productId)
            record.set("users", userId)
            txDao.save(record)
            added = true
        }
    })

    return c.json(200, {
        added: added ? 1 : 0
    })
})

routerAdd("GET", "/api/cart", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError();

    const cartProducts = arrayOf(new DynamicModel({
        id: '',
        title: '',
        slug: '',
        amount: '',
        sellingPrice: '',
        discount: '',
        cartId: '',
        productImageId: '',
        productImageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                p.id,
                c.amount,
                p.title,
                p.slug, 
                p.sellingPrice,
                p.discount,
                c.id AS cartId,
                COALESCE(pi.id, '') AS productImageId,
                COALESCE(pi.source, '') AS productImageSource
            FROM carts c 
            JOIN products p ON p.id = c.products 
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            WHERE c.users = {:id}
            AND p.inStock = 1
            ORDER BY c.id DESC
        `)
        .bind({
            "id": userId,
        })
        .all(cartProducts)

    return c.json(200, {
        cartProducts
    })
})

routerAdd("POST", "/api/cart", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { productId, amount = 0 } = c.requestInfo().body
    if (!productId) throw ForbiddenError()

    const productInfo = new DynamicModel({
        id: '',
        title: '',
        inStock: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                id,
                title,
                inStock
            FROM products 
            WHERE id = {:id}
        `)
        .bind({
            "id": productId,
        })
        .one(productInfo)

    if (productInfo.inStock != 1) {
        throw ApiError(500, `"${productInfo.title}" is out of stock!`)
    }

    // get cart id and product id list
    const pendingCarts = arrayOf(new DynamicModel({
        cartId: '',
        productId: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                c.id AS cartId,
                c.products AS productId
            FROM carts c 
            WHERE c.users = {:id}
        `)
        .bind({
            "id": userId,
        })
        .all(pendingCarts)

    // check if product exists in cart
    const foundCart = pendingCarts.find(e => e.productId == productId)

    $app.runInTransaction((txDao) => {
        if (amount == 0) {
            // if amount is 0 delete
            const record = txDao.findRecordById("carts", foundCart.cartId)
            txDao.delete(record)
        } else if (foundCart) {
            // if product exists update the data
            const record = txDao.findRecordById("carts", foundCart.cartId)
            record.set("amount", amount)
            txDao.save(record)
        } else {
            // if product does not exist create the data
            const collection = txDao.findCollectionByNameOrId("carts")
            const record = new Record(collection)
            record.set("products", productId)
            record.set("amount", amount)
            record.set("users", userId)
            txDao.save(record)
        }
    })

    return c.json(200, {
        message: "Product added to cart."
    })
})

routerAdd("POST", "/api/cart-checkout", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    let invoiceId = '';

    const { receiverName, contactNo1, contactNo2, receiverNote, receiverPostCode, receiverCity, receiverAddress, shippingCharge, origin } = c.requestInfo().body
    if (!receiverName || !contactNo1 || !receiverAddress || !receiverCity || !receiverPostCode || !origin) throw ForbiddenError()

    const taxFee = 0;
    const status = 'CREATED';
    const ref = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();

    const shippingCost = new DynamicModel({
        shippingCost: ''
    })

    $app.db()
        .newQuery(`
            SELECT shippingCost FROM shippingCharges
            WHERE id = {:id}    
        `)
        .bind({
            "id": shippingCharge
        })
        .one(shippingCost)

    const cartProducts = arrayOf(new DynamicModel({
        cartId: '',
        id: '',
        sellingPrice: '',
        discount: '',
        amount: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                c.id AS cartId,
                p.id,
                p.sellingPrice,
                p.discount,
                c.amount
            FROM carts c 
            JOIN products p ON c.products = p.id
            WHERE c.users = {:id}
            AND p.inStock = 1
        `)
        .bind({
            "id": userId,
        })
        .all(cartProducts)

    const productsFee = cartProducts.map(e => (Number(e.sellingPrice) - Number(e.discount)) * Number(e.amount)).reduce((a, b) => a + b, 0)

    $app.runInTransaction((txDao) => {
        // create invoice
        const invoiceCollection = txDao.findCollectionByNameOrId("invoices")
        const invoiceRecord = new Record(invoiceCollection)
        invoiceRecord.set("ref", ref)
        invoiceRecord.set("users", userId)
        invoiceRecord.set("receiverName", receiverName)
        invoiceRecord.set("contactNo1", contactNo1)
        invoiceRecord.set("contactNo2", contactNo2)
        invoiceRecord.set("receiverNote", receiverNote)
        invoiceRecord.set("receiverPostCode", receiverPostCode)
        invoiceRecord.set("receiverCity", receiverCity)
        invoiceRecord.set("receiverAddress", receiverAddress)
        invoiceRecord.set("productsFee", productsFee)
        invoiceRecord.set("shippingCharge", shippingCharge)
        invoiceRecord.set("taxFee", taxFee)
        invoiceRecord.set("totalFee", (Number(productsFee) + Number(shippingCost.shippingCost) + Number(taxFee)))
        invoiceRecord.set("status", status)
        txDao.save(invoiceRecord)

        // get invoice id by ref
        const invoice = txDao.findFirstRecordByFilter(
            "invoices",
            "ref = {:ref}",
            { "ref": ref },
        )
        invoiceId = invoice.publicExport().id

        // add invoice products
        cartProducts.forEach((product) => {
            const inPrCollection = txDao.findCollectionByNameOrId("invoiceProducts")
            const inPrRecord = new Record(inPrCollection)
            inPrRecord.set("invoices", invoiceId)
            inPrRecord.set("products", product.id)
            inPrRecord.set("sellingPrice", Number(product.sellingPrice))
            inPrRecord.set("discount", Number(product.discount))
            inPrRecord.set("amount", Number(product.amount))
            txDao.save(inPrRecord)
        })

        // remove products from cart
        cartProducts.forEach((product) => {
            const cartRecord = txDao.findRecordById("carts", product.cartId)
            txDao.delete(cartRecord)
        })
    })

    const invoiceData = new DynamicModel({
        name: '',
        email: '',
        receiverName: '',
        contactNo1: '',
        contactNo2: '',
        receiverPostCode: '',
        receiverCity: '',
        receiverAddress: '',
        shippingCost: '',
        taxFee: '',
        totalFee: '',
        ref: '',
        created: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                u.name ,
                u.email,
                i.receiverName,
                i.contactNo1,
                i.contactNo2,
                i.receiverPostCode,
                i.receiverCity,
                i.receiverAddress,
                s.shippingCost,
                i.taxFee,
                i.totalFee,
                i.ref,
                strftime('%d-%m-%Y %I:%M%p', i.created) AS created
            FROM invoices i 
            JOIN shippingCharges s ON i.shippingCharge = s.id
            JOIN users u ON i.users = u.id
            WHERE i.id = {:invoiceId}
        `)
        .bind({
            invoiceId
        })
        .one(invoiceData)

    const invoiceProductData = arrayOf(new DynamicModel({
        title: '',
        slug: '',
        amount: '',
        unitPrice: '',
        totalPrice: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                p.title ,
                p.slug,
                ip.amount ,
                (ip.sellingPrice - ip.discount) AS unitPrice,
                ((ip.sellingPrice - ip.discount) * ip.amount) AS totalPrice
            FROM invoiceProducts ip 
            JOIN products p ON ip.products = p.id 
            WHERE ip.invoices = {:invoiceId}    
        `)
        .bind({
            invoiceId
        })
        .all(invoiceProductData)

    const html = $template.loadFiles(
        `${__hooks}/views/order-receipt.html`
    ).render({
        ...invoiceData,
        origin,
        products: invoiceProductData.map((e, i) => {
            return {
                index: i + 1,
                title: e.title,
                slug: e.slug,
                amount: e.amount,
                unitPrice: e.unitPrice,
                totalPrice: e.totalPrice
            }
        })
    })

    const message = new MailerMessage({
        from: {
            address: $app.settings().meta.senderAddress,
            name: $app.settings().meta.senderName,
        },
        to: [{ address: invoiceData.email }],
        subject: "QRIO - Order Approved",
        html: html
    })

    try {
        $app.newMailClient().send(message)
    } catch (err) { }

    return c.json(200, {
        ref: ref
    })
})

routerAdd("POST", "/api/product-checkout", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    let invoiceId = '';

    const { productId, productAmount, receiverName, contactNo1, contactNo2, receiverNote, receiverPostCode, receiverCity, receiverAddress, shippingCharge } = c.requestInfo().body
    if ( !productId || productAmount <= 0 ||!receiverName || !contactNo1 || !receiverAddress || !receiverCity || !receiverPostCode) throw ForbiddenError()

    const taxFee = 0;
    const status = 'CREATED';
    const ref = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();

    const shippingCost = new DynamicModel({
        shippingCost: ''
    })

    $app.db()
        .newQuery(`
            SELECT shippingCost FROM shippingCharges
            WHERE id = {:id}    
        `)
        .bind({
            "id": shippingCharge
        })
        .one(shippingCost)

    const cartProduct = new DynamicModel({
        id: '',
        sellingPrice: '',
        discount: '',
        amount: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                p.id,
                p.sellingPrice,
                p.discount,
                {:productAmount} AS amount
            FROM products p 
            WHERE p.id = {:productId}
            AND p.inStock = 1
        `)
        .bind({
            "productId": productId,
            "productAmount": productAmount
        })
        .one(cartProduct)

    const productsFee = (Number(cartProduct.sellingPrice) - Number(cartProduct.discount)) * Number(cartProduct.amount)

    $app.runInTransaction((txDao) => {
        // create invoice
        const invoiceCollection = txDao.findCollectionByNameOrId("invoices")
        const invoiceRecord = new Record(invoiceCollection)
        invoiceRecord.set("ref", ref)
        invoiceRecord.set("users", userId)
        invoiceRecord.set("receiverName", receiverName)
        invoiceRecord.set("contactNo1", contactNo1)
        invoiceRecord.set("contactNo2", contactNo2)
        invoiceRecord.set("receiverNote", receiverNote)
        invoiceRecord.set("receiverPostCode", receiverPostCode)
        invoiceRecord.set("receiverCity", receiverCity)
        invoiceRecord.set("receiverAddress", receiverAddress)
        invoiceRecord.set("productsFee", productsFee)
        invoiceRecord.set("shippingCharge", shippingCharge)
        invoiceRecord.set("taxFee", taxFee)
        invoiceRecord.set("totalFee", (Number(productsFee) + Number(shippingCost.shippingCost) + Number(taxFee)))
        invoiceRecord.set("status", status)
        txDao.save(invoiceRecord)

        // get invoice id by ref
        const invoice = txDao.findFirstRecordByFilter(
            "invoices",
            "ref = {:ref}",
            { "ref": ref },
        )
        invoiceId = invoice.publicExport().id

        // add invoice products
        const inPrCollection = txDao.findCollectionByNameOrId("invoiceProducts")
        const inPrRecord = new Record(inPrCollection)
        inPrRecord.set("invoices", invoiceId)
        inPrRecord.set("products", cartProduct.id)
        inPrRecord.set("sellingPrice", Number(cartProduct.sellingPrice))
        inPrRecord.set("discount", Number(cartProduct.discount))
        inPrRecord.set("amount", Number(cartProduct.amount))
        txDao.save(inPrRecord)
    })

    const invoiceData = new DynamicModel({
        name: '',
        email: '',
        receiverName: '',
        contactNo1: '',
        contactNo2: '',
        receiverPostCode: '',
        receiverCity: '',
        receiverAddress: '',
        shippingCost: '',
        taxFee: '',
        totalFee: '',
        ref: '',
        created: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                u.name ,
                u.email,
                i.receiverName,
                i.contactNo1,
                i.contactNo2,
                i.receiverPostCode,
                i.receiverCity,
                i.receiverAddress,
                s.shippingCost,
                i.taxFee,
                i.totalFee,
                i.ref,
                strftime('%d-%m-%Y %I:%M%p', i.created) AS created
            FROM invoices i 
            JOIN shippingCharges s ON i.shippingCharge = s.id
            JOIN users u ON i.users = u.id
            WHERE i.id = {:invoiceId}
        `)
        .bind({
            invoiceId
        })
        .one(invoiceData)

    const invoiceProductData = arrayOf(new DynamicModel({
        title: '',
        amount: '',
        unitPrice: '',
        totalPrice: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                p.title ,
                ip.amount ,
                (ip.sellingPrice - ip.discount) AS unitPrice,
                ((ip.sellingPrice - ip.discount) * ip.amount) AS totalPrice
            FROM invoiceProducts ip 
            JOIN products p ON ip.products = p.id 
            WHERE ip.invoices = {:invoiceId}    
        `)
        .bind({
            invoiceId
        })
        .all(invoiceProductData)

    const html = $template.loadFiles(
        `${__hooks}/views/order-receipt.html`
    ).render({
        ...invoiceData,
        products: invoiceProductData.map((e, i) => {
            return {
                index: i + 1,
                title: e.title,
                amount: e.amount,
                unitPrice: e.unitPrice,
                totalPrice: e.totalPrice
            }
        })
    })

    const message = new MailerMessage({
        from: {
            address: $app.settings().meta.senderAddress,
            name: $app.settings().meta.senderName,
        },
        to: [{ address: invoiceData.email }],
        cc: [{address: "qrio.office@gmail.com"}],
        subject: "QRIO - Order Approved",
        html: html
    })

    try {
        $app.newMailClient().send(message)
    } catch (err) { }

    return c.json(200, {
        ref: ref
    })
})

routerAdd("POST", "/api/order-cancel", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { invoiceId } = c.requestInfo().body
    if (!invoiceId) throw ForbiddenError()

    $app.runInTransaction((txDao) => {
        const invoiceRecord = txDao.findRecordById("invoices", invoiceId)
        if (invoiceRecord.publicExport().users != userId) throw ForbiddenError()
        if (invoiceRecord.publicExport().status != "CREATED") throw ForbiddenError()
        invoiceRecord.set("status", "CANCELLED")
        txDao.save(invoiceRecord)
    })

    return c.json(200)
})

routerAdd("POST", "/api/query", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    const { question, contactNo, productId } = c.requestInfo().body
    if (!productId || !question) throw ForbiddenError()

    const collection = $app.findCollectionByNameOrId("queries")
    const record = new Record(collection)
    record.set("question", question)
    record.set("contactNo", contactNo)
    record.set("users", userId)
    record.set("products", productId)
    $app.save(record)

    return c.json(200)
})

routerAdd("GET", "/api/filter-fields", (c) => {
    const seriesList = arrayOf(new DynamicModel({
        id: '',
        title: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                s.id,
                s.title
            FROM series s
            ORDER BY s.title ASC
        `)
        .all(seriesList)

    const categoryList = arrayOf(new DynamicModel({
        id: '',
        title: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                c.id,
                c.title
            FROM categories c
            ORDER BY c.title ASC
        `)
        .all(categoryList)

    return c.json(200, {
        seriesList,
        categoryList
    })
})

routerAdd("GET", "/api/products", (c) => {
    let pageSize = c.request.url.query().get("pageSize");
    let pageNo = c.request.url.query().get("pageNo");
    const seriesId = c.request.url.query().get("seriesId")
    const categoryId = c.request.url.query().get("categoryId")
    const search = c.request.url.query().get("search").split(" ").filter(e => e.trim().length > 0)

    const seriesFilter = seriesId ? `(p.series = "${seriesId}")` : ""
    const categoryFilter = categoryId ? `(p.categories = "${categoryId}")` : ""
    const filters = [seriesFilter, categoryFilter]

    pageSize = Number(pageSize) > 0 ? Number(pageSize) : 20;
    pageNo = Number(pageNo) > 0 ? Number(pageNo) : 1;

    const counted = new DynamicModel({
        totalItems: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE(count(*), 0) AS totalItems
            FROM products p
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
        `)
        .one(counted)

    const totalItems = Number(counted.totalItems)

    const filteredProducts = arrayOf(new DynamicModel({
        id: '',
        title: '',
        tagLine: '',
        slug: '',
        sellingPrice: '',
        discount: '',
        summary: '',
        productImageId: '',
        productImageSource: '',
        categoryTitle: '',
        categorySlug: '',
        seriesTitle: '',
        seriesSlug: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                p.id,
                p.title,
                p.slug,
                p.sellingPrice,
                p.discount,
                p.summary,
                COALESCE(ct.title, '') AS categoryTitle,
                COALESCE(ct.slug, '') AS categorySlug,
                COALESCE(s.title, '') AS seriesTitle,
                COALESCE(s.slug, '') AS seriesSlug,
                COALESCE(pi.id, '') AS productImageId,
                COALESCE(pi.source, '') AS productImageSource,
                (
                    ${search.length == 0 ? 1 : `
                    CASE 
                        ${search.map(e => `
                        WHEN p.title LIKE '%${e.toLowerCase()}%' THEN 10
                        WHEN ct.title LIKE '%${e.toLowerCase()}%' THEN 10
                        WHEN s.title LIKE '%${e.toLowerCase()}%' THEN 10
                        WHEN p.summary LIKE '%${e.toLowerCase()}%' THEN 10
                        WHEN p.tags LIKE '%${e.toLowerCase()}%' THEN 10
                        `).join('')}
                        ELSE 0
                    END
                    `}
                ) AS matchScore
            FROM products p
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
            ${filters.filter(e => e.length > 0).length > 0 ? "WHERE " + filters.filter(e => e.length > 0).join(" AND ") : ""}
            ORDER BY matchScore DESC, p.created DESC
            LIMIT ${Number(pageSize)} OFFSET ${(Number(pageNo) - 1) * Number(pageSize)}
        `)
        .all(filteredProducts)

    return c.json(200, {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems: totalItems,
        hasNext: pageNo < Math.ceil(totalItems / pageSize),
        hasPrev: pageNo > 1,
        items: filteredProducts
    })
})

routerAdd("GET", "/api/blogs", (c) => {
    let pageSize = c.request.url.query().get("pageSize");
    let pageNo = c.request.url.query().get("pageNo");
    const search = c.request.url.query().get("search").split(" ").filter(e => e.trim().length > 0)

    const searchFilter = search.length > 0 ? `( ${search.map(e => `LOWER(b.title) LIKE '%${e.toLowerCase()}%' OR LOWER(b.summary) LIKE '%${e.toLowerCase()}%' OR LOWER(b.content) LIKE '%${e.toLowerCase()}%'`).join(" OR ")} )` : ""
    const filters = [searchFilter]

    pageSize = Number(pageSize) > 0 ? Number(pageSize) : 20;
    pageNo = Number(pageNo) > 0 ? Number(pageNo) : 1;

    const counted = new DynamicModel({
        totalItems: ''
    })

    $app.db()
        .newQuery(`
            SELECT 
                COALESCE(count(*), 0) AS totalItems
            FROM blogs b
            ${filters.filter(e => e.length > 0).length > 0 ? "WHERE " + filters.filter(e => e.length > 0).join(" AND ") : ""}
        `)
        .one(counted)

    const totalItems = Number(counted.totalItems)

    const filteredBlogs = arrayOf(new DynamicModel({
        id: '',
        title: '',
        slug: '',
        category: '',
        publishedAt: '',
        summary: '',
        blogImageId: '',
        blogImageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                b.id,
                b.title,
                b.slug,
                b.category,
                b.publishedAt,
                b.summary,
                COALESCE(i.id, '') AS blogImageId,
                COALESCE(i.source, '') AS blogImageSource
            FROM blogs b
            LEFT JOIN images i ON i.id = b.cover 
            ${filters.filter(e => e.length > 0).length > 0 ? "WHERE " + filters.filter(e => e.length > 0).join(" AND ") : ""}
            ORDER BY b.publishedAt
            LIMIT ${Number(pageSize)} OFFSET ${(Number(pageNo) - 1) * Number(pageSize)}
        `)
        .all(filteredBlogs)

    return c.json(200, {
        pageNo: pageNo,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItems / pageSize),
        totalItems: totalItems,
        hasNext: pageNo < Math.ceil(totalItems / pageSize),
        hasPrev: pageNo > 1,
        items: filteredBlogs
    })
})

routerAdd("GET", "/api/summary", (c) => {
    const admin = c.auth.isSuperuser();
    if (!admin) throw ForbiddenError();

    const seriesList = arrayOf(new DynamicModel({
        id: '',
        title: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                s.id,
                s.title
            FROM series s
            ORDER BY s.title ASC
        `)
        .all(seriesList)

    const categoryList = arrayOf(new DynamicModel({
        id: '',
        title: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                c.id,
                c.title
            FROM categories c
            ORDER BY c.title ASC
        `)
        .all(categoryList)

    const tagList = arrayOf(new DynamicModel({
        tag: ''
    }))

    $app.db()
        .newQuery(`
            SELECT DISTINCT value AS tag
            FROM products, json_each(products.tags)
            WHERE tag IS NOT NULL  
            ORDER BY tag ASC 
        `)
        .all(tagList)

    return c.json(200, {
        seriesList,
        categoryList,
        tagList,
    })
})

routerAdd("POST", "/api/product", (c) => {
    const admin = c.auth.isSuperuser();
    if (!admin) throw ForbiddenError();

    const { 
        title,
        slug,
        buyingPrice,
        sellingPrice,
        discount,
        categories,
        series,
        summary,
        description,
        tags, 
        images,
        priority,
        inStock,
        productVariants 
     } = c.requestInfo().body
     
    if (!title || !slug || !buyingPrice || !sellingPrice || !categories || !series || !summary || !description) throw new BadRequestError("Some values are missing!");

    function isNullOrEmptyOrArray(value) {
        return (
            value === null || 
            value === undefined ||
            (typeof value === "string" && value.trim() === "") || 
            (Array.isArray(value)) 
        );
    }

    // check if tags, images, productVariants is of list type
    if(!isNullOrEmptyOrArray(tags) || !isNullOrEmptyOrArray(images) || !isNullOrEmptyOrArray(productVariants)) throw new BadRequestError("Some values are missing!");

    $app.runInTransaction((txDao) => {
        const collection = txDao.findCollectionByNameOrId("products")
        const record = new Record(collection)
        record.set("title", title);
        record.set("slug", slug);
        record.set("buyingPrice", buyingPrice);
        record.set("sellingPrice", sellingPrice);
        record.set("discount", discount);
        record.set("categories", categories);
        record.set("series", series);
        record.set("summary", summary);
        record.set("description", description);
        record.set("tags", tags);
        record.set("images", images);
        record.set("priority", priority);
        record.set("inStock", inStock);
        txDao.save(record)
        const productId = record.get("id")

        const pvCollection = txDao.findCollectionByNameOrId("productVariants")
        productVariants.forEach(v => {
            const pvRecord = new Record(pvCollection)
            pvRecord.set("title", v)
            pvRecord.set("products", productId)
            txDao.save(pvRecord)
        })
    })

    return c.json(200)
})

routerAdd("PUT", "/api/product", (c) => {
    const admin = c.auth.isSuperuser();
    if (!admin) throw ForbiddenError();

    const { 
        id,
        title,
        slug,
        buyingPrice,
        sellingPrice,
        discount,
        categories,
        series,
        summary,
        description,
        tags, 
        images,
        priority,
        inStock,
        productVariants 
     } = c.requestInfo().body
     
    if (!id || !title || !slug || !buyingPrice || !sellingPrice || !categories || !series || !summary || !description) throw new BadRequestError("Some values are missing!");

    function isNullOrEmptyOrArray(value) {
        return (
            value === null || 
            value === undefined ||
            (typeof value === "string" && value.trim() === "") || 
            (Array.isArray(value)) 
        );
    }

    // check if tags, images, productVariants is of list type
    if(!isNullOrEmptyOrArray(tags) || !isNullOrEmptyOrArray(images) || !isNullOrEmptyOrArray(productVariants)) throw new BadRequestError("Some values are missing!");

    const productVariantData = arrayOf(new DynamicModel({
        id: '',
        title: ''
    }))

    $app.db()
        .newQuery(`
            SELECT p.id, p.title
            FROM productVariants p 
            WHERE p.products = {:id}   
        `)
        .bind({
            id
        })
        .all(productVariantData)

    const existingProductVariants = productVariantData.map(el => el.title)
        
    $app.runInTransaction((txDao) => {
        const record = txDao.findRecordById("products", id)
        if(!record) throw new BadRequestError("Product id isincorrect!")
        record.set("title", title);
        record.set("slug", slug);
        record.set("buyingPrice", buyingPrice);
        record.set("sellingPrice", sellingPrice);
        record.set("discount", discount);
        record.set("categories", categories);
        record.set("series", series);
        record.set("summary", summary);
        record.set("description", description);
        record.set("tags", tags);
        record.set("images", images);
        record.set("priority", priority);
        record.set("inStock", inStock);
        txDao.save(record)

        const pvCollection = txDao.findCollectionByNameOrId("productVariants")
        // find existing titles and filter it out and delete if not exist
        productVariants.filter(el => !existingProductVariants.includes(el)).forEach(v => {
            const pvRecord = new Record(pvCollection)
            pvRecord.set("title", v)
            pvRecord.set("products", id)
            txDao.save(pvRecord)
        })

        productVariantData.filter(el => !productVariants.includes(el.title)).forEach(v => {
            const pvRecord = txDao.findRecordById("productVariants", v.id)
            txDao.delete(pvRecord)
        })
    })

    return c.json(200)
})