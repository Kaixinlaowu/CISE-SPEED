// src/config/mongoose.config.ts
import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/cise-speed';

class Database {
  private static instance: Database;

  private constructor() {
    this.connect();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async connect() {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDB 连接成功');
    } catch (error) {
      console.error('MongoDB 连接失败:', error);
      process.exit(1);
    }
  }

  public static close() {
    return mongoose.connection.close();
  }
}

export default Database.getInstance();
