import { DataSource } from 'typeorm'
import { AppDataSource } from './data-source'

export const dbConnection = async (): Promise<DataSource> => {
  return AppDataSource.initialize()
}
