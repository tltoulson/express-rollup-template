export { app };

import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import util from 'util';
import livereload from 'livereload';
import livereloadMiddleware from 'connect-livereload';

// __dirname patch for es6 modules
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// In development, inject livereload script in to html responses
if (process.env.NODE_ENV == 'development') {
  app.use(livereloadMiddleware({
    port: process.env.LIVERELOAD_PORT
  }));
}

loadRoutes();

async function loadDynamicRoutes(route_path) {
  try {
    // Auto load express routers
    var readdir = util.promisify(fs.readdir);
    var stat = util.promisify(fs.stat);
    var files = await readdir(route_path);
    var filepath;
    var fileinfo;
    var module;

    for (let i = 0; i < files.length; i++) {
      filepath = route_path + '/' + files[i];
      fileinfo = await stat(filepath);

      if (fileinfo.isDirectory()) {
        await loadDynamicRoutes(filepath);
      }
      else {
        module = await import(filepath);

        if (module.router) {
          console.info('Loading route: ' + filepath);
          app.use('/', module.router);
        }
      }
    }

    return Promise.resolve();
  }
  catch(err) {
    Promise.reject(err);
  }
}

async function loadRoutes() {
  await loadDynamicRoutes(__dirname + "/api");

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
  });
}

// In development, enable livereload when changes are made
if (process.env.NODE_ENV == 'development') {
  let reloadServer = livereload.createServer({
    'port': process.env.LIVERELOAD_PORT
  });

  let watchPaths = [
    __dirname + '/public',
    __dirname + '/api'
  ]
  
  reloadServer.watch(watchPaths);

  reloadServer.server.once('connection', function() {
    setTimeout(function() {
      reloadServer.refresh("/");
    }, 100);
  });
}

import { watch } from 'rollup';
import rollupConfig from './rollup.config.js';

if (process.env.NODE_ENV == 'development') {
  async function startRollup() {
    for (const optionsObj of rollupConfig) {
      watch(optionsObj);
    }
  }

  startRollup();
}