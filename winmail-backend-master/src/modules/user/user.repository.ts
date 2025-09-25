import { ObjectId } from 'mongoose';
import userModel, { IUser } from './user.model';
import {
  generateOtp,
  getRemainingDays,
  isPlanExpired,
} from '../../utils/helper';
import { sendEmailVerificationMail } from '../mail/mail.service';
import {
  EPlanIds,
  FREE_PLAN_DURATION,
  IPlanDetails,
  PLANS_DATA,
} from '../../data/PLANS_DATA';
import { ESubscriptionStatus } from '../../data/SUBSCRIPTIONS_DATA';
import { ListAllQueryDTO } from '../../types/common.types';
import dayjs from 'dayjs';
import { SUBSCRIPTION_PERIOD } from '../../consts/rate';

interface IUserRepository {
  createUser(body: any): Promise<IUser>;
  findAllUsers(): Promise<IUser[]>;
  findUserById(id: number | string): Promise<IUser | null>;
  updateUser(id: string | ObjectId, updatedUser: any): Promise<IUser | null>;
  deleteUser(id: string): Promise<IUser | null>;
  isUserOtpValid(email: string, otp: string): Promise<boolean>;
  findUserByEmail(email: string): Promise<IUser | null>;
  isUserOnFreePlan(userId: string): Promise<boolean>;
  getPlanDetailsByUserId(userId: string): Promise<any>;
  getAllUsersPaginated(payload: ListAllQueryDTO): Promise<any>;
  incrementCredits(userId: string, credits: number): Promise<IUser | null>;
  decrementCredits(userId: string, credits: number): Promise<IUser | null>;
}

class UserRepository implements IUserRepository {
  private static instance: UserRepository;

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
      Object.freeze(UserRepository.instance);
    }
    return UserRepository.instance;
  }

  async createUser(body: any): Promise<IUser> {
    try {
      // Normalize email
      body.email = body.email.toLowerCase().trim();
      
      const newUser = await userModel.create(body);

      const otp = generateOtp();

      newUser.otp = otp;

      await newUser.save();

      await sendEmailVerificationMail(newUser.email, otp);

      return newUser;
    } catch (err) {
      throw err;
    }
  }

  async findAllUsers(): Promise<IUser[]> {
    try {
      const users = await userModel.find({});
      return users;
    } catch (err) {
      throw err;
    }
  }

  async findUserById(id: number | string): Promise<IUser | null> {
    try {
      const user = await userModel.findById(id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async updateUser(
    id: string | ObjectId,
    updatedUser: any
  ): Promise<IUser | null> {
    try {
      const user = await userModel.findByIdAndUpdate(id, updatedUser, {
        new: true,
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async deleteUser(id: string): Promise<IUser | null> {
    try {
      const user = await userModel.findByIdAndDelete(id);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async isUserOtpValid(email: string, otp: string): Promise<boolean> {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }
      if (user.otp !== otp) {
        return false;
      }
      return true;
    } catch (err) {
      throw err;
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await userModel.findOne({
        email: email.toLowerCase().trim(),
      });
      return user;
    } catch (err) {
      throw err;
    }
  }

  async isUserOnFreePlan(userId: string): Promise<boolean> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      if (user.subscription.plan === EPlanIds.FREE) {
        // check for the expiry date from FREE_PLAN_DURATION

        const expiryDate = new Date(user.subscription.startDate);

        expiryDate.setDate(expiryDate.getDate() + FREE_PLAN_DURATION);

        if (expiryDate < new Date(Date.now())) {
          // if the expiry date is less than the current date, then return false
          return false;
        }

        // if the expiry date is greater than the current date, then return true
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  async getPlanDetailsByUserId(userId: string): Promise<any> {
    try {
      const user = await userModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      const { subscription } = user;
      let data: any;
      PLANS_DATA.forEach((plan: IPlanDetails) => {
        if (plan.id === subscription.plan) {
          data = plan;
          return;
        }
      });
      if (!data) {
        throw new Error('Plan not found');
      }

      const isExpired: boolean = isPlanExpired(subscription.expiryDate);

      data.isExpired = isExpired;

      data.remainingDays = isExpired
        ? 0
        : getRemainingDays(subscription.startDate, SUBSCRIPTION_PERIOD);

      if (isExpired) {
        user.subscription.status = ESubscriptionStatus.EXPIRED;
        await user.save();
      }

      let res: any = {
        plan: data,
        subscription: subscription,
      };
      return res;
    } catch (err) {
      throw err;
    }
  }

  async getAllUsersPaginated(payload: ListAllQueryDTO): Promise<any> {
    const selected_fields = '_id name email';
    const or_object = [];

    if (payload.search_text) {
      or_object.push({
        name: { $regex: payload.search_text, $options: 'i' },
      });
      or_object.push({
        email: { $regex: payload.search_text, $options: 'i' },
      });
    }

    // check if search_text is in MM/DD/YYYY format and parse it with DayJS
    const parsed_date = dayjs(payload.search_text, 'MM/DD/YYYY');
    if (parsed_date.isValid()) {
      const startOfDay = parsed_date.startOf('day').toDate();
      const endOfDay = parsed_date.endOf('day').toDate();

      // add date range search for created_at field
      or_object.push({
        createdAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      });
    }

    const order_by = payload.order_by || 'createdAt';
    const order = payload?.order ? (payload.order === 'asc' ? 1 : -1) : -1;

    const page = payload.page || 1;
    const size = payload.size || 10;

    const users = await userModel
      .find({
        is_active: true,
        is_deleted: false,
        $or: or_object,
      })
      .limit(size)
      .skip((page - 1) * size)
      .sort({ [order_by]: order })
      .select(selected_fields)
      .populate({
        path: 'role',
        model: 'Role',
        select: '_id name',
      })
      .lean()
      .exec();

    const total = await userModel.countDocuments({
      is_active: true,
      is_deleted: false,
      $or: or_object,
    });

    return {
      data: users,
      total,
      page,
      size,
    };
  }

  async incrementCredits(
    userId: string,
    credits: number
  ): Promise<IUser | null> {
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        { $inc: { credits } },
        {
          new: true,
        }
      );
      console.log('user:',user);
      console.log('credits',credits);
      return user;
    } catch (err) {
      throw err;
    }
  }

  async decrementCredits(
    userId: string,
    credits: number
  ): Promise<IUser | null> {
    try {
      const user = await userModel.findByIdAndUpdate(
        userId,
        { $inc: { credits: -credits } },
        {
          new: true,
        }
      );

      return user;
    } catch (err) {
      throw err;
    }
  }
}

export default UserRepository.getInstance();
