const fetch = require("node-fetch");
const fs = require("fs");

async function updateCatImage() {
  try {
    // Fetch new cat image URL from the API
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await response.json();

    if (response.ok && data && data[0] && data[0].url) {
      const newImageUrl = data[0].url;

      // Read the current content of the README file
      let readmeContent = fs.readFileSync("README.md", "utf-8");

      // Replace the existing image URL with the new one
      const regex =
        /<!-- Dynamic Cat Image - DO NOT REMOVE THIS COMMENT -->\s*<img src=".*?" alt=".*?" width="300" height="300">/;

      readmeContent = readmeContent.replace(
        regex,
        `<img src="${newImageUrl}" alt="Random Cat Pic" width="300" height="300">`
      );

      // Write the updated content back to the README file
      fs.writeFileSync("README.md", readmeContent, "utf-8");

      console.log("Cat image updated successfully.");
    } else {
      console.error(
        "Failed to fetch cat image:",
        data.error || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Error updating cat image:", error);
  }
}

// Call the function to update the cat image
updateCatImage();
