import 'dotenv/config';

export default {
  expo: {
    name: "PrimeFit",
    slug: "primefit",
    version: "1.0.0",
    extra: {
      API_URL: process.env.API_URL,
    },
  },
};
