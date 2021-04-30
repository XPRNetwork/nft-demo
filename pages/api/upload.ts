import { NextApiResponse, NextApiRequest } from 'next';
import multer from 'multer';
import FormData from 'form-data';
import fetch from 'node-fetch';

const LG_FILE_SIZE_UPLOAD_LIMIT = 30 * 1000000; // 30 MB

function initMiddleware(middleware) {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const upload = multer({
  limits: { fileSize: LG_FILE_SIZE_UPLOAD_LIMIT },
});
const multerAny = initMiddleware(upload.any());

type NextApiRequestWithFormData = NextApiRequest & {
  files: FileBuffer[];
};

type FileBuffer = File & {
  buffer?: Buffer;
  originalname?: string;
};

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,OPTIONS,PATCH,DELETE,POST,PUT'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  return await fn(req, res);
};

const handler = async (
  req: NextApiRequestWithFormData,
  res: NextApiResponse
): Promise<void> => {
  const isUnauthorized =
    req.headers['Authorization'] !== `Basic ${process.env.XAUTH_PROTON_MARKET}`;

  if (isUnauthorized) {
    res.status(401).send({
      success: false,
      message: 'Unauthorized',
    });
    return;
  }

  const { method } = req;
  switch (method) {
    case 'POST': {
      try {
        await multerAny(req, res);
        if (!req.files?.length || req.files.length > 1) {
          res.status(400).send({
            success: false,
            message: 'File not found, please try again.',
          });
          return;
        }
        const blob: FileBuffer = req.files[0];

        const formData = new FormData();
        formData.append('file', blob.buffer, blob.originalname);

        const headers = {
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET,
          ...formData.getHeaders(),
        };

        const resultRaw = await fetch(
          'https://api.pinata.cloud/pinning/pinFileToIPFS',
          {
            method: 'POST',
            body: formData,
            headers,
          }
        );

        const result = await resultRaw.json();

        if (result.error) throw new Error(result.error.message);
        res.status(200).send({ success: true, message: result });
      } catch (e) {
        res.status(500).send({
          success: false,
          message: e.message || 'Error uploading file',
        });
      }
      break;
    }
    case 'PUT':
      break;
    case 'PATCH':
      break;
    default:
      res.status(200).send({
        success: true,
        message: 'Hello!',
      });
      break;
  }
};

export default allowCors(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
