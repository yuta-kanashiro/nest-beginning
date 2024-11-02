import { Injectable, NotFoundException } from '@nestjs/common';
import { Item, ItemStatus } from '@prisma/client';
import { CreateItemDto } from './dto/create-item.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<Item[]> {
    return this.prismaService.item.findMany();
  }

  async findById(id: string): Promise<Item> {
    const found = await this.prismaService.item.findUnique({
      where: {
        id,
      },
    });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  /**
   * アイテムを作成する
   * @param CreateItemDto
   * @returns Promise<Item>
   */
  async create(CreateItemDto: CreateItemDto, userId: string): Promise<Item> {
    const { name, price, description } = CreateItemDto;
    return await this.prismaService.item.create({
      data: {
        name,
        price,
        description,
        status: ItemStatus.ON_SALE,
        userId: userId,
      },
    });
  }

  /**
   * 商品ステータスの更新
   * @param {string} id
   * @returns Promise<Item>
   */
  async updateStatus(id: string): Promise<Item> {
    const item = await this.prismaService.item.update({
      where: {
        id,
      },
      data: {
        status: ItemStatus.SOLD_OUT,
      },
    });
    return item;
  }

  /**
   * 商品の削除
   * @param {string} id
   * @returns Promise<string>
   */
  async delete(id: string): Promise<string> {
    await this.prismaService.item.delete({
      where: {
        id,
      },
    });
    return 'Deleted';
  }
}
