const Product = require('../models/Product')

module.exports = class ProductController {
    static async showProducts(req, res) {
        const products = await Product.getProducts();

        res.render('products/all', { products })
    }

    static createProduct(req, res) {
        res.render('products/create')
    }

    static createProductPost(req, res) {
        const product = new Product(req.body.name, req.body.image, req.body.price, req.body.description)

        product.save()

        res.redirect('/products')
    }

    static async getProduct(req, res) {
        const product = await Product.getProductById(req.params.id)

        res.render('products/product', { product })
    }

    static async editProduct(req, res) {
        const product = await Product.getProductById(req.params.id)

        res.render('products/edit', { product })
    }

    static async updateProduct(req, res) {
        const product = new Product(
            req.body.name,
            req.body.image,
            req.body.price,
            req.body.description
        )

        await product.updateProduct(req.body.id)

        res.redirect('/')
    }

    static async deleteProduct(req, res) {
        await Product.deleteProductById(req.params.id)

        res.redirect('/')
    }
}