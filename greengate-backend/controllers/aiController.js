const { getGeminiClient } = require("../config/gemini");
const Blog = require("../models/Blog");

/**
 * @desc Fetch and analyze featured blogs
 * @route GET /api/ai/featured-insights
 */
exports.getFeaturedBlogInsights = async (req, res) => {
  try {
    const featuredBlogs = await Blog.find({ 
      featured: true, 
      status: "published" 
    }).sort({ publishedAt: -1 });

    if (featuredBlogs.length === 0) {
      return res.status(404).json({
        success: false,
        reply: "No featured blogs were found in the database."
      });
    }

    const blogSummaries = featuredBlogs.map((blog, index) => 
      `Blog ${index + 1}: "${blog.title}"\nCategory: ${blog.category}\nExcerpt: ${blog.content.substring(0, 150)}...`
    ).join('\n\n');

    const prompt = `
      Analyze these ${featuredBlogs.length} featured blogs:
      ${blogSummaries}

      Generate a structured report with these headers:
      ## 🌟 Why these blogs are featured
      ## 📚 Thematic Summary
      ## 💡 Key Takeaways
      ## 🎯 Reading Recommendation
    `;

    const client = getGeminiClient();
    const result = await client.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are the GreenGate AI. Provide helpful insights based ONLY on the provided blogs.",
        temperature: 0.7,
      }
    });

    const analysis = result.candidates[0].content.parts[0].text;

    // Send the response using keys the frontend expects
    res.json({
      success: true,
      reply: analysis,      // Matches msg.text
      sourceData: featuredBlogs // Matches msg.blogs
    });

  } catch (error) {
    console.error("Featured AI Error:", error);
    res.status(500).json({
      success: false,
      reply: "Sorry, I encountered an error while analyzing the blogs.",
      error: error.message
    });
  }
};