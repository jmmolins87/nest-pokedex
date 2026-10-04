import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { PokeResponse } from './interfaces/poke.response.interface.js';
import { PokemonEntity } from '../pokemon/entities/pokemon.entity.js';
import { AxiosAdapter } from '../common/adapters/axios.adapter.js';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(PokemonEntity.name) 
    private readonly pokemonModel: Model<PokemonEntity>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed() {

    await this.pokemonModel.deleteMany({});
    
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const pokemonToInsert: { name: string, numPokemon: number}[] = [];

    data.results.forEach(({name, url}) => {
      const segments = url.split('/');
      const numPokemon = +segments[segments.length -2];
      
      // const pokemon = await this.pokemonModel.create({name, numPokemon});
      pokemonToInsert.push({name, numPokemon});
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }
}


