module.exports = function (grunt) {

  const request = require('request');
  const fs = require('fs');
  const log = console;
  const TASK_FAILED = 3;
  require('dotenv').config();

  grunt.loadNpmTasks('grunt-replace');
  grunt.initConfig({
    replace: {
      comments: {
        options: {
          patterns: [
            {
              /* Comment imports for node during dev */
              match: /--BEGIN COMMENT--[\s\S]*?--END COMMENT--/g,
              replacement: 'Dev environment code block removed by build'
            },
            {
              /* Uncomment preamble for production to process the request */
              match: /\/\/\//mg,
              replacement: ''
            }
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['src/worker.ts'], dest: 'build/' }
        ]
      },
      exports: {
        //remove the exports line that typescript includes without an option to
        //suppress, but is not in the v8 env that workers run in.
        options: {
          patterns: [
            {
              match: /exports.__esModule = true;/g,
              replacement: "// exports line commented by build"
            }
          ]
        },
        files: [
          { expand: true, flatten: true, src: ['build/worker.js'], dest: 'build/' }
        ]
      }
    }
  });

  grunt.registerTask('prepare-typescript', 'replace:comments');
  grunt.registerTask('fix-export', 'replace:exports');

  grunt.registerTask('upload-worker', 'Uploads workers to Cloudflare', function(path) {

    const done = this.async();
    const conf = readConfig();
    path = path || grunt.option('path') || process.env.CF_WORKER_PATH;
    if (!path) {
      fail("path is required");
    }
    if (!fs.existsSync(path)) {
      fail(`path not found ${path}`);
    }

    let script = fs.readFileSync(path);
    log.info("Uploading...");
    let url = `https://api.cloudflare.com/client/v4/zones/${conf.zoneId}/workers/script`;
    let options = {
      url: url,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/javascript'
      },
      body: script
    };
    invokeApi(options, conf, done);
  });

  function invokeApi(options, conf, done) {

    // Add authentication to the request
    options.headers = options.headers || {};
    Object.assign(options.headers, {
      'X-Auth-Email': conf.email,
      'X-Auth-Key': conf.apiKey,
    });

    request(options, function(error, response) {
      try {
        if (error) {
          log.error(error);
          fail(`API failure ${response.statusCode} error: ${error}`);
          done();
          return;
        }
        let body = JSON.parse(response.body);
        if (body) {
          logResult(body);
        }
        done();
      } catch (e) {
        fail(`Unhandled error. ${e}`);
        done();
      }
    });
  }

  function logResult(body) {
    body.success ? log.error("Status: Success") : log.error("Status: Failed");
    let errors = body.errors || [];
    if (errors) {
      log.info(` Errors: ${errors.length}`);
      for (let e of errors) {
        log.error(` Code: ${e.code} Message: ${e.message}`);
      }
    }
    let messages = body.messages || [];
    if (messages) {
      log.info(` Messages ${messages.length}`);
      for (let msg of messages) {
        log.info(` ${msg}`);
      }
    }
    let result = body.result;
    log.info(" Result");
    log.info(` ${JSON.stringify(result, null, 2)}`);
  }

  function readConfig() {
    let zoneId = grunt.option('zoneId') || process.env.CF_WORKER_ZONE_ID;
    let email = grunt.option('email') || process.env.CF_WORKER_EMAIL;
    let apiKey = grunt.option('apiKey') || process.env.CF_WORKER_AUTH_KEY;

    log.debug("zoneID: " + zoneId);
    log.debug("email: " + email);
    log.debug("apiKey: " + "*".repeat(apiKey.length));

    if (!zoneId || !email || !apiKey) {
      fail("zone id, cloudflare email and api key are required");
    }
    return {
      zoneId: zoneId,
      email: email,
      apiKey: apiKey
    }
  }

  function fail(message) {
    grunt.fail.fatal(message, TASK_FAILED);
  }
};
