import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button, TextField, Container, Box, Typography } from "@mui/material";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [notionSaved, setNotionSaved] = useState(false);

  const handleSearch = async () => {
    setNotionSaved(false);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // 提取 Gemini API 返回的文本
      const geminiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      setApiResponse(geminiText);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle error appropriately (e.g., display an error message)
    }
  };

  const handleSaveToNotion = async () => {
    try {
      const response = await fetch("/api/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: apiResponse, inputText: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const notionData = await response.json();
      console.log("Saved to Notion:", notionData);
      setNotionSaved(true);
      // Optionally display a success message to the user
    } catch (error) {
      console.error("Error saving to Notion:", error);
      // Handle error appropriately (e.g., display an error message)
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <h1>日语语法分析</h1>
        <TextField
          label="请输入日语文本"
          variant="outlined"
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          搜索
        </Button>

        {apiResponse && (
          <Box sx={{ mt: 4 }}>
            <h2>结果</h2>
            <ReactMarkdown>{apiResponse}</ReactMarkdown>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveToNotion}
                disabled={notionSaved}
              >
                保存到 Notion
              </Button>
              {notionSaved && (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ ml: 1 }}
                >
                  已保存
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}
