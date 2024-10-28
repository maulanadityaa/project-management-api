import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { ValidationService } from "./validation.service";
import { ErrorFilter } from "./error.filter";
import { APP_FILTER } from "@nestjs/core";
import { AuthMiddleware } from "./auth.middleware";
import { JwtAuthModule } from "../jwt/jwt.module";

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: 'debug',
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtAuthModule
  ],
  providers: [PrismaService, ValidationService, {
    provide: APP_FILTER,
    useClass: ErrorFilter,
  }],
  exports: [PrismaService, ValidationService],
})
export class CommonModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: '/api/v1/users/update',
        method: RequestMethod.PUT,
      },
      {
        path: '/api/v1/technologies',
        method: RequestMethod.POST,
      },
      {
        path: '/api/v1/technologies',
        method: RequestMethod.PUT,
      },
      {
        path: '/api/v1/technologies/*',
        method: RequestMethod.DELETE,
      }
    )
  }
}
