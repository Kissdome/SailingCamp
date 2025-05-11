const mongoose = require("mongoose");

async function testConnection() {
    try {
        await mongoose.connect("mongodb://localhost:27017/sailing-camps");
        console.log("Successfully connected to MongoDB!");

        // Create a test document
        const TestModel = mongoose.model("Test", new mongoose.Schema({ name: String }));
        const testDoc = new TestModel({ name: "test" });
        await testDoc.save();
        console.log("Successfully created test document!");

        // Clean up
        await TestModel.deleteOne({ name: "test" });
        console.log("Successfully cleaned up test document!");

        await mongoose.connection.close();
        console.log("Database connection closed.");
    } catch (error) {
        console.error("Error:", error);
    }
}

testConnection();
