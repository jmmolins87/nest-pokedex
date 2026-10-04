import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke.response.interface.js';

@Injectable()
export class SeedService {

  private readonly axios: AxiosInstance = axios.default.create();

  async executeSeed() {
      const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');

      data.results.forEach(({name, url}) => {
        const segments = url.split('/');
        const numPokemon = +segments[segments.length -2];

        console.log({name, numPokemon});
      })

      return data.results;
    }
  }


