import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CalendarService } from './calendar.service';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';

@Controller()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @MessagePattern('createCalendar')
  create(@Payload() createCalendarDto: CreateCalendarDto) {
    return this.calendarService.create(createCalendarDto);
  }

  @MessagePattern('findAllCalendar')
  findAll() {
    return this.calendarService.findAll();
  }

  @MessagePattern('findOneCalendar')
  findOne(@Payload() id: number) {
    return this.calendarService.findOne(id);
  }

  @MessagePattern('updateCalendar')
  update(@Payload() updateCalendarDto: UpdateCalendarDto) {
    return this.calendarService.update(updateCalendarDto.id, updateCalendarDto);
  }

  @MessagePattern('removeCalendar')
  remove(@Payload() id: number) {
    return this.calendarService.remove(id);
  }
}
