import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-custmers.dto';
import { UpdateCustomerDto } from './dto/update-customers.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';


@UseGuards(AuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post('create')
  create(@Body() createDto: CreateCustomerDto) {
    return this.customersService.createCustomer(createDto);
  }

  @Get()
  findAllOptions(@Query('idEvent') idEvent?: number) {
    return this.customersService.findAllOptions(idEvent);
  }

  @Get('all')
  findAll(
    @Query('query') query: string,
    @Query('page') page: number,
    @Query('limit') limit: number
  ) {
    return this.customersService.findAll(query, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.customersService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updateDto: UpdateCustomerDto) {
    return this.customersService.updateCustomer(id, updateDto);
  }

  @Put('delete/:id')
  remove(@Param('id') id: number) {
    return this.customersService.deleteCustomer(id);
  }
}
