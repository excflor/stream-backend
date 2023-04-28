import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Version,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Version('1')
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customerService.create(createCustomerDto);
  }

  @Version('1')
  @Get()
  async findAll() {
    return await this.customerService.findAll();
  }

  @Version('1')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.customerService.findOne(+id);
  }

  @Version('1')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return await this.customerService.update(+id, updateCustomerDto);
  }

  @Version('1')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.customerService.remove(+id);
  }
}
