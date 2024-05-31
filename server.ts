import app from "./app"
import { config } from "./src/config/config"

const startServer = () => {
   const port = config.port
    app.listen(port, () => {
        console.log(`Listening on port : ${port}`)
    })
}
startServer()