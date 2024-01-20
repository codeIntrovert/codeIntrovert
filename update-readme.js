const fs = require("fs");
const fetch = require("node-fetch");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function updateReadme() {
  const apiKey = process.env.API_KEY;

  const apiEndpoint = "https://api.api-ninjas.com/v1/quotes?category=happiness";

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
    // Add this code after the data is fetched
    console.log("API Response:", JSON.stringify(data, null, 2));

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
      // Debugging: Print contents of README.md after update
      console.log(
        "Contents of README.md after update:",
        fs.readFileSync("README.md", "utf-8")
      );

      console.log("README.md updated successfully.");

      // Commit and push changes
      await exec("git config --local user.email 'action@github.com'");
      await exec("git config --local user.name 'GitHub Action'");
      await exec("git add README.md");
      await exec('git commit -m "Update README with new quote"');
      await exec("git push");
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
