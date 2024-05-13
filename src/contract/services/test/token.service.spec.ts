import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../token.service';
import { DatabaseModule } from '../../../common/db/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../../entities/contract.entity';
import { Azienda } from '../../entities/azienda.entity';
import { Officina } from '../../entities/officina.entity';

describe('TokenService', () => {
  let tokenService: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // DatabaseModule,
        // TypeOrmModule.forFeature([Contract, Azienda, Officina]),
      ],
      providers: [TokenService],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  it('should extract token', () => {
    const data = {
      tokens: [
        {
          name: 'avis.sas.siuum',
          value: '2€',
        },
        {
          name: 'avis.sas.beppe',
          value: '3€',
        },
        {
          name: 'avis.siuum',
          value: '5€',
        },
      ],
    };

    const tokenTree = tokenService.extractTokens(data.tokens);
    expect(tokenTree).toEqual({
      avis: {
        sas: {
          siuum: '2€',
          beppe: '3€',
        },
        siuum: '5€',
      },
    });
  });
});
