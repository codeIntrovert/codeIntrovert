const fs = require("fs");
const fetch = require("node-fetch");

async function updateReadme() {
  const category = "happiness";
  const apiKey = process.env.API_KEY; // Access the API key from environment variables

  const apiEndpoint = `https://api.api-ninjas.com/v1/quotes?category=${category}`;

  try {
    const response = await fetch(apiEndpoint, {
      headers: {
        "X-Api-Key": apiKey, // Set the API key in the request headers
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();

    const quote = data.quote;
    const author = data.author;

    const readmePath = "README.md";
    let readmeContent = fs.readFileSync(readmePath, "utf-8");

    // Update README.md content with the obtained quote and author
    readmeContent = readmeContent.replace(
      /<!-- QUOTE_START -->.*<!-- QUOTE_END -->/s,
      `<!-- QUOTE_START -->\n\n"${quote}" - ${author}\n\n<!-- QUOTE_END -->`
    );

    fs.writeFileSync(readmePath, readmeContent);

    console.log("README.md updated successfully.");
  } catch (error) {
    console.error("Error updating README.md:", error.message);
    process.exit(1);
  }
}

updateReadme();
