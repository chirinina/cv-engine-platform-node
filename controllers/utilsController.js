const { getLinkPreview } = require("link-preview-js");

exports.getLinkPreviewData = async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    const data = await getLinkPreview(url, {
      imagesPropertyType: "og", // fetches only open graph images
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    res.json(data);
  } catch (err) {
    console.error("Link preview error:", err.message);
    res.status(500).json({ error: "Could not fetch link preview" });
  }
};
