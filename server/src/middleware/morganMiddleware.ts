import morgan, { StreamOptions } from "morgan";
import Logger from "../lib/logger";
import { config } from "../global/config";

const stream: StreamOptions = {
  write: (message: string) => Logger.http(message),
};

// Only warning and error messages in production.
const skip = () => config.https.isProduction;

// Build the morgan middleware
const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip }
);
export default morganMiddleware;
