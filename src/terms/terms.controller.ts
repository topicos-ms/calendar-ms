import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TermsService } from './terms.service';
import { CreateTermDto, ListTermDto, UpdateTermDto } from './dto';

@Controller()
export class TermsController {
  constructor(private readonly termsService: TermsService) {}

  @MessagePattern('calendar.terms.create')
  create(@Payload() createTermDto: CreateTermDto) {
    return this.termsService.create(createTermDto);
  }

  @MessagePattern('calendar.terms.list')
  findAll(@Payload() listTermDto: ListTermDto) {
    return this.termsService.findAll(listTermDto);
  }

  @MessagePattern('calendar.terms.findOne')
  findOne(@Payload() id: string) {
    return this.termsService.findOne(id);
  }

  @MessagePattern('calendar.terms.update')
  update(
    @Payload()
    payload: {
      id: string;
      updateTermDto: UpdateTermDto;
    },
  ) {
    return this.termsService.update(payload.id, payload.updateTermDto);
  }

  @MessagePattern('calendar.terms.remove')
  remove(@Payload() id: string) {
    return this.termsService.remove(id);
  }
}
