import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class FileDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  id: number;

  path: string;
}
