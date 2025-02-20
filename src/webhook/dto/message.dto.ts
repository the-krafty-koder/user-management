import { IsString, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class WhatsappMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}
