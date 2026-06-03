import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // making it global so auth can use it
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }