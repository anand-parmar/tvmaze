import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Casts, CastsDocument } from './casts.schema';
import { Model } from 'mongoose';

@Injectable()
export class CastsService {
  constructor(
    @InjectModel(Casts.name) private castModel: Model<CastsDocument>,
  ) {}

  async getCast(id: string): Promise<CastsDocument> {
    return await this.castModel.findOne({ id: id }).lean();
  }

  async createCast(cast: any) {
    let newCast = new this.castModel(cast);
    return await newCast.save();
  }

  async find(filter: any) {
    return await this.castModel.find(filter).lean();
  }

  async insertMany(casts: any[]) {
    return await this.castModel.insertMany(casts);
  }
}
