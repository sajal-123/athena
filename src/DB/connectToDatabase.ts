import mongoose, { ConnectOptions } from "mongoose";


async function connectToDatabase(): Promise<void> {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/ATHENA`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions
    );

    console.log(
      `MONGODB Connected!! DB Host : ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error("MONGODB CONNECTION FAILED ::", err);
    process.exit(1);
  }
}

export default connectToDatabase;
