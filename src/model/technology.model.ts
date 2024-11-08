import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TechRequest {
  @ApiProperty({example: 'Technology Name', description: 'Technology Name'})
  name: string;
}

export class TechUpdateRequest {
  @ApiProperty({example: 'ValidUUIDv4', description: 'Technology ID'})
  id: string;

  @ApiPropertyOptional({example: 'Updated Technology Name', description: 'Technology Name (optional)'})
  name: string;
}

export class TechResponse {
  @ApiProperty({example: 'ValidUUIDv4', description: 'Technology ID'})
  id: string;

  @ApiProperty({example: 'Technology Name', description: 'Technology Name'})
  name: string;
}