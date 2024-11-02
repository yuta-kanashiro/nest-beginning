import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { Item, ItemStatus } from '@prisma/client';

const mockPrismaService = {
  item: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('ItemsServiceTest', () => {
  let itemsService: ItemsService;
  let prismaService: typeof mockPrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    prismaService = module.get<typeof mockPrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('正常系', async () => {
      prismaService.item.findMany.mockResolvedValue([]);
      const expected = [];
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('正常系', async () => {
      const item: Item = {
        id: 'test-item-id1',
        name: 'test-name',
        price: 100,
        description: 'description',
        status: ItemStatus.ON_SALE,
        userId: 'test-user-id1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaService.item.findUnique.mockResolvedValue(item);
      const expected = item;
      const result = await itemsService.findById('test-item-id1');

      expect(result).toEqual(expected);
      expect(prismaService.item.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'test-item-id1',
        },
      });
    });

    it('異常系', async () => {
      prismaService.item.findUnique.mockResolvedValue(null);
      await expect(itemsService.findById('test-item-id1')).rejects.toThrow();
    });
  });
});
