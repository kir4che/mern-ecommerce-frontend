export interface BaseResponse {
  success: boolean;
  code?: string;
  message?: string;
}

export interface UploadImageResponse extends BaseResponse {
  imageUrl: string;
}
