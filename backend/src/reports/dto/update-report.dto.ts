import { PartialType } from '@nestjs/swagger';
import { CreateStatementDto } from './create-report.dto';

export class UpdateReportDto extends PartialType(CreateStatementDto) {}
