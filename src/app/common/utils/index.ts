import { BadRequestException } from '@nestjs/common';

export const pagination = (total: number, page: number, pageSize: number) => {
  const lastPage = Math.ceil(total / pageSize);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < lastPage ? page + 1 : null;

  return { total, lastPage, page, prevPage, nextPage };
};

const imageFileFilter = (__, file, callback) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    return callback(new BadRequestException(['Only images are allowed.', 'jpg|JPG|jpeg|JPEG|png|PNG']), false);
  }
  callback(null, true);
};

export const swaggerSchemaBodyForFileArray = {
  schema: {
    type: 'object',
    properties: {
      images: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  },
};

export const imageMulterOptions = {
  fileFilter: imageFileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 1MB
};
