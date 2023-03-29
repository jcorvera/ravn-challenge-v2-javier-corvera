import { Module } from '@nestjs/common';
import { PrismaModule } from '@app/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
})
export class AppModule {}
