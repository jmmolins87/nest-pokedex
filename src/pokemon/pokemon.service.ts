import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto.js';
import { UpdatePokemonDto } from './dto/update-pokemon.dto.js';
import { PokemonEntity } from './entities/pokemon.entity.js';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(PokemonEntity.name)
    private readonly pokemonModel: Model<PokemonEntity>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    
  try {
    const pokemon = await this.pokemonModel.create(createPokemonDto); 
    return pokemon;  
  } catch (error: any) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon already exists in the database ${JSON.stringify(error.keyValue)}`,
        );
      }

      console.log(error);
      throw new InternalServerErrorException(`Error creating pokemon`);;
    }

  }

  findAll() {
    return `This action returns all pokemon`;
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
    if(updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne(updatePokemonDto);
      return {...pokemon.toJSON(), ...updatePokemonDto}
    } catch(error) {
      console.log(error);
      throw new InternalServerErrorException(`Can't create Pokemon`)
    }
  }

  remove(term: number) {
    return `This action removes a #${term} pokemon`;
  }
}
