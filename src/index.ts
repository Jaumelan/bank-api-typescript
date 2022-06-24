import { app } from "./server";
import { config } from "./config";

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
