import { CreateUserDTO } from '../user/user.dto';
import UserService from '../user/user.service';

export const signup = async (body: CreateUserDTO) => {
  try {
    const newUser = await UserService.createUser(body);
    const { password, ...newUserWithoutPassword } = newUser;
    return newUserWithoutPassword;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
