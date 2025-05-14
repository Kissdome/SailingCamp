const https = require("https");
const fs = require("fs");
const path = require("path");

const images = [
    {
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
        filename: "sarah.jpg",
    },
    {
        url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80",
        filename: "mike.jpg",
    },
    {
        url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
        filename: "emma.jpg",
    },
];

const downloadImage = (url, filename) => {
    return new Promise((resolve, reject) => {
        const filepath = path.join(__dirname, "../../public/images/instructors", filename);

        https
            .get(url, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
                    return;
                }

                const fileStream = fs.createWriteStream(filepath);
                response.pipe(fileStream);

                fileStream.on("finish", () => {
                    fileStream.close();
                    console.log(`Downloaded ${filename}`);
                    resolve();
                });
            })
            .on("error", (err) => {
                reject(err);
            });
    });
};

const downloadAllImages = async () => {
    try {
        // Create directory if it doesn't exist
        const dir = path.join(__dirname, "../../public/images/instructors");
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Download all images
        for (const image of images) {
            await downloadImage(image.url, image.filename);
        }

        console.log("All images downloaded successfully!");
    } catch (error) {
        console.error("Error downloading images:", error);
        process.exit(1);
    }
};

downloadAllImages();
