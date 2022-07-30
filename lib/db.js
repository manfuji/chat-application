import mongoose from 'mongoose';

const connection = {};
//creating connection between the database and the application
async function connect() {
  // check if the application is already connected and return
  if (connection.isConnected) {
    console.log('Already Connected');
    return;
  }
  // if the application is already connected used the prevous connection
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('Use Prevous Connection');
      return;
    }
    await mongoose.disconnect();
  }
  // connecting to the database using our uri
  const db = await mongoose.connect(process.env.MONGODB_URI);
  console.log('New Connection');
  connection.isConnected = db.connections[0].readyState;
}

// helper function to diconnect from the database
async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('Not disconnected');
    }
  }
}
// creating and exporting connect and disconnect obj

const db = { connect, disconnect };
export default db;
