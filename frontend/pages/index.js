import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button, TextField, Container, Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import remarkGfm from 'remark-gfm';

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [apiResponse, setApiResponse] = useState(null);
  const [notionSaved, setNotionSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const theme = useTheme();

  const handleSearch = async () => {
    setLoading(true);
    setApiResponse(null); //  Clear previous response
    setNotionSaved(false); // Reset notionSaved state

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
      setApiResponse(data);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setApiResponse({ error: "Failed to call Gemini API" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToNotion = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: apiResponse.candidates[0].content.parts[0].text,
          inputText: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setNotionSaved(true);
    } catch (error) {
      console.error("Error saving to Notion:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <h1>日语语法分析</h1>
        <TextField
          label="请输入日语句子"
          variant="outlined"
          fullWidth
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown} //  Add the onKeyDown event listener
          margin="normal"
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button variant="contained" color="primary" onClick={handleSearch} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "搜索"}
          </Button>
          {apiResponse && apiResponse.candidates && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSaveToNotion}
                disabled={notionSaved || saving}
              >
                {saving ? <CircularProgress size={24} /> : "保存到 Notion"}
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
          )}
        </Box>
        {apiResponse && apiResponse.candidates && (
          <Box mt={2}>
            <Typography variant="h6">分析结果：</Typography>
            <ReactMarkdown
              children={apiResponse.candidates[0].content.parts[0].text}
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
