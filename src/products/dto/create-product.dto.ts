import { IsString, IsNumber, Min, IsNotEmpty} from 'class-validator';
export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    price!: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    stock!: number;
}
