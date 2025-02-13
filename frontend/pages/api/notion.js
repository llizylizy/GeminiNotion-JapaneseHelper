import { Client } from "@notionhq/client";
import Cors from "cors";
import { markdownToBlocks } from "@tryfabric/martian";

// 初始化 CORS 中间件
const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
  origin: '*',
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

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    const { data, inputText } = req.body;

    try {
      const now = new Date().toISOString();

      // 使用 martian 将 Markdown 转换为 Notion 块
      const blocks = markdownToBlocks(data);

      const response = await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_ID,
        },
        properties: {
          例句: {
            title: [
              {
                text: {
                  content: inputText,
                },
              },
            ],
          },
          来源: {
            rich_text: [
              {
                text: {
                  content: "Gemini API",
                },
              },
            ],
          },
          创建时间: {
            date: {
              start: now,
            },
          },
        },
        children: blocks,
      });

      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save to Notion" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
