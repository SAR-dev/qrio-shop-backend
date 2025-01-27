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
})