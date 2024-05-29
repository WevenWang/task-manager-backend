import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';

export const getTestApp = async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  return moduleFixture.createNestApplication();
};
