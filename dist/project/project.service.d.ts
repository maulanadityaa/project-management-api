import { Project } from '@prisma/client';
import { Logger } from 'winston';
import { CloudinaryService } from '../common/cloudinary.service';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { JwtService } from '../jwt/jwt.service';
import { CommonResponse } from '../model/common-response.model';
import { ProjectRequest, ProjectResponse, ProjectSearchRequest, ProjectUpdateRequest } from '../model/project.model';
import { TechnologyService } from '../technology/technology.service';
export declare class ProjectService {
    private prismaService;
    private validationService;
    private logger;
    private cloudinaryService;
    private technologyService;
    private jwtService;
    constructor(prismaService: PrismaService, validationService: ValidationService, logger: Logger, cloudinaryService: CloudinaryService, technologyService: TechnologyService, jwtService: JwtService);
    dateNow: Date;
    create(token: string, request: ProjectRequest): Promise<ProjectResponse>;
    checkProjectMustExist(id: string): Promise<Project>;
    get(id: string): Promise<ProjectResponse>;
    update(token: string, request: ProjectUpdateRequest): Promise<ProjectResponse>;
    search(request: ProjectSearchRequest): Promise<CommonResponse<ProjectResponse[]>>;
    private searchProjects;
    getProjectsPerUser(token: string, request: ProjectSearchRequest): Promise<CommonResponse<ProjectResponse[]>>;
    toProjectResponse(project: Project): Promise<ProjectResponse>;
    delete(token: string, id: string): Promise<ProjectResponse>;
    reactivate(token: string, id: string): Promise<ProjectResponse>;
}
