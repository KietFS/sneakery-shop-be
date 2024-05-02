import { ActionResponse, GetListResponse, GetOneResponse } from "../types";
import express from "express";
import { Comment, IComment } from "../entities/Comments";
import jsonwebToken from "jsonwebtoken";
import { decodeBearerToken } from "../utils";
import { CreateCommentPayload } from "../types/Comment";
import { Product } from "../entities/Product";

const getComments = async (req: express.Request, res: express.Response) => {
  try {
    const { productId } = req.params;
    const totalRecords = await Comment.countDocuments();
    let comments = await Comment.findOne({ productId: productId }).populate({
      path: "comments.user",
      select: "username email", // assuming you want to fetch name and email from the User collection
    });
    return res.json({
      success: true,
      results: comments || [],
      totalRecords: totalRecords,
      code: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ code: 500, success: false, totalRecords: 0, results: [] });
  }
};

// a simple create comment for product
const createComment = async (
  req: CreateCommentPayload,
  res: ActionResponse
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const userInfo = await decodeBearerToken(authorizationHeader);
    const { content } = req.body;
    const { productId } = req.params;

    //Find current comments for this product
    const findedComment = await Comment.findOne({ productId: productId });
    const findedProduct = await Product.findOne({ _id: productId });

    //Just add a new commment to this product's comments
    if (!!findedComment) {
      try {
        await findedComment.update({
          $set: {
            comments: [
              ...findedComment.comments,
              {
                user: userInfo?.userId,
                comment: content,
              },
            ],
          },
        });
        await findedProduct.update({$set: {totalComments: (findedProduct.totalComment) || 0 + 1}})
        return res.status(200).json({
          success: true,
          message: "Comment success",
          code: 200,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          code: 500,
        });
      }
    }
    //Create a whole new commment
    else {
      try {
        const newComment = new Comment({
          productId: productId,
          comments: [
            {
              user: userInfo?.userId,
              comment: content,
            },
          ],
        });
        await newComment.save();
        await findedProduct.update({$set: {totalComments: 1}})
        return res.status(200).json({
          success: true,
          message: "Comment success",
          code: 200,
        });
      } catch (error) {
        console.log("CREATE COMMENT ERROR", error);
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          code: 500,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      code: 500,
    });
  }
};

export { createComment, getComments };
