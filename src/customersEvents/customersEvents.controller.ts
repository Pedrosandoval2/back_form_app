import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';

import { CustomersEventsService } from './customersEvents.service';
import { CreateCustomerEventDto } from './dto/create-customerEvent';
import { UpdateCustomerEventDto } from './dto/update-customerEvent';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('customersEvents')
export class CustomersEventsController {
    constructor(private readonly customersEventsService: CustomersEventsService) { }

    @Post('create')
    create(@Body() createDto: CreateCustomerEventDto) {
        return this.customersEventsService.createCustomerEvent(createDto);
    }

    @Get()
    findAll() {
        return this.customersEventsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.customersEventsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateDto: UpdateCustomerEventDto) {
        return this.customersEventsService.update(+id, updateDto);
     }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.customersEventsService.remove(+id);
    }
}
