var chai = require('chai'),
    fs = require('fs'),
    generate_slides = require('../lib.js'),
    fixture = require('../fixture/fixture.js');

chai.should();

describe('generate slides', function(){
    var slides;

    before('process file', function(){
        var contents = fs.readFileSync('./fixture/fixture.js');
        slides = generate_slides(contents);
    });

    it('create two slides', function(){
        slides.length.should.equal(2);
    });

    it('ignore comments that aren\'t slides', function(){
        slides[0].should.include('This is a slide');
        slides[1].should.include('This is another slide');
    });

    it('include code in a slide', function(){
        var code = "```javascript\n" +
            fixture.includable_function.toString() + "\n```";
        slides[1].should.include(code);
    });
});
