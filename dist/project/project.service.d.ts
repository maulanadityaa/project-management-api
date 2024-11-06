import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { ProjectRequest, ProjectResponse, ProjectSearchRequest, ProjectUpdateRequest } from "../model/project.model";
import { CloudinaryService } from '../common/cloudinary.service';
import { Project } from '@prisma/client';
import { TechnologyService } from '../technology/technology.service';
import { JwtService } from "../jwt/jwt.service";
import { CommonResponse } from "../model/common-response.model";
export declare class ProjectService {
    private prismaService;
    private validationService;
    private logger;
    private cloudinaryService;
    private technologyService;
    private jwtService;
    constructor(prismaService: PrismaService, validationService: ValidationService, logger: Logger, cloudinaryService: CloudinaryService, technologyService: TechnologyService, jwtService: JwtService);
    create(token: string, request: ProjectRequest): Promise<ProjectResponse>;
    checkProjectMustExist(id: string): Promise<Project>;
    get(id: string): Promise<ProjectResponse>;
    update(token: string, request: ProjectUpdateRequest): Promise<ProjectResponse>;
    search(request: ProjectSearchRequest): Promise<CommonResponse<ProjectResponse[]>>;
    toProjectResponse(project: Project): Promise<ProjectResponse>;
}
