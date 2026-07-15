const productService = require("../services/product.service");
const ResponseFormatter = require("../utils/responseFormatter");

exports.getProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    return ResponseFormatter.success(
      res,
      products,
      'Products retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);

    return ResponseFormatter.success(
      res,
      product,
      'Product retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);

    return ResponseFormatter.created(
      res,
      product,
      'Product created successfully'
    );
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.body
    );

    return ResponseFormatter.success(
      res,
      product,
      'Product updated successfully'
    );
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await productService.deleteProduct(req.params.id);

    return ResponseFormatter.success(
      res,
      product,
      'Product deleted successfully'
    );
  } catch (error) {
    next(error);
  }
};
