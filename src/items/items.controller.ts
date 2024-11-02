import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { Item } from '@prisma/client';
import { CreateItemDto } from './dto/create-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { RequestUser } from '../types/requestUser';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return await this.itemsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
    return await this.itemsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() CreateItemDto: CreateItemDto,
    @Request() req: ExpressRequest & { user: RequestUser },
  ): Promise<Item> {
    return await this.itemsService.create(CreateItemDto, req.user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateStatus(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
    return await this.itemsService.updateStatus(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<string> {
    return await this.itemsService.delete(id);
  }
}
