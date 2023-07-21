const Product = require('../models/Product')

module.exports = class ProductController {
    static async showProducts(req, res) {
        const products = await Product.find().lean()

        res.render('products/all', { products })
    }

    static createProduct(req, res) {
        res.render('products/create')
    }

    static async createProductPost(req, res) {
        const name = req.body.name
        const image = req.body.image
        const price = req.body.price
        const description = req.body.description

        const product = new Product({ name, price, description, image })

        await product.save()

        res.redirect('/products')
    }

    static async getProduct(req, res) {
        const product = await Product.findById(req.params.id).lean()

        res.render('products/product', { product })
    }

    static async editProduct(req, res) {
        const product = await Product.findById(req.params.id).lean()

        res.render('products/edit', { product })
    }

    static async updateProduct(req, res) {
        const name = req.body.name
        const image = req.body.image
        const price = req.body.price
        const description = req.body.description

        const product = { name, price, description, image }

        await Product.updateOne({ _id: req.body.id }, product)

        res.redirect('/')
    }

    static async deleteProduct(req, res) {
        await Product.deleteOne({ _id: req.params.id })

        res.redirect('/')
    }
}