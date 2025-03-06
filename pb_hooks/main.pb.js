routerAdd("GET", "/api/homepage", (c) => {
    const homepageCarousel = arrayOf(new DynamicModel({
        title1: '',
        title2: '',
        subtitle: '',
        buttonText: '',
        redirectTo: '',
        imageId: '',
        imageSource: ''
    }))

    $app.db()
        .newQuery(`
            SELECT 
                hc.title1,
                hc.title2,
                hc.subtitle,
                hc.buttonText,
                hc.redirectTo,
                COALESCE(i.id, '') AS imageId,
                COALESCE(i.source, '') AS imageSource
            FROM homepageCarousel hc 
            LEFT JOIN images i ON i.id = hc.images 
            ORDER BY hc.priority DESC   
        `)
        .all(homepageCarousel)

    const featuredSeries = arrayOf(new DynamicModel({
        tagLine: '',
        seriesId: '',
        seriesTitle: '',
        seriesSlug: '',
        seriesImageId: '',
        seriesImageSource: '',

        productId: '',
        productTitle: '',
        productSlug: '',
        productPrice: 0,
        productImageId: '',
        productImageSource: ''
    }))

    $app.db()
        .newQuery(`
            WITH rankedProducts AS (
                SELECT 
                    fs.tagLine,
                    p.id AS productId,
                    p.title AS productTitle,
                    p.slug AS productSlug, 
                    (p.sellingPrice - p.discount) AS productPrice,
                    COALESCE(pi.id, '') AS productImageId,
                    COALESCE(pi.source, '') AS productImageSource,
                    s.id AS seriesId,
                    s.title AS seriesTitle,
                    s.slug AS seriesSlug,
                    COALESCE(si.id, '') AS seriesImageId,
                    COALESCE(si.source, '') AS seriesImageSource,
                    ROW_NUMBER() OVER (PARTITION BY p.series ORDER BY p.priority DESC, p.id) AS rn
                FROM products p
                JOIN series s ON p.series = s.id
                JOIN featuredSeries fs ON fs.series = s.id
                LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
                LEFT JOIN images si ON si.id = s.cover
                WHERE p.series IN (
                    SELECT series FROM featuredSeries
                )
                AND p.inStock = 1
            )
            SELECT * FROM rankedProducts
            WHERE rn <= 4   
        `)
        .all(featuredSeries)

    const featuredSeriesProductIds = featuredSeries.map(e => `'${e.productId}'`).join(",")

    const seriesList = featuredSeries.map(series => {
        return {
            tagLine: series.tagLine,
            seriesId: series.seriesId,
            seriesTitle: series.seriesTitle,
            seriesSlug: series.seriesSlug,
            seriesImageId: series.seriesImageId,
            seriesImageSource: series.seriesImageSource
        }
    })

    const unqSeries = Array.from(
        new Map(seriesList.map(obj => [obj.seriesId, { ...obj, products: [] }])).values()
    );

    featuredSeries.forEach((product) => {
        const foundIndex = unqSeries.findIndex(e => e.seriesId == product.seriesId)
        unqSeries[foundIndex].products = [...unqSeries[foundIndex].products, {
            productId: product.productId,
            productTitle: product.productTitle,
            productPrice: product.productPrice,
            productSlug: product.productSlug,
            productImageId: product.productImageId,
            productImageSource: product.productImageSource
        }]
    })

    const featuredCategories = arrayOf(new DynamicModel({
        tagLine: '',
        categoryId: '',
        categoryTitle: '',
        categorySlug: '',
        categoryImageId: '',
        categoryImageSource: '',

        productId: '',
        productTitle: '',
        productSlug: '',
        productPrice: 0,
        productImageId: '',
        productImageSource: ''
    }))

    $app.db()
        .newQuery(`
            WITH rankedProducts AS (
                SELECT 
                    fc.tagLine,
                    p.id AS productId,
                    p.title AS productTitle,
                    p.slug AS productSlug, 
                    (p.sellingPrice - p.discount) AS productPrice,
                    COALESCE(pi.id, '') AS productImageId,
                    COALESCE(pi.source, '') AS productImageSource,
                    c.id AS categoryId,
                    c.title AS categoryTitle,
                    c.slug AS categorySlug,
                    COALESCE(ci.id, '') AS categoryImageId,
                    COALESCE(ci.source, '') AS categoryImageSource,
                    ROW_NUMBER() OVER (PARTITION BY p.categories ORDER BY p.priority DESC, p.id) AS rn
                FROM products p
                JOIN categories c ON p.categories = c.id
                JOIN featuredCategories fc ON fc.categories = c.id
                LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
                LEFT JOIN images ci ON ci.id = c.thumbnail
                WHERE p.categories IN (
                    SELECT categories FROM featuredCategories
                )
                AND p.inStock = 1
                AND p.id NOT IN (${featuredSeriesProductIds})
            )
            SELECT * FROM rankedProducts
            WHERE rn <= 4     
        `)
        .all(featuredCategories);

    const categories = featuredCategories.map(category => {
        return {
            tagLine: category.tagLine,
            categoryId: category.categoryId,
            categoryTitle: category.categoryTitle,
            categorySlug: category.categorySlug,
            categoryImageId: category.categoryImageId,
            categoryImageSource: category.categoryImageSource
        }
    })

    const unqCategories = Array.from(
        new Map(categories.map(obj => [obj.categoryId, { ...obj, products: [] }])).values()
    );

    featuredCategories.forEach((product) => {
        const foundIndex = unqCategories.findIndex(e => e.categoryId == product.categoryId)
        unqCategories[foundIndex].products = [...unqCategories[foundIndex].products, {
            productId: product.productId,
            productTitle: product.productTitle,
            productPrice: product.productPrice,
            productSlug: product.productSlug,
            productImageId: product.productImageId,
            productImageSource: product.productImageSource
        }]
    })

    return c.json(200, {
        featuredCategories: unqCategories,
        featuredSeries: unqSeries,
        homepageCarousel
    })
});

routerAdd("GET", "/api/homepage-products", (c) => {
    const promotedProducts = arrayOf(new DynamicModel({
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
                pp.tagLine,
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
            FROM promotedProducts pp 
            JOIN products p ON pp.products = p.id
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
        `)
        .all(promotedProducts)

    const trendingProducts = arrayOf(new DynamicModel({
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
                COUNT(CASE WHEN c.id IS NOT NULL THEN 1 END) AS counts
            FROM products p
            LEFT JOIN carts c ON p.id = c.products
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
            WHERE p.inStock = 1
            GROUP BY p.id
            ORDER BY counts DESC, p.priority DESC
            LIMIT 8
        `)
        .all(trendingProducts)

    const discountProducts = arrayOf(new DynamicModel({
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
            WHERE p.inStock = 1
            ORDER BY p.discount DESC 
            LIMIT 8
        `)
        .all(discountProducts)

    return c.json(200, {
        trendingProducts,
        discountProducts,
        promotedProducts
    })
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

routerAdd("POST", "/api/checkout", (c) => {
    const userId = c.requestInfo().auth?.id
    if (!userId) throw ForbiddenError()

    let invoiceId = '';

    const { receiverName, contactNo1, contactNo2, receiverNote, receiverAddress } = c.requestInfo().body
    if (!receiverName || (!contactNo1 && !contactNo2) || !receiverAddress) throw ForbiddenError()

    const shippingFee = 100;
    const taxFee = 0;
    const status = 'CREATED';
    const ref = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).toUpperCase();

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
        invoiceRecord.set("receiverAddress", receiverAddress)
        invoiceRecord.set("productsFee", productsFee)
        invoiceRecord.set("shippingFee", shippingFee)
        invoiceRecord.set("taxFee", taxFee)
        invoiceRecord.set("totalFee", (Number(productsFee) + Number(shippingFee) + Number(taxFee)))
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
        receiverAddress: '',
        shippingFee: '',
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
                i.receiverAddress,
                i.shippingFee,
                i.taxFee,
                i.totalFee,
                i.ref,
                strftime('%d-%m-%Y %I:%M%p', i.created) AS created
            FROM invoices i 
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
    const searchFilter = search.length > 0 ? `( ${search.map(e => `LOWER(p.title) LIKE '%${e.toLowerCase()}%' OR LOWER(p.summary) LIKE '%${e.toLowerCase()}%' OR LOWER(p.description) LIKE '%${e.toLowerCase()}%'`).join(" OR ")} )` : ""
    const filters = [seriesFilter, categoryFilter, searchFilter]

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
            ${filters.filter(e => e.length > 0).length > 0 ? "WHERE " + filters.filter(e => e.length > 0).join(" AND ") : ""}
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
                COALESCE(pi.source, '') AS productImageSource
            FROM products p
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            LEFT JOIN categories ct ON p.categories = ct.id 
            LEFT JOIN series s ON p.series = s.id
            ${filters.filter(e => e.length > 0).length > 0 ? "WHERE " + filters.filter(e => e.length > 0).join(" AND ") : ""}
            ORDER BY p.created DESC
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
