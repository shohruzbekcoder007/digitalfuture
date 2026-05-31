const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/journal_db';
  try {
    const conn = await mongoose.connect(uri, { autoIndex: true });
    console.log(`MongoDB ulandi: ${conn.connection.host}/${conn.connection.name}`);
  } catch (err) {
    console.error(`\n[MongoDB] ulanish xatosi: ${err.message}`);
    console.error('  → Mahalliy MongoDB ishlayotganini tekshiring (mongod / MongoDB Compass)');
    console.error(`  → Yoki .env faylida MONGO_URI ni MongoDB Atlas connection stringiga sozlang`);
    console.error(`  → Hozirgi URI: ${uri}\n`);
    process.exit(1);
  }
};

module.exports = connectDB;
