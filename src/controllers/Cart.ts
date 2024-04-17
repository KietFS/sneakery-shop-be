import {
  ActionResponse,
  GetListResponse,
  GetOneResponse,
  ICartResponse,
} from "../types";
import express, { IRoute } from "express";
import { Cart, ICart } from "../entities/Cart";
import { CreateCartPayload } from "../types";
import jsonwebToken from "jsonwebtoken";
import { decodeBearerToken } from "../utils";
import { Product } from "../entities/Product";

const getCarts = async (
  req: express.Request,
  res: GetListResponse<ICartResponse>
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(" ")?.[1];
    const decodedInfo = await jsonwebToken.decode(token, {
      complete: true,
    });
    const userInfo = decodedInfo?.payload as any;
    const totalRecords = await Cart.countDocuments();
    let carts = await Cart.find({ userId: userInfo?.userId }).populate({
      path: "productId", // Đảm bảo đây là tên trường trong Cart schema bạn muốn populate
      select: "name thumbnail", // Chỉ select trường price từ Product
    });
    // Map qua mỗi cart và tính toán giá trị price mới
    return res.json({
      success: true,
      results: carts || [],
      totalRecords: totalRecords,
      code: 200,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ code: 500, success: false, totalRecords: 0, results: [] });
  }
};

const getCartDetail = async (
  req: express.Request,
  res: GetOneResponse<ICart>
) => {
  try {
    const { cartId } = req.params;
    const findedCart = await Cart.findOne({
      _id: cartId,
    });
    if (findedCart) {
      return res
        ?.status(200)
        .json({ code: 200, results: findedCart, success: true });
    }
  } catch (error) {
    return res?.status(500)?.json({ code: 500, results: null, success: false });
  }
};

//a create product API to use for admin
const createCart = async (req: CreateCartPayload, res: ActionResponse) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(" ")?.[1];
    const decodedInfo = await jsonwebToken.decode(token, { complete: true });
    const userInfo = decodedInfo?.payload as any;
    const { quantity, productId, size } = req.body;
    const findedProduct = (await Product.findById(productId)).populate({
      path: "productId", // Đảm bảo đây là tên trường trong Cart schema bạn muốn populate
      select: "price", // Chỉ select trường price từ Product
    });
    const cart = new Cart({
      quantity: quantity,
      productId: productId,
      userId: userInfo.userId,
      size: size,
      price: findedProduct?.price * quantity,
    });

    await cart.save();
    return res
      .status(200)
      .json({ success: true, message: "Create cart succces", code: 200 });
  } catch (error) {
    console.log("Internal Create Cart Errors", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};

const removeCartItem = async (req: express.Request, res: ActionResponse) => {
  const { cartId } = req.params;
  const userInfo = await decodeBearerToken(req.headers.authorization);
  const cart = await Cart.findOne({ _id: cartId });
  if (!!cart && cart.userId == userInfo?.userId) {
    try {
      await Cart.remove({ _id: cartId as string });
      return res.status(200).json({
        success: true,
        message: "Xóa item khỏi giỏ hàng thành công",
        code: 200,
      });
    } catch (error) {
      console.log("REMOVE ERROR", error);
      return res.status(500).json({
        success: false,
        message: "Server gặp lỗi",
        code: 500,
      });
    }
  } else {
    console.log("REMOVE ERROR KEIT");
    return res.status(400).json({
      success: false,
      message: "Không tìm thấy item trong đơn hàng",
      code: 400,
    });
  }
};

export { createCart, getCartDetail, getCarts, removeCartItem };
