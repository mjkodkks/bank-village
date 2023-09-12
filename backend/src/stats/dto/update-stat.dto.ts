import { PartialType } from '@nestjs/swagger';
import { CreateStatDto } from './create-stat.dto';

export class UpdateStatDto extends PartialType(CreateStatDto) {}
