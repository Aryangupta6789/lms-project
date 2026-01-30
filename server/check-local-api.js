import fetch from 'node-fetch';

const checkLocalApi = async () => {
  try {
    console.log('Fetching http://localhost:5000/course/all ...');
    const res = await fetch('http://localhost:5000/course/all');
    console.log(`Status: ${res.status}`);
    const data = await res.json();
    if (data.success) {
       console.log(`Courses found: ${data.courses.length}`);
       console.log('Sample course:', data.courses[0]?.courseTitle);
    } else {
       console.log('API returned success: false', data);
    }
  } catch (err) {
    console.error('Error fetching API:', err);
  }
};

checkLocalApi();
