import {
  ActionResponse,
  CreateOrderPayload,
  GetListResponse,
  GetOneResponse,
  RateOrderPayload,
  UpdateStatusOrderPayload,
} from "../types";
import { IOrder, Order } from "../entities/Order";
import { decodeBearerToken, sendNoti } from "../utils";
import express from "express";
import { Cart, ICart } from "../entities/Cart";
import { User } from "../entities/User";

//create order (check out functions)
const createOrder = async (req: CreateOrderPayload, res: ActionResponse) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const userInfo = await decodeBearerToken(authorizationHeader);

    const { cartId, address, rewardPoints } = req.body;

    if (rewardPoints > 0) {
      await User.findOneAndUpdate(
        { _id: userInfo?.userId },
        { $inc: { rewardPoints: 0 - rewardPoints } }
      );
    }

    const newOrder = new Order({
      userId: userInfo?.userId,
      items: [],
      status: "new",
      paymentType: "cod",
      totalPrice: 0 - (rewardPoints || 0),
    });

    //SAVE ORDER
    for (const cartItemData of cartId) {
      const cartItem: ICart = await Cart.findById(cartItemData);

      if (cartItem?.isVisible) {
        newOrder.items.push(cartItem._id);
        newOrder.totalPrice += cartItem?.price;
      }
    }
    try {
      await newOrder.save();
    } catch (error) {
      console.log("SAVE ORDER ERROR", error);
    }
    for (const cartItemId of cartId) {
      // await updateProductQuantity(req, res);
      await Cart.findByIdAndUpdate(cartItemId, {
        $set: {
          isVisible: false,
        },
      });
    }
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

//create order (check out functions)
const cancelOrder = async (req: CreateOrderPayload, res: ActionResponse) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const userInfo = await decodeBearerToken(authorizationHeader);
    const { orderId } = req.params;

    const findedOrder = await Order.findOne({ _id: orderId });

    if (!!findedOrder) {
      await findedOrder.update({
        $set: {
          status: "canceled",
        },
      });
      return res
        .status(200)
        .json({ success: true, message: "Hủy đơn hàng thành công", code: 200 });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Order is not existed", code: 404 });
    }
  } catch {}
};

const getOrderByUser = async (
  req: express.Request,
  res: GetListResponse<IOrder>
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const userInfo = await decodeBearerToken(authorizationHeader);
    const findedOrder = await Order.find({
      userId: userInfo?.userId as string,
    }).populate({
      path: "userId",
      select: "phoneNumber username address",
    });

    const totalRecords = await Order.countDocuments();
    return res?.status(200).json({
      code: 200,
      results: findedOrder,
      totalRecords: totalRecords,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      results: [],
      totalRecords: 0,
      code: 500,
    });
  }
};

const getOrderDetail = async (
  req: express.Request,
  res: GetOneResponse<IOrder>
) => {
  try {
    const { orderId } = req.params;
    const findedOrder = await Order.findOne({
      _id: orderId,
    }).populate({
      path: "userId", // Đảm bảo đây là tên trường trong Cart schema bạn muốn populate
      select: "phoneNumber username address", // Chỉ select trường price từ Product
    });
    if (findedOrder) {
      return res
        ?.status(200)
        .json({ code: 200, results: findedOrder, success: true });
    }
  } catch (error) {
    return res?.status(500)?.json({ code: 500, results: null, success: false });
  }
};

const getAllOrder = async (
  req: express.Request,
  res: GetListResponse<IOrder>
) => {
  try {
    const findedOrder = await Order.find().populate({
      path: "userId",
      select: "phoneNumber username address",
    });

    const totalRecords = await Order.countDocuments();
    return res?.status(200).json({
      code: 200,
      results: findedOrder,
      totalRecords: totalRecords,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      results: [],
      totalRecords: 0,
      code: 500,
    });
  }
};

const changeStatusOrder = async (
  req: UpdateStatusOrderPayload,
  res: ActionResponse
) => {
  const { orderId } = req.params;

  try {
    const findedOrder = await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { status: req.body.status } }
    ).populate({
      path: "userId",
      select: "deviceId",
    });

    const temp = await Order.findOne({ _id: orderId }).populate({
      path: "userId",
      select: "deviceId",
    });

    const title = {
      new: "Đơn hàng của bạn đã được tạo mới.",
      received: "Chúng tôi đã nhận được đơn hàng của bạn",
      processing: "Chúng tôi đang xử lý đơn hàng của bạn",
      shipping: "Chúng tôi đang giao đơn hàng của bạn",
      finished: "Đơn hàng đã được giao đến tay bạn !",
      canceled: "Đơn hàng của bạn đã bị hủy",
    };

    const descriptions = {
      new: "Hãy vui lòng đợi chúng tôi xử lý đơn hàng của bạn",
      received: "Hãy vui lòng đợi chúng tôi xử lý đơn hàng của bạn",
      processing: "Hãy vui lòng đợi chúng tôi xử lý đơn hàng của bạn",
      shipping: "Hãy vui lòng đợi chúng tôi xử lý đơn hàng của bạn",
      finished: "Hãy vui lòng đợi chúng tôi xử lý đơn hàng của bạn",
      canceled:
        "Đơn hàng này đã bị hủy, vui lòng quay trở lại để tiếp tục mua sắm",
    };

    if (!!findedOrder) {
      await sendNoti((temp.userId as any)?.deviceId, {
        body: `${descriptions[req.body.status]} - Mã đơn hàng ${findedOrder?._id}`,
        title: `${title[req.body.status]}`,
        subtitle: ``,
      });
      return res?.status(200).json({
        code: 200,
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công",
      });
    } else {
      return res?.status(404).json({
        code: 404,
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }
  } catch (error) {
    return res?.status(200).json({
      code: 200,
      success: true,
      message: "Cập nhật đơn hàng thất bại, lỗi từ server",
    });
  }
};

const deleteOrder = async (req: express.Request, res: ActionResponse) => {
  const { orderId } = req.params;
  try {
    const findedOrder = await Order.findOneAndDelete({ _id: orderId });
    if (!!findedOrder) {
      return res.status(200).json({
        code: 200,
        success: true,
        message: "Xóa đơn hàng thành công",
      });
    } else {
      return res.status(404).json({
        code: 404,
        success: false,
        message: "Không tìm thấy đơn hàng",
      });
    }
  } catch (error) {
    return res.status(500).json({
      code: 500,
      success: false,
      message: "Xóa đơn hàng thất bại",
    });
  }
};

const rateOrder = async (req: RateOrderPayload, res: ActionResponse) => {
  const { orderId } = req.params;
  const rate = req.body.rate;
  try {
    const authorizationHeader = req.headers.authorization;
    const userInfo = await decodeBearerToken(authorizationHeader);
    const currentOrder = await Order.findOne({ _id: orderId });
    const currentUser = await User.findOne({ _id: userInfo.userId });

    await Order.findOneAndUpdate(
      { _id: orderId },
      {
        $set: {
          rate: Number(rate),
        },
      }
    );
    await User.updateOne(
      { _id: userInfo.userId },
      {
        $set: {
          rewardPoints: Number(
            (
              (currentUser.rewardPoints || 0) +
              currentOrder.totalPrice / 20
            ).toFixed(0)
          ),
        },
      }
    );
    return res.status(200).json({
      code: 200,
      success: true,
      message: "Đánh giá đơn hàng thành công",
    });
  } catch (error) {
    console.log("RATE ORDER EROR", error);
    return res
      .status(500)
      .json({ code: 500, success: false, message: "Internal Server Error" });
  }
};

export {
  createOrder,
  getOrderByUser,
  getOrderDetail,
  cancelOrder,
  getAllOrder,
  changeStatusOrder,
  deleteOrder,
  rateOrder,
};
