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

      const prompt = `你是一位精通日语的助手，你的任务是分析我提供的日语句子。收到该指令和最后的日语句子后不要回复多余任何内容，直接开始分析。

* 根据句子复杂程度，给出1至3个场景推测和2至5个语法解析。
* 不需要标注假名和罗马音。
* 请用中文回答。
* 语法解析要选取句子中比较难的语法。



请按照以下步骤进行分析：

### **翻译：**

[此处翻译原文句子]

***

### **场景推测：**

这句话主要用于**[描述某某场景]**，可能出现在以下场景中：

1.  **[场景一（例如：政治评论或新闻报道）]：**

    *   [场景详细说明（例如：讨论某个**政策、立场或民意的稳定性**，即便选举已经结束，这一立场仍未改变。）]

2.  **[场景二]：**

    *   [场景详细说明]

3.  **[场景三]：**

    *   [场景详细说明]

***

### **语法解析：**

1.  **[语法一（例如：「〜以降（いこう）」）]**

    *   **意思：** [语法解释（例如：表示"**在……之后**"或"**自……以来**"。）]
    *   **用法：** [用法解释（例如：主要用于时间表达，强调某件事发生后的时间段。）]
    *   **例句：**

        *   **[使用语法提供一个例句1（例如：「卒業以降、一度も先生に会っていない。」）]**
            [例句1的翻译（例如：（自从毕业后，就再也没有见过老师。）]

        *   **[使用语法提供一个例句2]**
            [例句2的翻译]

3.  **[语法二]**

    *   **意思：** [语法解释]
    *   **用法：** [用法解释]
    *   **例句：**

        *   **[使用语法提供一个例句1]**
            [例句1的翻译]

        *   **[使用语法提供一个例句2]**
            [例句2的翻译]

3.  **[语法三]**

    *   **意思：** [语法解释]
    *   **用法：** [用法解释]
    *   **例句：**

        *   **[使用语法提供一个例句1]**
            [例句1的翻译]

        *   **[使用语法提供一个例句2]**
            [例句2的翻译]

***

### **拓展例句：**

*   **[使用语法一造一句比较难的句子（例如：「衆議院選挙以降も、支持率は今の所安定している。」）]**
    [句子翻译（例如：（即使在众议院选举之后，目前支持率仍然稳定。）]

*   **[使用语法二造一句比较难的句子]**
    [句子翻译]

*   **[使用语法三造一句比较难的句子]**
    [句子翻译]

日语句子：${text}`;

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
