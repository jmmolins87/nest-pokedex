import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { PokemonService } from './pokemon.service.js';
import { PokemonController } from './pokemon.controller.js';
import { PokemonEntity, PokemonSchema } from './entities/pokemon.entity.js';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [ 
    ConfigModule,
    MongooseModule.forFeature([{ name: PokemonEntity.name, schema: PokemonSchema }])
  ],  
  exports: [
    MongooseModule
  ]
})
export class PokemonModule {}
