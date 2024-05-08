import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';

class DataDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
  
  @IsString()
  @IsNotEmpty()
  status: string;
}


export class WebhookDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;

}
