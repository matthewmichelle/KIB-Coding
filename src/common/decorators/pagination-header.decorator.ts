import { ApiQuery as OriginalApiQuery } from '@nestjs/swagger';

export const ApiQueryPagination = (
  name: string,
  description: string,
  example: any,
) => {
  return OriginalApiQuery({
    name,
    type: Number,
    required: false,
    description,
    example,
  });
};
