import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { PrismaService } from '../prisma/prisma.service'
import { MenuController } from './menu.controller'
import { MenuService } from './menu.service'

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService],
  imports: [PrismaModule],
})
export class MenuModule {}
