var esprima = require('esprima'),
    fs = require('fs'),
    sprintfjs = require("sprintf"),
    sprintf = sprintfjs.sprintf;

function extract_slide_comments(ast) {
    var comments = ast["comments"];
    var slide_comments = comments.filter((comment) => {
        return comment["type"] == "Block" &&
            comment["value"].indexOf("slide") == 0;
        });

    var split_slide_comments = slide_comments.map(function (comment){
        return comment["value"].split(/\n----*\n/g).map((x) =>
                x.replace(/slide\n/, ""));
    });

    return split_slide_comments.reduce(
            function(prev, current){
                return prev.concat(current);
            }, []);
}

function extract_code_from_loc(node, code) {
    var start_line = node.loc.start.line;
    var end_line = node.loc.end.line;

    var lines = code.split('\n').slice(start_line-1, end_line);

    return "```javascript\n" + lines.join('\n') + "\n```";
}

function extract_function_text(ast, code) {
    var functions = {};

    ast.body.filter((node) => node["type"] == "FunctionDeclaration")
        .forEach((node) => functions[node.id.name] =
                extract_code_from_loc(node, code));

    return functions;
}

function template_slides(slides, functions) {
    return slides.map((slide) => sprintf(slide, functions));
}

function generate_slides(input) {
    var code = input.toString();
    var ast = esprima.parse(code, {comment: true, loc: true});

    // Extract slides
    var slides = extract_slide_comments(ast);

    // Extract functions
    var functions = extract_function_text(ast, code);

    // Template functions into slides
    var templated_slides = template_slides(slides, functions);

    return templated_slides;
}

function output_slides(filename, output_filename) {
    var code = fs.readFileSync(filename);
    var output = generate_slides(code).join("\n---\n");
    if (output_filename) {
        fs.writeFileSync(output_filename, output);
    } else {
        console.log(output);
    }
}
module.exports.output_slides = output_slides;
module.exports.generate_slides = generate_slides;
