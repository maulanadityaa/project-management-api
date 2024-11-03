import { Injectable } from "@nestjs/common";
import { PrismaService } from "../src/common/prisma.service";
import { JwtService } from "../src/jwt/jwt.service";
import * as bcrypt from 'bcrypt';
import { ProjectResponse } from "../src/model/project.model";

@Injectable()
export class TestService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {
  }

  async createUser(){
    await this.prismaService.user.create({
      data: {
        username: 'test',
        name: 'test',
        password: await bcrypt.hash('test', 10),
      }
    })
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async validateToken(token: string) {
    return this.jwtService.verifyToken(token);
  }

  async getUser() {
    return this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
  }

  async getToken() {
    const user = await this.getUser();
    return this.jwtService.generateToken(user);
  }

  async createTech(){
    await this.prismaService.technology.create({
      data: {
        name: 'test tech',
      }
    })
  }

  async getTech(){
    return this.prismaService.technology.findFirst({
      where: {
        name: 'test tech',
      },
    });
  }

  async deleteTech(){
    const tech = await this.prismaService.technology.findFirst({
      where: {
        name: 'test tech',
      },
    })

    if(tech){
      await this.prismaService.projectTechnology.deleteMany({
        where: {
          technology_id: tech.id,
        },
      })
    }

    await this.prismaService.technology.deleteMany({
      where: {
        OR: [
          {
            name: 'updated tech',
          },
          {
            name: 'test tech',
          }
        ],
      },
    });
  }

  async getNewImageFile(): Promise<string> {
    return 'test/file/image-test.jpg';
  }

  async deleteProject() {
    const tech = await this.prismaService.project.findMany({
      where: {
        OR: [
          {
            name: 'test project',
          },
          {
            name: 'updated project',
          }
        ]
      }
    });

    if (tech) {
      for (let i = 0; i < tech.length; i++) {
        await this.prismaService.projectImage.deleteMany({
          where: {
            project_id: tech[i].id,
          },
        })

        await this.prismaService.projectTechnology.deleteMany({
          where: {
            project_id: tech[i].id,
          },
        })

        await this.prismaService.project.delete({
          where: {
            id: tech[i].id,
          },
        });
      }
    }
  }

  async createProject() {
    const tech = await this.getTech();
    const image = await this.getNewImageFile()
    const user = await this.getUser();

    await this.prismaService.project.create({
      data: {
        name: 'test project',
        description: 'test description',
        project_image: {
          create: {
            url: image,
          },
        },
        project_technology: {
          create: {
            technology_id: tech.id,
          }
        },
        ...{ user_id: user.id },
      },
    });
  }

  async getProject(): Promise<ProjectResponse> {
    const project =  await this.prismaService.project.findFirst({
      where: {
        name: 'test project',
      },
    });

    const technologies = await this.prismaService.technology.findMany({
      where: {
        project_technology : {
          some: {
            project_id: project.id,
          }
        }
      },
    });

    const image = await this.prismaService.projectImage.findFirst({
      where: {
        project_id: project.id,
      },
    });

    const user = await this.prismaService.user.findFirst({
      where: {
        id: project.user_id,
      },
    })

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      technologies: technologies.map((technology) => technology.name),
      imageUrl: image.url,
      userResponse: {
        username: user.username,
        name: user.name
      },
      createdAt: project.created_at,
      updatedAt: project.updated_at,
    };
  }

  async deleteAll() {
    await this.deleteProject();
    await this.deleteTech();
    await this.deleteUser();
  }
}