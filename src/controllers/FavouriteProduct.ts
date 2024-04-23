import { decodeBearerToken } from "../utils";
import { ActionResponse, GetListResponse } from "../types";
import { CreateCommentPayload } from "../types/Comment";
import { FavouriteProduct } from "../entities/FavouriteProduct";

const addToFavouriteProduct = async (
  req: CreateCommentPayload,
  res: ActionResponse
) => {
  const authorizationHeader = req.headers.authorization;
  const userInfo = await decodeBearerToken(authorizationHeader);
  const userId = userInfo.userId;
  const { productId } = req.params;
  try {
    const findedProducts = await FavouriteProduct.findOne({ user: userId });

    //Just add a new
    if (!!findedProducts) {
      await findedProducts.update({
        $set: {
          products: [...findedProducts.products, productId],
        },
      });
      return res.status(200).json({
        success: true,
        message: "Thêm sản phẩm vào mục yêu thích thành công",
        code: 200,
      });
    } else {
      const newFavouriteProducts = new FavouriteProduct({
        user: userId,
        products: [productId],
      });
      await newFavouriteProducts.save();
      return res.status(200).json({
        success: true,
        message: "Thêm sản phẩm vào mục yêu thích thành công",
        code: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: "Thêm sản phẩm vào mục yêu thích thật bại",
      code: 500,
    });
  }
};

const getFavouriteProduct = async (
  req: CreateCommentPayload,
  res: GetListResponse<any>
) => {
  const authorizationHeader = req.headers.authorization;
  const userInfo = await decodeBearerToken(authorizationHeader);
  const userId = userInfo.userId;
  try {
    const findedProducts = await FavouriteProduct.find({
      user: userId,
    }).populate("products", "name category thumbnail price");
    const totalCountes = await FavouriteProduct.find({
      user: userId,
    }).countDocuments();
    return res.status(200).json({
      success: true,
      results: findedProducts,
      totalRecords: totalCountes,
      code: 200,
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      results: [],
      totalRecords: 0,
      code: 500,
    });
  }
};

const removeFromFavouriteProduct = async (
  req: CreateCommentPayload,
  res: ActionResponse
) => {
  const authorizationHeader = req.headers.authorization;
  const userInfo = await decodeBearerToken(authorizationHeader);
  const { productId } = req.params;

  try {
    const findedProducts = await FavouriteProduct.findOne({
      user: userInfo.userId,
    });

    if (findedProducts) {
      if (findedProducts.products.includes(productId)) {
        // Remove product from favourites
        await findedProducts.update({
          $pull: {
            products: productId,
          },
        });
        return res.status(200).json({
          success: true,
          message: "Xóa sản phẩm khỏi mục yêu thích thành công",
          code: 200,
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "Sản phẩm không tồn tại trong mục yêu thích",
          code: 404,
        });
      }
    } else {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy danh sách sản phẩm yêu thích của người dùng",
        code: 404,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Xóa sản phẩm khỏi mục yêu thích thất bại",
      code: 500,
    });
  }
};

export {
  addToFavouriteProduct,
  removeFromFavouriteProduct,
  getFavouriteProduct,
};
