import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginatedViewModel } from '../../../shared/models/pagination';
import { GamesStats } from './domain/stats.entity';
import { TopViewModel } from './dto/top-view-model';
import { GetTopPaginationDto } from './dto/get-top.pagination-dto';

@Injectable()
export class TopQueryRepository {
  constructor(
    @InjectRepository(GamesStats)
    private statsRepository: Repository<GamesStats>,
  ) {}

  async getTop(getTopDto: GetTopPaginationDto): Promise<paginatedViewModel<TopViewModel[]>> {
    const { sort = [], pageNumber = 1, pageSize = 10 } = getTopDto;

    const sortFields = Array.isArray(sort) ? sort : [sort];

    if (sortFields.length === 0) {
      sortFields.push('avgScores desc', 'sumScore desc');
    }

    console.log(sortFields);

    const builder = await this.statsRepository
      .createQueryBuilder('gs')
      .leftJoin('gs.user', 'user')
      .addSelect(['user.login']);

    sortFields.forEach((field) => {
      const [fieldName, sortDirection] = field.split(' ');
      builder.addOrderBy(`gs.${fieldName}`, sortDirection.toUpperCase());
    });

    const [top, totalCount] = await builder
      .limit(pageSize)
      .offset((pageNumber - 1) * pageSize)
      .getManyAndCount();

    const topView = top.map(this.mapToTopViewModel);
    return {
      pagesCount: Math.ceil(totalCount / pageSize),
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: topView,
    };
  }
  mapToTopViewModel(playerStats): TopViewModel {
    return {
      sumScore: playerStats.sumScore,
      avgScores: playerStats.avgScores,
      gamesCount: playerStats.gamesCount,
      winsCount: playerStats.winsCount,
      lossesCount: playerStats.lossesCount,
      drawsCount: playerStats.drawsCount,
      player: { id: playerStats.userId.toString(), login: playerStats.user.login },
    };
  }
}
