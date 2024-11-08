import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  TechRequest,
  TechResponse,
  TechUpdateRequest,
} from '../model/technology.model';
import { TechnologyValidation } from './technology.validation';
import { Technology } from '@prisma/client';

@Injectable()
export class TechnologyService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async checkTechExists(techName: string): Promise<Technology> {
    const tech = await this.prismaService.technology.findFirst({
      where: {
        name: {
          equals: techName,
          mode: 'insensitive',
        },
      },
    });

    if (tech) {
      throw new HttpException('Technology already exists', 400);
    }

    return tech;
  }

  async checkTechMustExists(techId: string): Promise<Technology> {
    const tech = await this.prismaService.technology.findUnique({
      where: {
        id: techId,
      },
    });

    if (!tech) {
      throw new HttpException(`Technology with id: ${techId} not found`, 404);
    }

    return tech;
  }

  async create(request: TechRequest): Promise<TechResponse> {
    this.logger.debug(`Creating technology ${JSON.stringify(request)}`);

    const techRequest: TechRequest = this.validationService.validate(
      TechnologyValidation.CREATE,
      request,
    );

    let technology = await this.checkTechExists(techRequest.name);

    technology = await this.prismaService.technology.create({
      data: techRequest,
    });

    return {
      id: technology.id,
      name: technology.name,
    };
  }

  async update(request: TechUpdateRequest): Promise<TechResponse> {
    this.logger.debug(`Updating technology ${JSON.stringify(request)}`);

    const techUpdateRequest: TechUpdateRequest =
      this.validationService.validate(TechnologyValidation.UPDATE, request);

    let technology = await this.checkTechMustExists(techUpdateRequest.id);

    technology = await this.prismaService.technology.update({
      where: {
        id: techUpdateRequest.id,
      },
      data: {
        name: techUpdateRequest.name,
      },
    });

    return {
      id: technology.id,
      name: technology.name,
    };
  }

  async delete(id: string): Promise<TechResponse> {
    this.logger.debug(`Deleting technology ${id}`);

    let technology = await this.checkTechMustExists(id);

    technology = await this.prismaService.technology.delete({
      where: {
        id,
      },
    });

    return {
      id: technology.id,
      name: technology.name,
    };
  }

  async get(id: string): Promise<TechResponse> {
    this.logger.debug(`Getting technology ${id}`);

    const technology = await this.checkTechMustExists(id);

    return {
      id: technology.id,
      name: technology.name,
    };
  }

  async getByName(name: string): Promise<TechResponse> {
    this.logger.debug(`Getting technology ${name}`);

    const technology = await this.prismaService.technology.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    });

    if (!technology) {
      throw new HttpException('Technology not found', 404);
    }

    return {
      id: technology.id,
      name: technology.name,
    };
  }

  async list(): Promise<TechResponse[]> {
    this.logger.debug(`Listing technologies`);

    const technologies = await this.prismaService.technology.findMany();

    return technologies.map((technology) => ({
      id: technology.id,
      name: technology.name,
    }));
  }
}
