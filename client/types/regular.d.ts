interface SocketResponse<T> {
  status: "success" | "failed";
  data: T;
  message?: string;
}
