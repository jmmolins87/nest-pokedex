import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { PokemonEntity } from './entities/pokemon.entity.js';
import { PaginationDto } from '../common/dto/pagination.dtop.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel(PokemonEntity.name)
    private readonly pokemonModel: Model<PokemonEntity>,
    private readonly configService: ConfigService
  ) { 
    this.defaultLimit = this.configService.get<number>('defaultLimit') ?? 5;
  }

async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto); 
      return pokemon;  
    } catch (error: any) {
      throw this.handlerExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {

    
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      numPokemon: 1
    })
    .select('-__v')
  }

  async findOne(term: string) {
    let pokemon: PokemonEntity | null;

    if (!isNaN(+term)) {
      // Buscar por número de Pokémon
      pokemon = await this.pokemonModel.findOne({
        numPokemon: +term,
      });
    } else if (term.length === 24) {
      // Buscar por _id de MongoDB
      pokemon = await this.pokemonModel.findById(term);
    } else {
      // Buscar por nombre
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(`Pokemon "${term}" not found`);
    }

    return pokemon;
  }

  
async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error: any) {
      throw this.handlerExceptions(error);
    }
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // return {id};
    // const result = await this.pokemonModel.findByIdAndDelete(id);
    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});

    if(deletedCount === 0) throw new BadRequestException(`Pokemon with id "${id} not found"`)
    return;
  }

  private handlerExceptions(error: any) {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in db "${JSON.stringify(error.value)}"`)
    }
    // console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon`)  
  }
}
