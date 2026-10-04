import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module.js';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module.js';


@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(import.meta.dirname, '..', 'public')
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/pokedex'),
    PokemonModule,
    CommonModule
  ]    
})

export class AppModule {}
