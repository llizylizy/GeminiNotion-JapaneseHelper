import Cors from "cors";

// 初始化 CORS 中间件
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

// 辅助函数，用于运行 CORS 中间件
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

let fetch;

if (typeof window === "undefined") {
  fetch = (await import("node-fetch")).default;
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    const { text } = req.body;

    try {
      // 调用 Gemini API (需要替换为您的 API 密钥和端点)
      const apiKey = process.env.GEMINI_API_KEY;
      const apiEndpoint = `${process.env.GEMINI_API_ENDPOINT}&key=${apiKey}`;

      const prompt = `你是一位精通日语的老师，你的任务是分析我提供的日语句子。收到该指令和最后的日语句子后不要回复多余任何内容，直接开始分析。\n\n* 如果句子包含括号，括号内的内容表示句子使用的场景。\n* 如果句子不包含括号，请你猜测其可能的使用场景。\n\n请按照以下步骤进行分析：\n\n1. **翻译：** 将日语句子翻译成中文。\n2. **场景推测：** \n    * 如果句子包含括号，直接使用括号内的内容作为场景描述。\n    * 如果句子不包含括号，请你猜测其可能的使用场景，并进行描述。\n3. **语法分析：** \n    * 分析句子中所有使用的重点语法点，根据句子长度控制在3个左右，包括但不限于：词汇、句型、惯用语等。\n    * 对每个语法点进行详细解释，不需要标注罗马字和假名，包括意思、用法，并提供一个**新的例句**。\n\n请使用 Markdown 语法回复，确保内容美观易读。\n\n日语句子：${text}`;

      const requestBody = JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      });

      const geminiResponse = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const geminiData = await geminiResponse.json();

      res.status(200).json(geminiData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to call Gemini API" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
