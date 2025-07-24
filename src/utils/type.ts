interface HttpError {
  status: number;
  message: string;
  data?: any;
}

export type HttpResult<T> =
  | { data: T; error: null; status: number }
  | { data: null; error: HttpError; status: number };
