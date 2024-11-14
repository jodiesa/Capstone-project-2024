const mongoose = require('mongoose');
const dotenv = require('dotenv');
const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

dotenv.config({ path: '.env.test' }); // Load .env.test file

chai.use(chaiHttp);
const { expect } = chai;

// Dynamically import ES modules
let User, authRouter;

// Set up the Express app with imported routes
async function setupApp() {
  // Dynamic import of ES modules
  User = (await import('../api/models/user.model.js')).default;
  authRouter = (await import('../api/routes/auth.route.js')).default;

  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
  return app;
}

// Helper function to check MongoDB connection
function isMongooseConnected() {
  const status = mongoose.connection.readyState;
  const connectionStatus = [
    "Mongoose is disconnected.",
    "Mongoose is connected.",
    "Mongoose is connecting...",
    "Mongoose is disconnecting...",
  ];
  console.log(connectionStatus[status] || "Unknown Mongoose connection status.");
  return status === 1;
}

describe('User Signup and Mongoose Connection', function () {
  this.timeout(30000); // Increase Mocha timeout for the suite
  let app;

  // Connect to MongoDB, verify connection, and set up the app
  before(async () => {
    app = await setupApp();

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const connected = isMongooseConnected();
    if (!connected) {
      throw new Error("Mongoose failed to connect.");
    }

    await User.deleteMany({}); // Clean up the User collection before tests
  });

  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it('should be connected to MongoDB', () => {
    expect(mongoose.connection.readyState).to.equal(1);
  });

  it('should create a new user with valid input', async () => {
    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res).to.have.status(201);
    expect(res.body).to.equal('User created successfully!');
  });

  it('should fail to create a user account with missing fields', async () => {
    const res = await chai.request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        password: 'password123'

        // Missing email
      });
    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error').that.equals('email is required');
  });

  // Add other test cases here...
});
