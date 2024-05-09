import { expect } from 'chai';

// import { inspect } from 'util';
import { loadScript, saveScript } from '../src/narration-script';

describe('narration-script', () => {
  it('should be able to load and save sample script', async () => {
    const script = await loadScript('test/fixtures/script1.yml');
    expect(script).to.be.not.null;
    // console.log(inspect(script, false, 8, true));
    const chapter2 = script.getChapterByKey('chapter2');
    expect(chapter2).to.exist;
    expect(script.getChapterByKey('no such chapter')).to.be.undefined;
    const chapter2section2 = chapter2!.getSectionByKey('section 2 of chapter 2');
    expect(chapter2section2!.paragraphs[1].text).to.eq('single line text');
    expect(chapter2section2!.paragraphs[2].text).to.eq('First line.\n\n\n\nSecond line.\n  Third line has two speces indent.');
    script.scriptFilePath = script.scriptFilePath.replace('.yml', '.saved.yml');
    await saveScript(script);
    const savedScript = await loadScript(script.scriptFilePath);
    expect(savedScript.export()).to.eql(script.export());
  });
});
