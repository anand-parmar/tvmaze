import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { catchError, lastValueFrom, map } from 'rxjs';
import { CastsService } from '../casts/casts.service';
import { Shows, ShowsDocument } from './shows.schema';
import mongoose, { Model, Mongoose } from 'mongoose';
import { TvMazeResponse } from './entity/tvmaze-response';
import { request } from 'http';

@Injectable()
export class ShowsService {
  private readonly logger = new Logger(ShowsService.name);

  constructor(
    private readonly http: HttpService,
    private castsService: CastsService,
    @InjectModel(Shows.name) private showModel: Model<ShowsDocument>,
  ) {}

  // get show with pagination
  async getShows(page: number) {
    let perPage = 10;
    let totalShows = await this.showModel.countDocuments();
    let totalPages = Math.ceil(totalShows / perPage);

    let shows = await this.showModel.aggregate(
      [
        { $skip: (page - 1) * perPage },
        { $limit: perPage },
        // populate the casts
        {
          $lookup: {
            from: 'casts',
            localField: 'casts',
            foreignField: '_id',
            as: 'casts',
          },
        },
        // convert date to date string "YYYY-MM-DD"
        {
          $addFields: {
            casts: {
              $map: {
                input: '$casts',
                as: 'cast',
                in: {
                  $mergeObjects: [
                    '$$cast',
                    {
                      birthday: {
                        $dateToString: {
                          format: '%Y-%m-%d',
                          date: '$$cast.birthday',
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        // sort the casts by birthday in descending order
        {
          $set: {
            casts: {
              $sortArray: {
                input: '$casts',
                sortBy: { birthday: -1 },
              },
            },
          },
        },
      ],
      { maxTimeMS: 60000, allowDiskUse: true },
    );

    return {
      shows,
      totalShows,
      totalPages,
      currentPage: page,
    };
  }

  // Cron job to scrape the data from TV Maze API every 20 seconds
  @Cron('*/20 * * * * *')
  async scraper() {
    // We will save the show data till 1000. we can increase the limit if needed
    let nextShowId = (await this.getLastShow()) + 1;
    let maxShowId = 1000;
    let rateLimit = 10;

    // Promise allSettled for concurrent api call
    let requestList = [];
    for (
      let i = nextShowId;
      i < nextShowId + rateLimit && i <= maxShowId;
      i++
    ) {
      requestList.push(this.getTvMazeShows(i.toString()));
    }

    let promiseList = await Promise.allSettled(requestList);

    let showsToBeSave = [];

    for (let promise of promiseList) {
      if (promise.status === 'rejected') {
        continue;
      }
      let showApiData: TvMazeResponse = promise?.value;

      let castsToBeSave = [];

      let show = {
        id: showApiData.id,
        name: showApiData.name,
        casts: [],
      };

      let casts = showApiData._embedded.cast.map((cast) => {
        return {
          id: cast.person.id,
          name: cast.person.name,
          birthday: cast.person.birthday,
        };
      });

      // remove duplicate cast
      const castIds = casts.map(({ id }) => id);
      casts = casts.filter(({ id }, index) => !castIds.includes(id, index + 1));

      let castsDB = await this.castsService.find({
        id: { $in: casts.map((cast) => cast.id) },
      });

      for (let cast of casts) {
        let castFound = castsDB.find((c) => c.id == cast.id);

        if (!castFound) {
          let newCast = {
            _id: new mongoose.Types.ObjectId(),
            id: cast.id,
            name: cast.name,
            birthday: cast.birthday,
          } as any;
          castsToBeSave.push(newCast);
          show.casts.push(newCast._id);
        } else {
          show.casts.push(castFound._id);
        }
      }

      // Save all the casts in one go to reduce the db call
      await this.castsService.insertMany(castsToBeSave);

      showsToBeSave.push(show);
    }

    if (showsToBeSave.length > 0) {
      // Save all the shows in one go to reduce the db call
      await this.showModel.insertMany(showsToBeSave);

      this.logger.log({
        fromShowId: nextShowId,
        toShowId: nextShowId + rateLimit,
      });
    }
  }

  // Get Last Show
  async getLastShow() {
    let lastShow = await this.showModel.findOne().sort({ id: -1 });
    return lastShow?.id ?? 0;
  }

  // Get TV Maze Shows
  async getTvMazeShows(id: string) {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://api.tvmaze.com/shows/${id}?embed=cast`,
      headers: {},
    };

    let data = await this.api(config, `TV Show API ${id}`);

    return data;
  }

  // Generic function to call any api
  async api(config: any, serviceName: string) {
    let result = await this.http
      .request(config)
      .pipe(map((response) => response.data))
      .pipe(
        catchError((error) => {
          this.logger.error(`${serviceName} Error`, {
            error: error?.response?.data,
          });

          throw new HttpException(
            error?.response?.data,
            HttpStatus.BAD_REQUEST,
          );
        }),
      );
    let apiData = await lastValueFrom(result);
    return apiData;
  }
}
