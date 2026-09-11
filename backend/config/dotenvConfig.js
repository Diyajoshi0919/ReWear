import dotenv from 'dotenv';

// Load environment variables from .env file
const loadEnv = () => {
  const result = dotenv.config();

  if (result.error) {
    console.error('❌ Error loading .env file:', result.error);
    process.exit(1); // Exit if env file is missing or invalid
  } else {
    console.log('✅ .env variables loaded');
  }
};

export default loadEnv;
