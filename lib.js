var esprima = require('esprima'),
    sprintfjs = require("sprintf"),
    sprintf = sprintfjs.sprintf;

function extract_slide_comments(ast) {
    var comments = ast["comments"];
    return comments.filter((comment) => {
        return comment["type"] == "Block" &&
            comment["value"].indexOf("slide") == 0;})
        .map((comment) => comment["value"].slice(comment["value"].indexOf("\n")));
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

module.exports = generate_slides;
