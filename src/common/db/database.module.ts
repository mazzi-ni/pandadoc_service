import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: 'db-ps',
        port: configService.get<number>('db.port'),
        password: configService.get<string>('db.password'),
        username: configService.get<string>('db.username'),
        database: configService.get<string>('db.database'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
