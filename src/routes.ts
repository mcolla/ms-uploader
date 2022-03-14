/* eslint-disable camelcase */
import { Request, Response, Router } from 'express';
import { Readable } from 'stream';
import readline from 'readline';

import multer from 'multer';
import prisma from './database/prisma';

const multerConfig = multer();

const router = Router();

interface Product {
  code_bar: string;
  description: string;
  price: number;
  quantity: number;
}

router.post(
  '/upload',
  multerConfig.single('file'),
  async (request: Request, response: Response) => {
    const { file } = request;
    const { buffer } = file;

    const readableFile = new Readable();
    readableFile.push(buffer);
    readableFile.push(null);

    const itensLine = readline.createInterface({
      input: readableFile,
    });

    const products: Product[] = [];

    try {
      // eslint-disable-next-line no-restricted-syntax
      for await (const line of itensLine) {
        const itensLineSplit = line.split(';');

        products.push({
          code_bar: itensLineSplit[0],
          description: itensLineSplit[1],
          price: Number(itensLineSplit[2]),
          quantity: Number(itensLineSplit[3]),
        });
      }
      // eslint-disable-next-line no-restricted-syntax
      for await (const { code_bar, description, price, quantity } of products) {
        await prisma.products.create({
          data: {
            code_bar,
            description,
            price,
            quantity,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }

    return response.json(products);
  },
);

export { router };
