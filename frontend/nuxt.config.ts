export default {
  ssr: true,
  runtimeConfig: {
    // Server-only API key for AI provider. Set this in Vercel env: OPENAI_API_KEY
    groqApiKey: process.env.GROQ_API_KEY || '',
    public: {}
  },
  app: {
    head: {
      title: 'aisanpo-frontend'
    }
  }
} as any
