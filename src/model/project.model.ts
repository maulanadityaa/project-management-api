import { UserResponse } from "./auth.model";

export class ProjectRequest {
  name: string;
  description?: string;
  technologies: string[];
  image: Express.Multer.File
}

export class ProjectUpdateRequest {
  id: string;
  name?: string;
  description?: string;
  technologies?: string[];
  image?: Express.Multer.File
}

export class ProjectSearchRequest {
  name?: string;
  techs?: string[];
  page?: number;
  size?: number;
}

export class ProjectResponse {
  id: string;
  name: string;
  description?: string;
  technologies: string[];
  imageUrl: string;
  userResponse: UserResponse;
  createdAt: Date;
  updatedAt: Date;
}