import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-custmers.dto';
import { UpdateCustomerDto } from './dto/update-customers.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';


@UseGuards(AuthGuard)
@Controller('customers')
export class customersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post('create')
  create(@Body() createDto: CreateCustomerDto) {
    return this.customersService.createCustomer(createDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
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
