import { UnprocessableEntityException } from '@nestjs/common';

export function changeStringToArray(arrStr: string) {
  const array = [...new Set(arrStr.split(','))] as string[];

  if (array?.length && array.every((item) => typeof item === 'string')) {
    return array;
  }

  throw new UnprocessableEntityException(
    `Mỗi phần tử phải đúng định dạng string!`,
  );
}