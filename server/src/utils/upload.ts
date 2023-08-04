import { CustomRequest } from "../types/shared";
import dotenv from "dotenv";
import multer from "multer";
import * as Minio from "minio";
import crypto from "crypto";
import AppError from "./appError";

dotenv.config();

export const imageUpload = () => {
  const storage = multer.memoryStorage();

  const multerFilter = (
    req: CustomRequest,
    file: Express.Multer.File,
    cb: any
  ) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new AppError(" Please upload image only", 400), false);
    }
  };

  return multer({ storage: storage, fileFilter: multerFilter });
};

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: Number(process.env.MINIO_PORT!),
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

const minioPut = (
  bucketName: string,
  fileName: string,
  file: Buffer,
  properties: any
) => {
  return new Promise((resolve, reject) => {
    minioClient.putObject(bucketName, fileName, file, properties, (err, _) => {
      if (err) return reject(err);
      resolve("");
    });
  });
};

export const uploadFile = async (data: Express.Multer.File) => {
  try {
    const filename = `${crypto.randomUUID()}-${Date.now()}-${
      data.originalname
    }`;
    const properties = { "Content-Type": data.mimetype };

    await minioPut("aniro", filename, data.buffer, properties);

    return `https://s1.cdnimg.me:9000/aniro/${filename}`;
  } catch (err) {
    console.log(err);
  }
};
