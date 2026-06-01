import { IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class TransactionDetailDto {
    @IsString()
    @IsNotEmpty()
    productId!: string;

    @IsInt()
    @Min(1, { message: 'Minimum quantity is 1' })
    qty!: number;
}

export class CreateTransactionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => TransactionDetailDto)
    items!: TransactionDetailDto[];
}