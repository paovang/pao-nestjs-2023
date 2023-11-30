import {
    IsBoolean,
    IsString,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Max,
    IsDate,
    Validate
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';


export class CreateUserDto {
    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    order_number: string;

    @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
    @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
    amount: number;
}