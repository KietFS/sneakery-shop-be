import express from "express";

//code types
type ResponseCodeType = 500 | 403 | 401 | 400 | 404 | 200;

type ActionResponse = express.Response<{
  code: ResponseCodeType;
  message: Object | string;
  success: boolean;
}>;

type GetListResponse<T> = express.Response<{
  code: ResponseCodeType;
  results: Array<T> | [];
  totalRecords: number;
  success: boolean;
}>;

type GetOneResponse<T> = express.Response<{
  code: ResponseCodeType;
  results: T | null;
  success: boolean;
}>;
