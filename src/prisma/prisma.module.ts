import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Import ConfigModule
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
