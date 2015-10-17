#!/usr/bin/env node --harmony
var program = require('commander'),
    fs = require('fs'),
    chokidar = require('chokidar'),
    lib = require('./lib.js'),
    input_filename,
    output_filename;

program
    .option("-w, --watch", "Watch for changes")
    .arguments('<filename> [output_filename]')
    .action(function(input, output){
        input_filename = input;
        output_filename = output;
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
}

program.parse(process.argv);

if (program.watch) {
    var watcher = chokidar.watch(input_filename, { persistent: true });

    watcher.on('change', function (path) {
        lib.output_slides(input_filename, output_filename);
        console.log("Generated:", input_filename, ">", output_filename);
    });
} else {
    lib.output_slides(input_filename, output_filename);
}
