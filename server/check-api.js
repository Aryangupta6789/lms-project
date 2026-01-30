import fetch from 'node-fetch';

const checkApi = async () => {
  try {
    const res = await fetch('https://lms-backend-self-theta.vercel.app/course/all');
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching API:', err);
  }
};

checkApi();
