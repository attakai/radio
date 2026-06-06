import { readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  const place = body.place
  const interest = body.interest || '地名の雑学'
  const mode = body.mode || 'radio'

  if (!config.groqApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API key not configured'
    })
  }

  try {
    const res = await $fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        timeout: 60000,
        headers: {
          Authorization: `Bearer ${config.groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: {
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `
              あなたは散歩ラジオのパーソナリティです。

              ルール：
              - 口語で話す
              - 観光案内ではなく雑学
              - 2〜3分の内容
              - 少し雑で面白く
              - 地名の違和感から話を始める
              `
                          },
                          {
                            role: 'user',
                            content: `
              現在地: ${place}
              興味: ${interest}
              モード: ${mode}

              この場所についてラジオをしてください
              `
            }
          ]
        }
      }
    )
    return {
      message: res.choices[0].message.content
    }
  } catch (e: any) {
    throw createError({
      statusCode: e?.response?.status || 500,
      statusMessage: e?.message || 'AI request failed'
    })
  }
})