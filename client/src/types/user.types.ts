export type TAuthUserProfile = {
  _id: string;
  name: string;
  phone: string;
  username: string;
  email: string;
  gender: string;
  profilePicture: string;
  is_active: boolean;
  nodemailer_config: object;
  is_product_tour_seen: boolean;
  role: TRole;
  createdAt: Date;
  updatedAt: Date;
  is_verified: boolean;
  credits: number;
};

export type TAuthUserDevice = {
  details: {
    client: {
      type: string;
      name: string;
      version: string;
      engine: string;
      engineVersion: string;
    };
    os: {
      name: string;
      version: string;
      platform: string;
    };
    device: {
      type: string;
      brand: string;
      model: string;
    };
  };
  lastLogin: Date;
  updatedAt: Date;
};

export type TRole = {
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  is_deleted: boolean;
};

export type TUserResponse = {
  _id: string;
  name: string;
  email: string;
  activeTokens: string[];
  currentToken?: string;
  username: string;
  is_product_tour_seen: boolean;
};
