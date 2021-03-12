const express = require("express")

const server = express()

server.all("/", (req, res) => {
  res.send("O Bot está funcionando!")
})

function keepAlive() {
  server.listen(3000, () => {
    console.log("O servidor está pronto.")
  })
}

module.exports = keepAlive