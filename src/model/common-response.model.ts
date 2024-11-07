import { ApiProperty } from '@nestjs/swagger';

export class Paging {
  @ApiProperty({ example: 10, description: 'Page size' })
  size: number;

  @ApiProperty({ example: 1, description: 'Page number' })
  totalPage: number;

  @ApiProperty({ example: 1, description: 'Current page' })
  currentPage: number;

  @ApiProperty({ example: 100, description: 'Total rows' })
  totalRows: number;
}

export class CommonResponse<T> {
  @ApiProperty({ example: 200, description: 'Status code' })
  statusCode: number;

  @ApiProperty({ example: 'Success', description: 'Status message' })
  message: string;

  @ApiProperty({ type: Object, description: 'Data response' })
  data?: T;

  @ApiProperty({ example: 'Error message', description: 'Error message' })
  errors?: string;

  @ApiProperty({ type: Object, description: 'Paging information' })
  paging?: Paging;
}
