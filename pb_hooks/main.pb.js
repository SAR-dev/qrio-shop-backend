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

    const featuredSeries = arrayOf(new DynamicModel({
        seriesId: '',
        seriesTitle: '',
        seriesSlug: '',
        seriesImageId: '',
        seriesImageSource: '',

        product1Price: 0,
        product1ImageId: '',
        product1ImageSource: '',

        product2Price: 0,
        product2ImageId: '',
        product2ImageSource: '',

        product3Price: 0,
        product3ImageId: '',
        product3ImageSource: '',

        product4Price: 0,
        product4ImageId: '',
        product4ImageSource: ''
    }))

    const featuredCategories = arrayOf(new DynamicModel({
        categoryId: '',
        categoryTitle: '',
        categorySlug: '',
        categoryImageId: '',
        categoryImageSource: '',

        productId: '',
        productTitle: '',
        productSlug: '',
        productImageId: '',
        productImageSource: ''
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
        `)
        .all(homepageCarousel)

    $app.db()
        .newQuery(`
            SELECT 
                s.id AS seriesId,
                s.title AS seriesTitle,
                s.slug AS seriesSlug,
                COALESCE(si.id, '') AS seriesImageId,
                COALESCE(si.source, '') AS seriesImageSource,
                p1.sellingPrice - COALESCE(p1.discount, 0) AS product1Price,
                COALESCE(p1i.id, '') AS product1ImageId,
                COALESCE(p1i.source, '') AS product1ImageSource,
                p2.sellingPrice - COALESCE(p2.discount, 0) AS product2Price,
                COALESCE(p2i.id, '') AS product2ImageId,
                COALESCE(p2i.source, '') AS product2ImageSource,
                p3.sellingPrice - COALESCE(p3.discount, 0) AS product3Price,
                COALESCE(p3i.id, '') AS product3ImageId,
                COALESCE(p3i.source, '') AS product3ImageSource,
                p4.sellingPrice - COALESCE(p4.discount, 0) AS product4Price,
                COALESCE(p4i.id, '') AS product4ImageId,
                COALESCE(p4i.source, '') AS product4ImageSource
            FROM featuredSeries fs 
            JOIN series s ON fs.series = s.id 
            LEFT JOIN images si ON si.id = s.cover 
            LEFT JOIN products p1 ON p1.id = fs.product1
            LEFT JOIN images p1i ON p1i.id = REPLACE(p1.images ->> 0, '"', '')
            LEFT JOIN products p2 ON p2.id = fs.product2
            LEFT JOIN images p2i ON p2i.id = REPLACE(p2.images ->> 0, '"', '')
            LEFT JOIN products p3 ON p3.id = fs.product3
            LEFT JOIN images p3i ON p3i.id = REPLACE(p3.images ->> 0, '"', '')
            LEFT JOIN products p4 ON p4.id = fs.product4
            LEFT JOIN images p4i ON p4i.id = REPLACE(p4.images ->> 0, '"', '')    
        `)
        .all(featuredSeries)

    $app.db()
        .newQuery(`
            WITH rankedProducts AS (
                SELECT 
                    p.id AS productId,
                    p.title AS productTitle,
                    p.slug AS productSlug, 
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
                LEFT JOIN images pi ON pi.id = REPLACE(p.images ->> 0, '"', '')
                LEFT JOIN images ci ON ci.id = c.thumbnail
                WHERE p.categories IN (
                    SELECT categories FROM featuredCategories LIMIT 3
                )
            )
            SELECT * FROM rankedProducts
            WHERE rn <= 4     
        `)
        .all(featuredCategories);

    const categories = featuredCategories.map(category => {
        return {
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
            productSlug: product.productSlug,
            productImageId: product.productImageId,
            productImageSource: product.productImageSource
        }]
    })

    return c.json(200, {
        featuredCategories: unqCategories,
        homepageCarousel,
        featuredSeries
    })
})