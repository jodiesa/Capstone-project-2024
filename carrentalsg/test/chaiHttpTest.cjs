const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

chai.use(chaiHttp);

const { expect } = chai;

// Define a function to dynamically import the ES module
async function setupApp() {
  const authRouter = await import('../api/routes/auth.route.js'); // Dynamic import of auth.route.js

  // Set up the Express app
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter.default); // Use .default for the ES module default export
  return app;
}

// Wrap tests in an async function to handle dynamic imports
describe('Basic Chai and Chai-HTTP Test', function () {
  let app;

  before(async function () {
    app = await setupApp();
  });

  it('should respond to a GET request at /api/auth with 404 (route not found)', async () => {
    const res = await chai.request(app).get('/api/auth');
    expect(res).to.have.status(404);
  });
});
