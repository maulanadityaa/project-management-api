import { ProjectService } from "./project.service";
import { ProjectRequest, ProjectResponse, ProjectUpdateRequest } from "../model/project.model";
import { CommonResponse } from "../model/common-response.model";
export declare class ProjectController {
    private projectService;
    constructor(projectService: ProjectService);
    create(token: string, request: ProjectRequest, image: Express.Multer.File): Promise<CommonResponse<ProjectResponse>>;
    update(token: string, request: ProjectUpdateRequest, image: Express.Multer.File): Promise<CommonResponse<ProjectResponse>>;
    get(projectId: string): Promise<CommonResponse<ProjectResponse>>;
    search(name?: string, techs?: string[], page?: number, size?: number): Promise<CommonResponse<ProjectResponse[]>>;
}
