import { ActionResponse, GetListResponse, GetOneResponse, RateProductPayload } from "../types";
import { IProduct, Product } from "../entities/Product";
import express, { IRoute } from "express";
import { CreateProductPayload } from "../types";
import { decodeBearerToken } from "../utils";
import { User } from "../entities/User";

//NEED TO UPDATE FILTER FOR SIZE
const getProducts = async (
  req: express.Request,
  res: GetListResponse<IProduct>
) => {
  try {
    const { name, brand, category, page = 1, limit = 10 } = req.query;
    const queryConditions: { [key: string]: any } = {};

    if (brand) {
      queryConditions.brand = brand;
    }

    if (name) {
      queryConditions.name = name;
    }

    // if (size) {
    //   queryConditions.size = size;
    // }

    if (category) {
      queryConditions.category = category;
    }

    const skip =
      (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    const totalRecords = await Product.countDocuments();
    const products = await Product.find(queryConditions)
      .skip(skip)
      .limit(parseInt(limit as string, 10));

    return res.json({
      success: true,
      results: products || [],
      totalRecords: totalRecords,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ code: 500, success: false, totalRecords: 0, results: [] });
  }
};

const updateSizes = async (
  req: express.Request,
  res: GetListResponse<IProduct>
) => {
  try {
    const templateSizes = [
      {
        size: 36,
        quantity: 10,
      },
      {
        size: 37,
        quantity: 10,
      },
      {
        size: 38,
        quantity: 10,
      },
      {
        size: 39,
        quantity: 10,
      },
      {
        size: 40,
        quantity: 10,
      },
      {
        size: 41,
        quantity: 10,
      },
      {
        size: 42,
        quantity: 10,
      },
      {
        size: 43,
        quantity: 10,
      },
      {
        size: 44,
        quantity: 10,
      },
      {
        size: 45,
        quantity: 10,
      },
    ]; // Define your template sizes here
    try {
      await Product.updateMany({}, { $set: { sizes: templateSizes } });
    } catch (error) {
      console.log("UPDATE MANY ERROR", error);
      return res
        .status(500)
        .json({ code: 500, success: false, results: [], totalRecords: 0 });
    }

    return res.status(200).json({
      code: 200,
      success: true,
      totalRecords: 0,
      results: [],
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, success: false, results: [], totalRecords: 0 });
  }
};


const getProductDetail = async (
  req: express.Request,
  res: GetOneResponse<IProduct>
) => {
  try {
    const { productId } = req.params;
    const findedProduct = await Product.findOne({
      _id: productId,
    });
    if (findedProduct) {
      return res
        ?.status(200)
        .json({ code: 200, results: findedProduct, success: true });
    }
  } catch (error) {
    return res?.status(500)?.json({ code: 500, results: null, success: false });
  }
};

//a create product API to use for admin
const createProduct = async (
  req: CreateProductPayload,
  res: ActionResponse
) => {
  try {
    const {
      name,
      category,
      thumbnail,
      price,
      description,
      images,
      brand,
      sizes,
    } = req.body;

    const product = new Product({
      name: name,
      category: category.toLowerCase(),
      thumbnail: thumbnail,
      price: price,
      description: description,
      images: images,
      brand: brand?.toLowerCase(),
      sizes: sizes,
    });

    await product.save();
    return res
      .status(200)
      .json({ success: true, message: "Create product succces", code: 200 });
  } catch (error) {
    console.log("Internal Create Product Error", error);
    return res.status(200).json({
      success: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};

const commentProduct = async (
  req: CreateProductPayload,
  res: ActionResponse
) => {
  try {
    const {
      name,
      category,
      thumbnail,
      price,
      description,
      images,
      brand,
      sizes,
    } = req.body;

    const product = new Product({
      name: name,
      category: category.toLowerCase(),
      thumbnail: thumbnail,
      price: price,
      description: description,
      images: images,
      brand: brand?.toLowerCase(),
      sizes: sizes,
    });

    await product.save();
    return res
      .status(200)
      .json({ success: true, message: "Create product succces", code: 200 });
  } catch (error) {
    console.log("Internal Create Product Error", error);
    return res.status(200).json({
      success: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};

const rateProduct = 
async (
  req: RateProductPayload,
  res: ActionResponse
) => {
  const {productId} = req.params;
  const rate = req.body.rate;
  try {
    const authorizationHeader = req.headers.authorization;
    const userInfo = await decodeBearerToken(authorizationHeader);
    const currentProduct = await Product.findOne({_id: productId});
    const currentUser = await User.findOne({_id: userInfo.userId});

    await Product.findOneAndUpdate({_id: productId}, {$set: {rate: Number((((currentProduct?.rate || 0) + rate)/2).toFixed(1)), totalRate: (currentProduct?.totalRate || 0) + 1}})
    await User.updateOne({_id: userInfo.userId}, {$set: {rewardPoints: Number(((currentUser.rewardPoints || 0) + currentProduct.price / 20).toFixed(0)) }});
    return res.status(200).json({code: 200, success: true, message: "Rate product success"});
  } catch (error) {
    return res.status(500).json({code: 500, success: false, message: "Internal Server Error"});
  }
}

const removeProduct = async (req: express.Request, res: ActionResponse) => {
  const authorizationHeader = req?.headers?.authorization;
  const userInfo = await decodeBearerToken(authorizationHeader);
  if (userInfo?.role !== "admin") {
    return res.status(403).json({ code: 403, success: false, message: "Permission Denied" });
  } else {  try {
    const { productId } = req.params;
    await Product.deleteOne({ _id: productId });
    return res.status(200).json({ code: 200, success: true, message: "Delete product success" });
} catch (error) {
    console.error(error);
    return res.status(500).json({ code: 500, success: false, message: "Internal Server Error" });
  }}

};

const removeManyProducts = async (req: express.Request, res: ActionResponse) => {
  const {productIds} = req.body as any
}

export {
  getProducts,
  createProduct,
  getProductDetail,
  commentProduct,
  updateSizes,
  rateProduct, 
  removeProduct
};
