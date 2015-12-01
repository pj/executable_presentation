var chai = require('chai'),
    fs = require('fs'),
    lib = require('../lib.js'),
    fixture = require('../fixture/fixture.js');

chai.should();

describe('generate slides', function(){
    var slides;

    before('process file', function(){
        var contents = fs.readFileSync('./fixture/fixture.js');
        slides = lib.generate_slides(contents);
    });

    it('create two slides', function(){
        slides.length.should.equal(5);
    });

    it('ignore comments that aren\'t slides', function(){
        slides[0].should.include('This is a slide');
        slides[1].should.include('This is another slide');
        slides[2].should.include('This is yet another slide');
        slides[3].should.include('This is another slide in the same comment');
        slides[4].should.include('This is the final slide in the same comment');
    });

    it('include code in a slide', function(){
        var code = "```javascript\n" +
            fixture.includable_function.toString() + "\n```";
        slides[1].should.include(code);
    });
});

describe('output file', function(){
    var output_file = './fixture/fixture.md';

    before('generate output', function(){
        lib.output_slides('./fixture/fixture.js', output_file);
    });

    after('clean up output', function(){
        fs.unlinkSync(output_file);
    });

    it('generate markdown file', function(){
        fs.statSync(output_file).should.be.ok;
    });
});
