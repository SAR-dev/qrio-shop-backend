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
    let productId = c.request.pathValue("id");

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
        if(wishedProducts.length > 0){
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
        message: added ? "Product added to wishlist." : "Product removed from wishlist."
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
                c.amount,
                p.title,
                p.slug, 
                p.sellingPrice,
                p.discount,
                c.id AS cartId,
                COALESCE(pi.id, '') AS productImageId,
                COALESCE(pi.source, '') AS productImageSource,
                COALESCE(ct.title, '') AS categoryTitle,
                COALESCE(ct.slug, '') AS categorySlug,
                COALESCE(s.title, '') AS seriesTitle,
                COALESCE(s.slug, '') AS seriesSlug
            FROM carts c 
            JOIN products p ON p.id = c.products 
            LEFT JOIN categories ct ON p.categories = c.id
            LEFT JOIN series s ON p.series = s.id
            LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
            WHERE c.users = {:id}
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