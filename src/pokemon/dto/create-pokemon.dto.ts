import { IsInt, IsPositive, IsString, MinLength } from "class-validator";




export class CreatePokemonDto {

    //IsInt, IsPositive, Min 1
    @IsInt()
    @IsPositive()
    @MinLength(1)
    numPokemon: number;

    // IsString, Min 1
    @IsString()
    @MinLength(1)
    name: string;
}
