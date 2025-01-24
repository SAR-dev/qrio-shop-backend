routerAdd("GET", "/api/homepage", (c) => {
    const res = {
        featuredCategories: []
    }
    const featuredCategories = arrayOf(new DynamicModel({
        "id": "",
        "title": "",
        "slug": "",
        "imageId": "",
        "imageSource": ""
    }))

    $app.db()
        .newQuery(`
            SELECT 
                c.id ,
                c.title ,
                c.slug ,
                COALESCE(i.id, '') AS imageId,
                COALESCE(i.source, '') AS imageSource
            FROM featuredCategories fc 
            JOIN categories c ON c.id = fc.categories 
            LEFT JOIN images i ON i.id = c.thumbnail 
            LIMIT 3   
        `)
        .all(featuredCategories);

    featuredCategories.forEach(cat => res.featuredCategories.push({...cat, products: []}))
    
    const products = arrayOf(new DynamicModel({
        "id": "",
        "title": "",
        "slug": "",
        "imageId": "",
        "imageSource": "",
        "categories": ""
    }))

    $app.db()
        .newQuery(`
            WITH rankedProducts AS (
                SELECT 
                    p.id,
                    p.title,
                    p.slug, 
                    p.categories,
                    COALESCE(i.id, '') AS imageId,
                    COALESCE(i.source, '') AS imageSource,
                    ROW_NUMBER() OVER (PARTITION BY p.categories ORDER BY p.priority DESC, p.id) AS rn
                FROM products p
                LEFT JOIN images i ON i.id = REPLACE(p.images ->> 0, '"', '')
                WHERE p.categories IN (
                    ${featuredCategories.map(c => `'${c.id}'`).join(',')}
                )
            )
            SELECT * FROM rankedProducts
            WHERE rn <= 4    
        `)
        .all(products);

    products.forEach((product) => {
        const foundIndex = res.featuredCategories.findIndex(e => e.id == product.categories)
        res.featuredCategories[foundIndex].products = [...res.featuredCategories[foundIndex].products, {...product}]
    })

    return c.json(200, res)
})