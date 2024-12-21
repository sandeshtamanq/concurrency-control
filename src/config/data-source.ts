import { join } from 'path'
import { DataSource, DataSourceOptions } from 'typeorm'

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url:
    process.env.NODE_ENV === 'development'
      ? process.env.POSTGRES_CONNECTION_STRING_DEV
      : process.env.POSTGRES_CONNECTION_STRING,
  synchronize: true,
  logging: false,

  entities: [join(__dirname, '../entities', '*.{ts,js}')],
  extra: {
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
    connectionTimeoutMillis: 5000, // Return an error after 2 seconds if connection could not be established
  },
}

export const AppDataSource = new DataSource(dataSourceOptions)
