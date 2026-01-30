import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/course.js';

dotenv.config();

const checkCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // We haven't seen the Course model yet, but usually it's exported as default or named export
    // If it fails, I'll inspect the model file.
    const count = await Course.countDocuments();
    console.log(`Course count: ${count}`);
    
    if (count === 0) {
      console.log('No courses found. Seeding needed.');
    } else {
      const courses = await Course.find().limit(2);
      console.log('Sample courses:', JSON.stringify(courses, null, 2));
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

checkCourses();
