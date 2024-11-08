import { TechnologyService } from './technology.service';
import { TechRequest, TechResponse, TechUpdateRequest } from '../model/technology.model';
import { CommonResponse } from '../model/common-response.model';
export declare class TechnologyController {
    private technologyService;
    constructor(technologyService: TechnologyService);
    create(request: TechRequest): Promise<CommonResponse<TechResponse>>;
    update(request: TechUpdateRequest): Promise<CommonResponse<TechResponse>>;
    get(techId: string): Promise<CommonResponse<TechResponse>>;
    list(): Promise<CommonResponse<TechResponse[]>>;
    delete(techId: string): Promise<CommonResponse<boolean>>;
}
