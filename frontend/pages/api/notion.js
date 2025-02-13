import { Client } from "@notionhq/client";
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

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

function markdownToRichText(markdown) {
  const richText = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    if (line.startsWith("# ")) {
      // H1
      richText.push({
        type: "text",
        text: {
          content: line.substring(2),
        },
        annotations: {
          bold: true,
        },
      });
      richText.push({
        type: "text",
        text: {
          content: "\n",
        },
      });
    } else if (line.startsWith("## ")) {
      // H2
      richText.push({
        type: "text",
        text: {
          content: line.substring(3),
        },
        annotations: {
          bold: true,
          italic: true,
        },
      });
      richText.push({
        type: "text",
        text: {
          content: "\n",
        },
      });
    } else if (line.startsWith("### ")) {
      // H3
      richText.push({
        type: "text",
        text: {
          content: line.substring(4),
        },
        annotations: {
          bold: true,
          italic: true,
          underline: true,
        },
      });
      richText.push({
        type: "text",
        text: {
          content: "\n",
        },
      });
    } else if (line.startsWith("- ")) {
      // Bulleted list item
      richText.push({
        type: "text",
        text: {
          content: "• " + line.substring(2),
        },
      });
      richText.push({
        type: "text",
        text: {
          content: "\n",
        },
      });
    } else if (line.match(/^\d+\.\s/)) {
      // Numbered list item
      richText.push({
        type: "text",
        text: {
          content:
            line.substring(0, line.indexOf(".") + 1) +
            " " +
            line.substring(line.indexOf(".") + 2),
        },
      });
      richText.push({
        type: "text",
        text: {
          content: "\n",
        },
      });
    } else {
      // Paragraph
      richText.push({
        type: "text",
        text: {
          content: line,
        },
      });
      richText.push({
        type: "text",
        text: {
          content: "\n",
        },
      });
    }
  }

  return richText;
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    const { data, inputText } = req.body; // 接收 inputText

    try {
      const now = new Date().toISOString(); // 获取当前时间

      // 将 Markdown 转换为 Rich Text
      const richText = markdownToRichText(data);

      const response = await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_ID,
        },
        properties: {
          例句: {
            title: [
              {
                text: {
                  content: inputText, // 使用 inputText 作为标题
                },
              },
            ],
          },
          来源: {
            // 新增 "来源" 字段
            rich_text: [
              {
                text: {
                  content: "Gemini API",
                },
              },
            ],
          },
          创建时间: {
            // 新增 "创建时间" 字段
            date: {
              start: now,
            },
          },
        },
        children: [
          {
            object: "block",
            type: "paragraph",
            paragraph: {
              rich_text: richText,
            },
          },
        ],
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
