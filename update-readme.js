const fs = require("fs");
const fetch = require("node-fetch");

async function updateReadme() {
  const apiKey = process.env.API_KEY;

  const apiEndpoint = "https://api.api-ninjas.com/v1/quotes?category=success";

  try {
    const response = await fetch(apiEndpoint, {
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the response is an array and contains at least one object
    if (Array.isArray(data) && data.length > 0) {
      const quote = data[0].quote || "No quote available";
      const author = data[0].author || "Unknown author";

      const readmePath = "README.md";
      let readmeContent = fs.readFileSync(readmePath, "utf-8");

      // Update README.md content with the obtained quote and author
      readmeContent = readmeContent.replace(
        /<!-- QUOTE_START -->.*<!-- QUOTE_END -->/s,
        `<!-- QUOTE_START -->\n\n"${quote}" - ${author}\n\n<!-- QUOTE_END -->`
      );

      fs.writeFileSync(readmePath, readmeContent);

      console.log("README.md updated successfully.");
    } else {
      console.error("API response is not in the expected format:", data);
      process.exit(1);
    }
  } catch (error) {
    console.error("Error updating README.md:", error.message);
    process.exit(1);
  }
}

updateReadme();
