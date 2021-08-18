export { router };

import { Router } from 'express';
var router = Router();

/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send({ 'message': 'Hello Bob' });
});