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

    const quote = data.quote || "No quote available";
    const author = data.author || "Unknown author";

    //Checking API response
    console.log("API Response:", JSON.stringify(data, null, 2));

    // Debugging: Print current working directory
    console.log("Current working directory:", process.cwd());

    // Debugging: Print contents of README.md
    console.log(
      "Contents of README.md before update:",
      fs.readFileSync("README.md", "utf-8")
    );

    const readmePath = "README.md";
    let readmeContent = fs.readFileSync(readmePath, "utf-8");

    // Update README.md content with the obtained quote and author
    readmeContent = readmeContent.replace(
      /<!-- QUOTE_START -->.*<!-- QUOTE_END -->/s,
      `<!-- QUOTE_START -->\n\n"${quote}" - ${author}\n\n<!-- QUOTE_END -->`
    );

    fs.writeFileSync(readmePath, readmeContent);

    // Debugging: Print contents of README.md after update
    console.log(
      "Contents of README.md after update:",
      fs.readFileSync("README.md", "utf-8")
    );

    console.log("README.md updated successfully.");
  } catch (error) {
    console.error("Error updating README.md:", error.message);
    process.exit(1);
  }
}

updateReadme();
