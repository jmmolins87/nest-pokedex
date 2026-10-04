import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema()
export class PokemonEntity extends Document {

    @Prop({ unique: true, index: true })
    name: string;

    @Prop({ unique: true, index: true })
    numPokemon: number;
}


export const PokemonSchema = SchemaFactory.createForClass(PokemonEntity);