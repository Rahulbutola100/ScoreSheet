
  console.error(err);
  res.status(500).json({ error: "Unexpected server error." });
});

app.listen(PORT, () => {
  console.log(`Resume Matcher server running on http://localhost:${PORT}`);
});