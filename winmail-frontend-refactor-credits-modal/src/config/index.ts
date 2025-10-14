interface Config {
  type: Environment;
  apiBaseUrl: string;
  apiVersion: string;
}

type Environment = 'development' | 'production';

const development = {
  type: 'development' as Environment,
  apiBaseUrl: 'http://localhost:5003/api',
  apiVersion: 'v1',
};

const production = {
  type: 'production' as Environment,
  apiBaseUrl: process.env.BACKEND_API_URL || 'https://api.mailerone.in/api',
  apiVersion: 'v1',
};

const config: Record<Environment, Config> = {
  development,
  production,
};

function getConfig() {
  const env = (process.env.NODE_ENV || 'development') as Environment;
  return config[env];
}

export default getConfig();
