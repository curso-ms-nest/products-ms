import { 
  HttpStatus,
  Injectable, 
  Logger, 
  NotFoundException, 
  OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

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
  
    // Validar valores de paginación
    const currentPage = page > 0 ? page : 1; // Asegurarse de que la página sea válida
    const currentLimit = limit > 0 ? limit : 10; // Default limit si no se envía o es inválido
  
    // Contar el total de productos
    const totalPages = await this.product.count();
  
    // Calcular la última página
    const lastPage = Math.ceil(totalPages / currentLimit);
  
    // Obtener los productos paginados
    const products = await this.product.findMany({
      skip: (currentPage - 1) * currentLimit,
      take: currentLimit,
    });
  
    // Devolver el objeto con los datos y la metadata
    return {
      data: products,
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: lastPage,
      },
    };
  }
  
  async findOne(id: number) {
    const product =  await this.product.findFirst({
      where: { id, available: true },
    });

    console.log(product); 

    if(!product){
      throw new RpcException({
        message:`No se encontró el producto con id: ${id}`,
        code: HttpStatus.BAD_REQUEST
      });
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
