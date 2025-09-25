import tokenModel from './token.model';

export const createToken = async (token: string, user: any) => {
  try {
    const newToken = new tokenModel({ token });
    await newToken.save();
    return newToken;
  } catch (err: any) {
    throw new Error(err.message);
  }
};
