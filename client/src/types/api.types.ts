export type TApiResponse<T> = {
  status: boolean;
  message: string;
  data: T;
};
