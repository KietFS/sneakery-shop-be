import {
    ActionResponse,
    CreateOrderPayload,
    GetListResponse,
    GetOneResponse,
  } from "../types";
  import { IOrder, Order } from "../entities/Order";
  import { decodeBearerToken } from "../utils";
  import express from "express"
  
  //create order (check out functions)
  const createOrder = async (req: CreateOrderPayload, res: ActionResponse) => {
    try {
      const authorizationHeader = req.headers.authorization;
      const userInfo = await decodeBearerToken(authorizationHeader);
      const { cartId, address } = req.body;
      const order = new Order({
        cartId: cartId,
        userId: userInfo.userId,
        address: address,
        status: "received",
      });
      await order.save();
      return res
        .status(200)
        .json({ success: true, message: "Tạo order thành công", code: 200 });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server gặp lỗi khi cố tạo đơn hàng",
        code: 500,
      });
    }
  };
  
  const getOrderByUser = async (  req: express.Request,
    res: GetListResponse<IOrder>) => {
      try {
        const authorizationHeader = req.headers.authorization;
        const userInfo = await decodeBearerToken(authorizationHeader);
        const findedOrder = await Order.find({userId: userInfo?.userId as string}).populate({
          path: "userId", // Đảm bảo đây là tên trường trong Cart schema bạn muốn populate
          select: "phoneNumber name", // Chỉ select trường price từ Product
        })
        const totalRecords = await Order.countDocuments()
        return res
        ?.status(200)
        .json({ code: 200, results: findedOrder, totalRecords: totalRecords, success: true });
      } catch (error) {
        return res.status(500).json({
          success: false,
          results: [],
          totalRecords: 0,
          code: 500,
        });
      }
  }
  
  export { createOrder, getOrderByUser };
  