import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { expect } from 'chai';
dotenv.config({ path: '.env.test' }); // Load .env.test file



function isMongooseConnected() {
  const status = mongoose.connection.readyState;
  switch (status) {
    case 0:
      console.log("Mongoose is disconnected.");
      break;
    case 1:
      console.log("Mongoose is connected.");
      break;
    case 2:
      console.log("Mongoose is connecting...");
      break;
    case 3:
      console.log("Mongoose is disconnecting...");
      break;
    default:
      console.log("Unknown Mongoose connection status.");
  }
  return status === 1; // Returns true if connected, false otherwise
}

describe('Mongoose Connection', () => {
  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Check connection status
    const connected = isMongooseConnected();
    if (!connected) {
      throw new Error("Mongoose failed to connect.");
    }
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should be connected to MongoDB', () => {
    expect(mongoose.connection.readyState).to.equal(1);
  });
});
