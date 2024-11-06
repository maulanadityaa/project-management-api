import { UserResponse } from "./auth.model";
export declare class ProjectRequest {
    name: string;
    description?: string;
    technologies: string[];
    image: Express.Multer.File;
}
export declare class ProjectUpdateRequest {
    id: string;
    name?: string;
    description?: string;
    technologies?: string[];
    image?: Express.Multer.File;
}
export declare class ProjectSearchRequest {
    name?: string;
    techs?: string[];
    page?: number;
    size?: number;
}
export declare class ProjectResponse {
    id: string;
    name: string;
    description?: string;
    technologies: string[];
    imageUrl: string;
    userResponse: UserResponse;
    createdAt: Date;
    updatedAt: Date;
}
