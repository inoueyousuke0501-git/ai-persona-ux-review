const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 4173);
const root = path.join(__dirname, "prototype");

const server = http.createServer((req, res) => {
  const requestedPath = req.url === "/" ? "/index.html" : req.url || "/index.html";
  const filePath = path.normalize(path.join(root, requestedPath));

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not Found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": filePath.endsWith(".html") ? "text/html; charset=utf-8" : "application/octet-stream"
    });
    res.end(data);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`AI Persona UX Review prototype: http://127.0.0.1:${port}`);
});
