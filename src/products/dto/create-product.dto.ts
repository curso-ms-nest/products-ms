import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    name: string;
    @IsNumber({
        maxDecimalPlaces: 4
    })
    @Min(0)
    @Type(()=>Number)
    price: number;

    @IsOptional() // Decorador para no obligatorio
    @IsBoolean() // Validación para asegurarse de que es booleano
    @Type(() => Boolean) // Transformación del valor a booleano
    available: boolean = true; // Valor por defecto (true)
}


