import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";
import { HttpResult } from "../utils/type";

const httpsRequest = async <Req = any, Res = any>(
  method: Method,
  url: string,
  data?: Req,
  conf?: AxiosRequestConfig
): Promise<HttpResult<Res>> => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    ...conf,
  };

  try {
    const response = await axios.request<Res>(config);
    return { status: response.status, data: response.data, error: null };
  } catch (error) {
    const err = error as AxiosError;
    return {
      status: err.response?.status || 400,
      data: null,
      error: {
        status: err.response?.status || 400,
        message: err.message,
        data: err.response?.data,
      },
    };
  }
};

export default httpsRequest;
