import mongoose from 'mongoose';
import Product from '../src/models/Product'; // đường dẫn tới file Product model

const MONGO_URI = 'mongodb+srv://buinguyenminhquan84_db_user:123456Asd%40@quandz.ajm2v6t.mongodb.net/ecommerceDB?retryWrites=true&w=majority&appName=QuanDz'; // đổi tên DB nếu cần

const updateStatus = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find();
  for (const prod of products) {
    let status: 'Active' | 'Inactive' | 'Out of Stock';

    if (!prod.isActive) status = 'Inactive';
    else if (prod.stock <= 0) status = 'Out of Stock';
    else status = 'Active';

    await Product.updateOne({ _id: prod._id }, { $set: { status } });
    console.log(`Updated product ${prod.legacyId} with status: ${status}`);
  }

  console.log('All products updated!');
  await mongoose.disconnect();
};

updateStatus().catch(err => console.error(err));
