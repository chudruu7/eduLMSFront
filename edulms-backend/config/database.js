import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log('MongoDB холболт эхэллээ...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Байна' : 'Байхгүй');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`✅ MongoDB холбогдлоо: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ MongoDB холболтын алдаа:', error.message);
    console.error('Алдааны дэлгэрэнгүй:', error);
    process.exit(1);
  }
};

export default connectDB;