export { router };

import { Router } from 'express';
var router = Router();

const view = /*html*/`
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Dev Server</title>
            <script src="bundle.js"></script>
        </head>
        <body>
            <h1>Hello World</h1>
        </body>
    </html>
`;

/* GET homepage */
router.get('/', function(req, res, next) {
  res.send(view);
});