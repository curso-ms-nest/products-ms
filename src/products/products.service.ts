import { Body, Injectable, Logger, NotFoundException, OnModuleInit, Param, ParseIntPipe } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect;
    this.logger.log('Base de Datos Conectada');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages/limit);
    return {
      data: this.product.findMany({
      skip: (page -1) * limit,
      take: limit
    }),
    meta: {
      total: totalPages,
      page: page,
      lastPage: lastPage
    }}
  }

  findOne(id: number) {
    const product =  this.product.findFirst({
      where: {id}
    });

    if(!product){
      throw new NotFoundException(`No se encontró el producto con id: ${id}`);
    }

    return product;
  }

  async update(id:number, updateProductDto: UpdateProductDto){
    const producto = await this.findOne(id);
    return this.product.update({
      where: {id},
      data: updateProductDto,
    })
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    return  this.product.update({
      where: { id },
      data: { available: false },
    })
  }
}
