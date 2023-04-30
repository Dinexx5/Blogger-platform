import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class AttemptsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}
  async addNewAttempt(requestData: string, date: string) {
    const attemptQuery = `INSERT INTO "Attempts"
                   ("requestData", "date")
                   VALUES ($1, $2)
                   RETURNING *;`;
    await this.dataSource.query(attemptQuery, [requestData, date]);
  }
  async countAttempts(requestData: string, timeTenSecondsAgo: string) {
    const counterQuery = `SELECT COUNT(*)
                    FROM "Attempts" 
                    WHERE "requestData" = '${requestData}' AND "date" >=  '${timeTenSecondsAgo}'`;

    const counter = await this.dataSource.query(counterQuery);
    return counter[0].count;
  }
}
