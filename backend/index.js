import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB().then(() => {
    app.listen(process.env.PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})