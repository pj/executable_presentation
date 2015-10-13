#!/usr/bin/env node --harmony
/*
 * preprocessor.js
 * Copyright (C) 2015 pauljohnson <pauljohnson@Paul-Johnsons-MacBook-Pro.local>
 *
 * Distributed under terms of the MIT license.
 */

var program = require('commander'),
    fs = require('fs'),
    generate_slides = require('./lib.js');

program
    .arguments('<filename> [output_filename]')
    .action(function(filename, output_filename){
        var code = fs.readFileSync(filename);
        var output = generate_slides(code).join("\n---\n");
        if (output_filename) {
            fs.writeFileSync(output_filename, output);
        } else {
            console.log(output);
        }
    });

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit();
}

program.parse(process.argv);
