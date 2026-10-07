import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';

import { PokemonModule } from './pokemon/pokemon.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module.js';
import { SeedModule } from './seed/seed.module.js';
import { EnvConfiguration } from './config/app.config.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public')
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGODB'),
      })
    }),
    PokemonModule,
    CommonModule,
    SeedModule,
  ]    
})

export class AppModule {}
