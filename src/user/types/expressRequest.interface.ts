import { Request } from 'express';
import mongoose from 'mongoose';

export interface ExpressRequest extends Request {
  userId: mongoose.Schema.Types.ObjectId;
}
