import { UserResponse } from "./auth.model";
import { ApiProperty } from '@nestjs/swagger';

export class ProjectRequest {
  @ApiProperty({example: 'Project Name', description: 'Project Name'})
  name: string;

  @ApiProperty({example: 'Project Description', description: 'Project Description'})
  description?: string;

  @ApiProperty({example: ['tech1', 'tech2'], description: 'Array of technologies'})
  technologies: string[];

  @ApiProperty({example: 'image.jpg', description: 'Project Image', type: 'string', format: 'binary'})
  image: Express.Multer.File
}

export class ProjectUpdateRequest {
  @ApiProperty({example: 'ValidUUIDv4', description: 'Project ID'})
  id: string;

  @ApiProperty({example: 'Updated Project Name', description: 'Project Name (optional)'})
  name?: string;

  @ApiProperty({example: 'Updated Project Description', description: 'Project Description (optional)'})
  description?: string;

  @ApiProperty({example: ['tech1', 'tech2'], description: 'Array of technologies (optional)'})
  technologies?: string[];

  @ApiProperty({example: 'image.jpg', description: 'Project Image (optional)', type: 'string', format: 'binary'})
  image?: Express.Multer.File
}

export class ProjectSearchRequest {
  @ApiProperty({example: 'Project Name', description: 'Project Name'})
  name?: string;

  @ApiProperty({example: ['tech1', 'tech2'], description: 'Array of technologies'})
  techs?: string[];

  @ApiProperty({example: 1, description: 'Page number (optional) - default 1'})
  page?: number;

  @ApiProperty({example: 10, description: 'Page size (optional) - default 10'})
  size?: number;
}

export class ProjectResponse {
  @ApiProperty({example: 'ValidUUIDv4', description: 'Project ID'})
  id: string;

  @ApiProperty({example: 'Project Name', description: 'Project Name'})
  name: string;

  @ApiProperty({example: 'Project Description', description: 'Project Description'})
  description?: string;

  @ApiProperty({example: ['tech1', 'tech2'], description: 'Array of technologies'})
  technologies: string[];

  @ApiProperty({example: 'cloudinary-secure-url', description: 'Project Image'})
  imageUrl: string;

  userResponse: UserResponse;

  @ApiProperty({example: '2021-01-01T00:00:00.000Z', description: 'Created At'})
  createdAt: Date;

  @ApiProperty({example: '2021-01-01T00:00:00.000Z', description: 'Updated At'})
  updatedAt: Date;
}