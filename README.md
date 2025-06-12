# tts-narrator

Generate narration with Text-To-Speech technology.
_Please note that you need to have an Azure TTS subscription key._

[![Version](https://img.shields.io/npm/v/tts-narrator.svg)](https://npmjs.org/package/tts-narrator)
[![Downloads/week](https://img.shields.io/npm/dw/tts-narrator.svg)](https://npmjs.org/package/tts-narrator)
[![CI](https://github.com/james-hu/tts-narrator/actions/workflows/ci.yml/badge.svg)](https://github.com/james-hu/tts-narrator/actions/workflows/ci.yml)

The input is a script file in YAML format.
Example script files can be found under [test/fixtures](test/fixtures).

The script file is structured in this way:

* `settings`: script settings
  * `voice`: voice settings at script level
* `chapters`: array of chapter
  * each chapter can contain settings and multiple sections:
    * `settings`: chapter level voice settings that can override script level voice settings
    * `sections`: array of sections
      * each section can contain settings and multiple paragraphs:
        * `settings`: section level voice settings that can override upper level voice settings
        * `paragraphs`: array of paragraphs
          * each paragraph can contain settings and text:
            * `settings`: paragraph level voice settings that can override upper level voice settings
            * `text`: text content that needs to be converted into audio
            * `ssml`: SSML content that needs to be converted into audio

The `text` field of a paragraph can only be pure text, any XML tags will be escaped. Multi-line strings are supported.

The `ssml` field of a paragraph can be full or partial SSML fragment. Multi-line strings are supported.
When it is present, the `text` field will be ignored.

It has command line flags `--play` and `--no-play` to control whether generated MP3s should be played back.
This feature is supported by a dev dependency [node-speaker](https://www.npmjs.com/package/speaker).
If you use it as a library in your project, and would like to have the play back capability, you need to install [node-speaker](https://www.npmjs.com/package/speaker) as a dependency in your project.

When running on MacOS, to avoid `illegal hardware instruction` issue, try `npm i speaker --mpg123-backend=openal`

# CLI

To use the CLI as an NPM package, you need to install it with all its optional dependencies, like this:

```shell
npm i -g --include=optional tts-narrator
```

<!-- help start -->
```
USAGE
  $ tts-narrator   FILE [-h] [-v] [-d] [-s azure] [-k <value>]
    [--subscription-key-env <value>] [-r <value>] [-f <value>] [-p] [-i] [-o]
    [--dry-run] [--ssml | -q] [--chapters <value>] [--sections <value>]

ARGUMENTS
  FILE  path to the script file (.yml)

FLAGS
  -d, --debug                         output debug information
  -f, --outputFormat=<value>          [default: 3] Output format for audio
  -h, --help                          Show help
  -i, --interactive                   wait for key press before entering each
                                      section
  -k, --subscription-key=<value>      Azure Speech service subscription key
  -o, --overwrite                     always overwrite previously generated
                                      audio files
  -p, --[no-]play                     play generated audio
  -q, --quiet                         output warn and error information only
  -r, --region=<value>                Region of the text-to-speech service
  -s, --service=<option>              text-to-speech service to use
                                      <options: azure>
  -v, --version                       Show CLI version
      --chapters=<value>              list of chapters to process, examples:
                                      "1-10,13,15", "4-"
      --dry-run                       don't try to generate or play audio
      --sections=<value>              list of sections to process, examples:
                                      "1-10,13,15", "5-"
      --ssml                          display generated SSML
      --subscription-key-env=<value>  Name of the environment variable that
                                      holds the subscription key

DESCRIPTION
  Generate narration with Text-To-Speech technology

EXAMPLES
  $ tts-narrator myscript.yml --play --interactive --service azure --subscription-key-env TTS_SUBSCRIPTION_KEY --region australiaeast

  $ tts-narrator ./test/fixtures/script3.yml -s azure --ssml -r australiaeast --subscription-key-env=TTS_SUB_KEY  --no-play --interactive -d

  $ tts-narrator ./test/fixtures/script3.yml -s azure -r australiaeast --subscription-key-env=TTS_SUB_KEY --quiet

  $ tts-narrator ./test/fixtures/script3.yml
```

<!-- help end -->

# API

To use the NPM package as a dependency, you just need to install it normally, like this:

```shell
npm i tts-narrator
```

Example:

```typescript
const ttsService = new AzureTtsService(...);
const ttsNarrator = new TtsNarrator(ttsService, './output-folder');
const script = await loadScript('./my-script.yml');
await ttsNarrator.narrate(script);
console.log(`One of the generated audio file is: ${script.chapters[0].sections[0].paragraphs[0].audioFilePath}`);
```

<!-- API start -->
<a name="readmemd"></a>

## tts-narrator

### Modules

- [audio-utils](#modulesaudio_utilsmd)
- [azure-tts-service](#modulesazure_tts_servicemd)
- [index](#modulesindexmd)
- [narration-script](#modulesnarration_scriptmd)
- [script-processor](#modulesscript_processormd)
- [script-processor-flags](#modulesscript_processor_flagsmd)
- [tts-narrator](#modulestts_narratormd)
- [tts-narrator-cli](#modulestts_narrator_climd)
- [tts-service](#modulestts_servicemd)

## Classes


<a name="classesazure_tts_serviceazurettsservicemd"></a>

### Class: AzureTtsService

[azure-tts-service](#modulesazure_tts_servicemd).AzureTtsService

#### Hierarchy

- [`BaseTtsService`](#classestts_servicebasettsservicemd)

  ↳ **`AzureTtsService`**

#### Constructors

##### constructor

• **new AzureTtsService**(`options?`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Omit`\<[`AzureAudioGenerationOptions`](#interfacesazure_tts_serviceazureaudiogenerationoptionsmd), ``"outputFilePath"``\> |

###### Overrides

[BaseTtsService](#classestts_servicebasettsservicemd).[constructor](#constructor)

#### Properties

| Property | Description |
| --- | --- |
| `Protected` `Optional` **options**: `Omit`\<[`AzureAudioGenerationOptions`](#interfacesazure_tts_serviceazureaudiogenerationoptionsmd), ``"outputFilePath"``\> |  |


#### Methods

##### buildMsttsExpressAsStartTag

▸ `Protected` **buildMsttsExpressAsStartTag**(`msttsExpressAsSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `msttsExpressAsSettings` | `Object` |
| `msttsExpressAsSettings.role?` | `string` |
| `msttsExpressAsSettings.style?` | `string` |
| `msttsExpressAsSettings.styleDegree?` | `string` |

###### Returns

`string`

###### Inherited from

[BaseTtsService](#classestts_servicebasettsservicemd).[buildMsttsExpressAsStartTag](#buildmsttsexpressasstarttag)

___

##### buildProsodyStartTag

▸ `Protected` **buildProsodyStartTag**(`prosodySettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `prosodySettings` | `Object` |
| `prosodySettings.pitch?` | `string` |
| `prosodySettings.rate?` | `string` |
| `prosodySettings.volume?` | `string` |

###### Returns

`string`

###### Inherited from

[BaseTtsService](#classestts_servicebasettsservicemd).[buildProsodyStartTag](#buildprosodystarttag)

___

##### buildSpeakStartTag

▸ `Protected` **buildSpeakStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |

###### Returns

`string`

###### Overrides

[BaseTtsService](#classestts_servicebasettsservicemd).[buildSpeakStartTag](#buildspeakstarttag)

___

##### buildVoiceStartTag

▸ `Protected` **buildVoiceStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |

###### Returns

`string`

###### Inherited from

[BaseTtsService](#classestts_servicebasettsservicemd).[buildVoiceStartTag](#buildvoicestarttag)

___

##### generateAudio

▸ **generateAudio**(`ssml`, `options`): `Promise`\<`any`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssml` | `string` |
| `options` | [`AzureAudioGenerationOptions`](#interfacesazure_tts_serviceazureaudiogenerationoptionsmd) \| `Pick`\<[`AzureAudioGenerationOptions`](#interfacesazure_tts_serviceazureaudiogenerationoptionsmd), ``"outputFilePath"``\> |

###### Returns

`Promise`\<`any`\>

###### Overrides

[BaseTtsService](#classestts_servicebasettsservicemd).[generateAudio](#generateaudio)

___

##### generateSSML

▸ **generateSSML**(`paragraph`): `Promise`\<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`Promise`\<`string`\>

###### Inherited from

[BaseTtsService](#classestts_servicebasettsservicemd).[generateSSML](#generatessml)

___

##### generateSsmlWithoutValidation

▸ `Protected` **generateSsmlWithoutValidation**(`paragraph`): `Object`

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `lineOffset` | `number` |
| `ssml` | `string` |

###### Inherited from

[BaseTtsService](#classestts_servicebasettsservicemd).[generateSsmlWithoutValidation](#generatessmlwithoutvalidation)

___

##### validateXML

▸ `Protected` **validateXML**(`xml`, `lineOffset`): `void`

###### Parameters

| Name | Type |
| :------ | :------ |
| `xml` | `string` |
| `lineOffset` | `number` |

###### Returns

`void`

###### Inherited from

[BaseTtsService](#classestts_servicebasettsservicemd).[validateXML](#validatexml)


<a name="classesnarration_scriptnarrationchaptermd"></a>

### Class: NarrationChapter

[narration-script](#modulesnarration_scriptmd).NarrationChapter

#### Implements

- [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd)

#### Constructors

##### constructor

• **new NarrationChapter**(`chapter`, `index`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `chapter` | [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd) |
| `index` | `number` |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

#### Properties

| Property | Description |
| --- | --- |
| `Protected` **chapter**: [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd) |  |
| **index**: `number` |  |
| **script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |  |
| **sections**: [`NarrationSection`](#classesnarration_scriptnarrationsectionmd)[] | Implementation of<br><br>[Chapter](#interfacesnarration_scriptnarrationscriptfilechaptermd).[sections](#sections) |


#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Chapter](#interfacesnarration_scriptnarrationscriptfilechaptermd).[key](#key)

___

##### settings

• `get` **settings**(): [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)

###### Returns

[`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)

###### Implementation of

[Chapter](#interfacesnarration_scriptnarrationscriptfilechaptermd).[settings](#settings)

#### Methods

##### getSectionByKey

▸ **getSectionByKey**(`key`): `undefined` \| [`NarrationSection`](#classesnarration_scriptnarrationsectionmd)

###### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`undefined` \| [`NarrationSection`](#classesnarration_scriptnarrationsectionmd)


<a name="classesnarration_scriptnarrationparagraphmd"></a>

### Class: NarrationParagraph

[narration-script](#modulesnarration_scriptmd).NarrationParagraph

#### Implements

- [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd)

#### Constructors

##### constructor

• **new NarrationParagraph**(`paragraph`, `index`, `section`, `chapter`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd) |
| `index` | `number` |
| `section` | [`NarrationSection`](#classesnarration_scriptnarrationsectionmd) |
| `chapter` | [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd) |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

#### Properties

| Property | Description |
| --- | --- |
| `Optional` **audioFilePath**: `string` | Path of the generated audio file. Only for in-memory processing, not supposed to be stored in file. |
| **chapter**: [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd) |  |
| **index**: `number` |  |
| `Protected` **paragraph**: [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd) |  |
| **script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |  |
| **section**: [`NarrationSection`](#classesnarration_scriptnarrationsectionmd) |  |


#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Paragraph](#interfacesnarration_scriptnarrationscriptfileparagraphmd).[key](#key)

___

##### settings

• `get` **settings**(): [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)

###### Returns

[`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)

###### Implementation of

[Paragraph](#interfacesnarration_scriptnarrationscriptfileparagraphmd).[settings](#settings)

___

##### text

• `get` **text**(): `string`

###### Returns

`string`

###### Implementation of

[Paragraph](#interfacesnarration_scriptnarrationscriptfileparagraphmd).[text](#text)


<a name="classesnarration_scriptnarrationscriptmd"></a>

### Class: NarrationScript

[narration-script](#modulesnarration_scriptmd).NarrationScript

#### Implements

- [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd)

#### Constructors

##### constructor

• **new NarrationScript**(`script`, `scriptFilePath`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd) |
| `scriptFilePath` | `string` |

#### Properties

| Property | Description |
| --- | --- |
| **chapters**: [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)[] | Implementation of<br><br>[Script](#interfacesnarration_scriptnarrationscriptfilescriptmd).[chapters](#chapters) |
| `Protected` **script**: [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd) |  |
| **scriptFilePath**: `string` |  |


#### Accessors

##### settings

• `get` **settings**(): [`ScriptSettings`](#interfacesnarration_scriptscriptsettingsmd)

###### Returns

[`ScriptSettings`](#interfacesnarration_scriptscriptsettingsmd)

###### Implementation of

[Script](#interfacesnarration_scriptnarrationscriptfilescriptmd).[settings](#settings)

#### Methods

##### export

▸ **export**(): [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd)

###### Returns

[`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd)

___

##### getChapterByKey

▸ **getChapterByKey**(`key`): `undefined` \| [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)

###### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`undefined` \| [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)


<a name="classesnarration_scriptnarrationsectionmd"></a>

### Class: NarrationSection

[narration-script](#modulesnarration_scriptmd).NarrationSection

#### Implements

- [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd)

#### Constructors

##### constructor

• **new NarrationSection**(`section`, `index`, `chapter`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `section` | [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd) |
| `index` | `number` |
| `chapter` | [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd) |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

#### Properties

| Property | Description |
| --- | --- |
| **chapter**: [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd) |  |
| **index**: `number` |  |
| **paragraphs**: [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd)[] | Implementation of<br><br>[Section](#interfacesnarration_scriptnarrationscriptfilesectionmd).[paragraphs](#paragraphs) |
| **script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |  |
| `Protected` **section**: [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd) |  |


#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Section](#interfacesnarration_scriptnarrationscriptfilesectionmd).[key](#key)

___

##### settings

• `get` **settings**(): [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)

###### Returns

[`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)

###### Implementation of

[Section](#interfacesnarration_scriptnarrationscriptfilesectionmd).[settings](#settings)


<a name="classesscript_processorscriptprocessormd"></a>

### Class: ScriptProcessor

[script-processor](#modulesscript_processormd).ScriptProcessor

#### Hierarchy

- **`ScriptProcessor`**

  ↳ [`TtsNarrator`](#classestts_narratorttsnarratormd)

#### Constructors

##### constructor

• **new ScriptProcessor**(`scriptFilePath`, `flags`, `cliConsole?`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `scriptFilePath` | `string` |
| `flags` | `Object` & `FlagOutput` & {} |
| `cliConsole?` | `LineLogger`\<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\> |

#### Properties

| Property | Description |
| --- | --- |
| `Protected` **\_chalk**: `undefined` \| ``null`` \| `Chalk` & `ChalkFunction` & {} |  |
| `Protected` **\_prompts**: `undefined` \| ``null`` \| typeof `prompts` |  |
| `Protected` **\_script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |  |
| `Protected` **audioGenerationOptions**: `undefined` \| `Omit`\<[`AudioGenerationOptions`](#interfacestts_serviceaudiogenerationoptionsmd), ``"outputFilePath"``\> |  |
| `Protected` **chapterRange**: `undefined` \| `MultiRange` |  |
| `Protected` **cliConsole**: `LineLogger`\<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\> |  |
| `Protected` **flags**: `Object` & `FlagOutput` & {} |  |
| `Protected` **scriptFilePath**: `string` |  |
| `Protected` **sectionRange**: `undefined` \| `MultiRange` |  |
| `Protected` **ttsService**: [`TtsService`](#interfacestts_servicettsservicemd) |  |


#### Accessors

##### chalk

• `Protected` `get` **chalk**(): `undefined` \| ``null`` \| typeof `prompts`

chalk, or null caused by library not available

###### Returns

`undefined` \| ``null`` \| typeof `prompts`

___

##### prompts

• `Protected` `get` **prompts**(): `undefined` \| ``null`` \| typeof `prompts`

prompts function, or null caused by library not available

###### Returns

`undefined` \| ``null`` \| typeof `prompts`

___

##### script

• `get` **script**(): [`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

###### Returns

[`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

#### Methods

##### determineAudioFilePath

▸ `Protected` **determineAudioFilePath**(`ssmlHash`, `_paragraph`): `Promise`\<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssmlHash` | `string` |
| `_paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`Promise`\<`string`\>

___

##### hash

▸ `Protected` **hash**(`ssml`, `_paragraph`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssml` | `string` |
| `_paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`string`

___

##### initialiseTtsServiceIfNeeded

▸ `Protected` **initialiseTtsServiceIfNeeded**(): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

___

##### loadScriptIfNeeded

▸ `Protected` **loadScriptIfNeeded**(): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

___

##### parseRanges

▸ `Protected` **parseRanges**(): `void`

###### Returns

`void`

___

##### processGeneratedAudioFile

▸ `Protected` **processGeneratedAudioFile**(`audioFilePath`): `Promise`\<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `audioFilePath` | `string` |

###### Returns

`Promise`\<`string`\>

___

##### run

▸ **run**(`reconstructedCommandLine?`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `reconstructedCommandLine?` | `string` |

###### Returns

`Promise`\<`void`\>

___

##### runWithoutCatch

▸ **runWithoutCatch**(`reconstructedCommandLine?`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `reconstructedCommandLine?` | `string` |

###### Returns

`Promise`\<`void`\>


<a name="classestts_narratorttsnarratormd"></a>

### Class: TtsNarrator

[tts-narrator](#modulestts_narratormd).TtsNarrator

Class for generating narration.
Instance of this class can be used to generate narration audio for scripts by calling the `narrate(...)` method.

**`Example`**

```ts
const ttsService = new AzureTtsService(...);
const ttsNarrator = new TtsNarrator(ttsService, './output-folder');
const script = await loadScript('./my-script.yml');
await ttsNarrator.narrate(script);
console.log(`One of the generated audio file is: ${script.chapters[0].sections[0].paragraphs[0].audioFilePath}`);
```

#### Hierarchy

- [`ScriptProcessor`](#classesscript_processorscriptprocessormd)

  ↳ **`TtsNarrator`**

#### Constructors

##### constructor

• **new TtsNarrator**(`ttsService`, `audioFileFolder`, `options?`, `cliConsole?`)

Constructor

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ttsService` | [`TtsService`](#interfacestts_servicettsservicemd) | `undefined` | The TTS service to be used for generating audio |
| `audioFileFolder` | `string` | `undefined` | The folder that generated audio files will be placed |
| `options?` | `Partial`\<`Object` & `FlagOutput` & {}\> | `undefined` | Optional settings |
| `cliConsole` | `LineLogger`\<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\> | `silentLogger` | Optional logger |

###### Overrides

[ScriptProcessor](#classesscript_processorscriptprocessormd).[constructor](#constructor)

#### Properties

| Property | Description |
| --- | --- |
| `Protected` **\_chalk**: `undefined` \| ``null`` \| `Chalk` & `ChalkFunction` & {} | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[_chalk](#_chalk) |
| `Protected` **\_prompts**: `undefined` \| ``null`` \| typeof `prompts` | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[_prompts](#_prompts) |
| `Protected` **\_script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[_script](#_script) |
| `Protected` **audioFileFolder**: `string` | The folder that generated audio files will be placed |
| `Protected` **audioGenerationOptions**: `undefined` \| `Omit`\<[`AudioGenerationOptions`](#interfacestts_serviceaudiogenerationoptionsmd), ``"outputFilePath"``\> | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[audioGenerationOptions](#audiogenerationoptions) |
| `Protected` **chapterRange**: `undefined` \| `MultiRange` | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[chapterRange](#chapterrange) |
| `Protected` **cliConsole**: `LineLogger`\<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\> | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[cliConsole](#cliconsole) |
| `Protected` **flags**: `Object` & `FlagOutput` & {} | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[flags](#flags) |
| `Protected` **scriptFilePath**: `string` | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[scriptFilePath](#scriptfilepath) |
| `Protected` **sectionRange**: `undefined` \| `MultiRange` | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[sectionRange](#sectionrange) |
| `Protected` **ttsService**: [`TtsService`](#interfacestts_servicettsservicemd) | Inherited from<br><br>[ScriptProcessor](#classesscript_processorscriptprocessormd).[ttsService](#ttsservice) |


#### Accessors

##### chalk

• `Protected` `get` **chalk**(): `undefined` \| ``null`` \| typeof `prompts`

chalk, or null caused by library not available

###### Returns

`undefined` \| ``null`` \| typeof `prompts`

###### Inherited from

ScriptProcessor.chalk

___

##### prompts

• `Protected` `get` **prompts**(): `undefined` \| ``null`` \| typeof `prompts`

prompts function, or null caused by library not available

###### Returns

`undefined` \| ``null`` \| typeof `prompts`

###### Inherited from

ScriptProcessor.prompts

___

##### script

• `get` **script**(): [`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

###### Returns

[`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

###### Inherited from

ScriptProcessor.script

#### Methods

##### determineAudioFilePath

▸ `Protected` **determineAudioFilePath**(`ssmlHash`, `_paragraph`): `Promise`\<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssmlHash` | `string` |
| `_paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`Promise`\<`string`\>

###### Overrides

[ScriptProcessor](#classesscript_processorscriptprocessormd).[determineAudioFilePath](#determineaudiofilepath)

___

##### hash

▸ `Protected` **hash**(`ssml`, `_paragraph`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssml` | `string` |
| `_paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`string`

###### Inherited from

[ScriptProcessor](#classesscript_processorscriptprocessormd).[hash](#hash)

___

##### initialiseTtsServiceIfNeeded

▸ `Protected` **initialiseTtsServiceIfNeeded**(): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

###### Inherited from

[ScriptProcessor](#classesscript_processorscriptprocessormd).[initialiseTtsServiceIfNeeded](#initialisettsserviceifneeded)

___

##### loadScriptIfNeeded

▸ `Protected` **loadScriptIfNeeded**(): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

###### Inherited from

[ScriptProcessor](#classesscript_processorscriptprocessormd).[loadScriptIfNeeded](#loadscriptifneeded)

___

##### narrate

▸ **narrate**(`script`): `Promise`\<`void`\>

Generate narration for the script

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) | the input script which will also be modified for recording audioFilePath |

###### Returns

`Promise`\<`void`\>

nothing

___

##### parseRanges

▸ `Protected` **parseRanges**(): `void`

###### Returns

`void`

###### Inherited from

[ScriptProcessor](#classesscript_processorscriptprocessormd).[parseRanges](#parseranges)

___

##### processGeneratedAudioFile

▸ `Protected` **processGeneratedAudioFile**(`audioFilePath`): `Promise`\<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `audioFilePath` | `string` |

###### Returns

`Promise`\<`string`\>

###### Inherited from

[ScriptProcessor](#classesscript_processorscriptprocessormd).[processGeneratedAudioFile](#processgeneratedaudiofile)

___

##### run

▸ **run**(`reconstructedCommandLine?`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `reconstructedCommandLine?` | `string` |

###### Returns

`Promise`\<`void`\>

###### Inherited from

[ScriptProcessor](#classesscript_processorscriptprocessormd).[run](#run)

___

##### runWithoutCatch

▸ **runWithoutCatch**(`reconstructedCommandLine?`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `reconstructedCommandLine?` | `string` |

###### Returns

`Promise`\<`void`\>

###### Inherited from

[ScriptProcessor](#classesscript_processorscriptprocessormd).[runWithoutCatch](#runwithoutcatch)


<a name="classestts_narrator_cliexport_md"></a>

### Class: export=

[tts-narrator-cli](#modulestts_narrator_climd).export=

#### Hierarchy

- `Command`

  ↳ **`export=`**

#### Constructors

##### constructor

• **new export=**(`argv`, `config`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `argv` | `string`[] |
| `config` | `Config` |

###### Inherited from

Command.constructor

#### Properties

| Property | Description |
| --- | --- |
| `Static` **args**: `Object` | Type declaration<br><br>| Name | Type |<br>| :------ | :------ |<br>| `file` | `Arg`\<`string`, `Record`\<`string`, `unknown`\>\> |<br>Overrides<br><br>Command.args |
| `Static` **description**: `string` = `'Generate narration with Text-To-Speech technology'` | Overrides<br><br>Command.description |
| `Static` **examples**: `string`[] | Overrides<br><br>Command.examples |
| `Static` **flags**: `Object` | Type declaration<br><br>| Name | Type |<br>| :------ | :------ |<br>| `chapters` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |<br>| `debug` | `BooleanFlag`\<`boolean`\> |<br>| `dry-run` | `BooleanFlag`\<`boolean`\> |<br>| `interactive` | `BooleanFlag`\<`boolean`\> |<br>| `outputFormat` | `OptionFlag`\<`number`, `CustomOptions`\> |<br>| `overwrite` | `BooleanFlag`\<`boolean`\> |<br>| `play` | `BooleanFlag`\<`boolean`\> |<br>| `quiet` | `BooleanFlag`\<`boolean`\> |<br>| `region` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |<br>| `sections` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |<br>| `service` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |<br>| `ssml` | `BooleanFlag`\<`boolean`\> |<br>| `subscription-key` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |<br>| `subscription-key-env` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |<br>Overrides<br><br>Command.flags |
| `Static` **id**: `string` = `' '` | Overrides<br><br>Command.id |


#### Methods

##### run

▸ **run**(): `Promise`\<`void`\>

###### Returns

`Promise`\<`void`\>

###### Overrides

Command.run


<a name="classestts_servicebasettsservicemd"></a>

### Class: BaseTtsService

[tts-service](#modulestts_servicemd).BaseTtsService

#### Hierarchy

- **`BaseTtsService`**

  ↳ [`AzureTtsService`](#classesazure_tts_serviceazurettsservicemd)

#### Implements

- [`TtsService`](#interfacestts_servicettsservicemd)

#### Constructors

##### constructor

• **new BaseTtsService**()

#### Methods

##### buildMsttsExpressAsStartTag

▸ `Protected` **buildMsttsExpressAsStartTag**(`msttsExpressAsSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `msttsExpressAsSettings` | `Object` |
| `msttsExpressAsSettings.role?` | `string` |
| `msttsExpressAsSettings.style?` | `string` |
| `msttsExpressAsSettings.styleDegree?` | `string` |

###### Returns

`string`

___

##### buildProsodyStartTag

▸ `Protected` **buildProsodyStartTag**(`prosodySettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `prosodySettings` | `Object` |
| `prosodySettings.pitch?` | `string` |
| `prosodySettings.rate?` | `string` |
| `prosodySettings.volume?` | `string` |

###### Returns

`string`

___

##### buildSpeakStartTag

▸ `Protected` **buildSpeakStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |

###### Returns

`string`

___

##### buildVoiceStartTag

▸ `Protected` **buildVoiceStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |

###### Returns

`string`

___

##### generateAudio

▸ **generateAudio**(`_ssml`, `_options`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `_ssml` | `string` |
| `_options` | [`AudioGenerationOptions`](#interfacestts_serviceaudiogenerationoptionsmd) |

###### Returns

`Promise`\<`void`\>

###### Implementation of

[TtsService](#interfacestts_servicettsservicemd).[generateAudio](#generateaudio)

___

##### generateSSML

▸ **generateSSML**(`paragraph`): `Promise`\<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`Promise`\<`string`\>

###### Implementation of

[TtsService](#interfacestts_servicettsservicemd).[generateSSML](#generatessml)

___

##### generateSsmlWithoutValidation

▸ `Protected` **generateSsmlWithoutValidation**(`paragraph`): `Object`

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `lineOffset` | `number` |
| `ssml` | `string` |

___

##### validateXML

▸ `Protected` **validateXML**(`xml`, `lineOffset`): `void`

###### Parameters

| Name | Type |
| :------ | :------ |
| `xml` | `string` |
| `lineOffset` | `number` |

###### Returns

`void`

## Enums


<a name="enumstts_servicettsservicetypemd"></a>

### Enumeration: TtsServiceType

[tts-service](#modulestts_servicemd).TtsServiceType

#### Enumeration Members

##### Azure

• **Azure** = ``"azure"``

## Interfaces


<a name="interfacesazure_tts_serviceazureaudiogenerationoptionsmd"></a>

### Interface: AzureAudioGenerationOptions

[azure-tts-service](#modulesazure_tts_servicemd).AzureAudioGenerationOptions

#### Hierarchy

- [`AudioGenerationOptions`](#interfacestts_serviceaudiogenerationoptionsmd)

  ↳ **`AzureAudioGenerationOptions`**

#### Properties

| Property | Description |
| --- | --- |
| **outputFilePath**: `string` | Inherited from<br><br>[AudioGenerationOptions](#interfacestts_serviceaudiogenerationoptionsmd).[outputFilePath](#outputfilepath) |
| `Optional` **outputFormat**: `SpeechSynthesisOutputFormat` |  |
| `Optional` **serviceRegion**: `string` |  |
| `Optional` **subscriptionKey**: `string` |  |



<a name="interfacesnarration_scriptnarrationscriptfilechaptermd"></a>

### Interface: Chapter

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Chapter

#### Implemented by

- [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)

#### Properties

| Property | Description |
| --- | --- |
| `Optional` **key**: `string` |  |
| **sections**: [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd)[] |  |
| `Optional` **settings**: [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |  |



<a name="interfacesnarration_scriptnarrationscriptfileparagraphmd"></a>

### Interface: Paragraph

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Paragraph

#### Implemented by

- [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd)

#### Properties

| Property | Description |
| --- | --- |
| `Optional` **key**: `string` |  |
| `Optional` **settings**: [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |  |
| **text**: `string` |  |



<a name="interfacesnarration_scriptnarrationscriptfilescriptmd"></a>

### Interface: Script

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Script

#### Implemented by

- [`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

#### Properties

| Property | Description |
| --- | --- |
| **chapters**: [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd)[] |  |
| **settings**: [`ScriptSettings`](#interfacesnarration_scriptscriptsettingsmd) |  |



<a name="interfacesnarration_scriptnarrationscriptfilesectionmd"></a>

### Interface: Section

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Section

#### Implemented by

- [`NarrationSection`](#classesnarration_scriptnarrationsectionmd)

#### Properties

| Property | Description |
| --- | --- |
| `Optional` **key**: `string` |  |
| **paragraphs**: [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd)[] |  |
| `Optional` **settings**: [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |  |



<a name="interfacesnarration_scriptscriptsettingsmd"></a>

### Interface: ScriptSettings

[narration-script](#modulesnarration_scriptmd).ScriptSettings

#### Properties

| Property | Description |
| --- | --- |
| `Optional` **service**: [`Azure`](#azure) |  |
| `Optional` **voice**: [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd) |  |



<a name="interfacesnarration_scriptvoicesettingsmd"></a>

### Interface: VoiceSettings

[narration-script](#modulesnarration_scriptmd).VoiceSettings

#### Properties

| Property | Description |
| --- | --- |
| `Optional` **effect**: `string` | Voice effect, corresponding to `speak.voice#effect` in SSML. |
| `Optional` **language**: `string` | Language, corresponding to `speak#xml:lang` in SSML. |
| `Optional` **msttsExpressAs**: `Object` | Corresponding to `speak.voice.mstts:express-as` in SSML.<br>Type declaration<br><br>| Name | Type |<br>| :------ | :------ |<br>| `role?` | `string` |<br>| `style?` | `string` |<br>| `styleDegree?` | `string` | |
| `Optional` **name**: `string` | Voice name, corresponding to `speak.voice#name` in SSML. |
| `Optional` **prosody**: `Object` | Corresponding to `speak.voice.prosody` in SSML.<br>Type declaration<br><br>| Name | Type |<br>| :------ | :------ |<br>| `pitch?` | `string` |<br>| `rate?` | `string` |<br>| `volume?` | `string` | |



<a name="interfacestts_serviceaudiogenerationoptionsmd"></a>

### Interface: AudioGenerationOptions

[tts-service](#modulestts_servicemd).AudioGenerationOptions

#### Hierarchy

- **`AudioGenerationOptions`**

  ↳ [`AzureAudioGenerationOptions`](#interfacesazure_tts_serviceazureaudiogenerationoptionsmd)

#### Properties

| Property | Description |
| --- | --- |
| **outputFilePath**: `string` |  |



<a name="interfacestts_servicettsservicemd"></a>

### Interface: TtsService

[tts-service](#modulestts_servicemd).TtsService

#### Implemented by

- [`BaseTtsService`](#classestts_servicebasettsservicemd)

#### Methods

##### generateAudio

▸ **generateAudio**(`ssml`, `options`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssml` | `string` |
| `options` | [`AudioGenerationOptions`](#interfacestts_serviceaudiogenerationoptionsmd) |

###### Returns

`Promise`\<`void`\>

___

##### generateSSML

▸ **generateSSML**(`paragraph`): `Promise`\<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd) |

###### Returns

`Promise`\<`string`\>

## Modules


<a name="modulesaudio_utilsmd"></a>

### Module: audio-utils

#### Functions

##### getAudioFileDuration

▸ **getAudioFileDuration**(`filePath`): `Promise`\<`number`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

###### Returns

`Promise`\<`number`\>

___

##### playMp3File

▸ **playMp3File**(`filePath`, `infoLogger`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `infoLogger` | (`msg`: `string`) => `void` |

###### Returns

`Promise`\<`void`\>


<a name="modulesazure_tts_servicemd"></a>

### Module: azure-tts-service

#### Classes

- [AzureTtsService](#classesazure_tts_serviceazurettsservicemd)

#### Interfaces

- [AzureAudioGenerationOptions](#interfacesazure_tts_serviceazureaudiogenerationoptionsmd)


<a name="modulesindexmd"></a>

### Module: index

#### References

##### AudioGenerationOptions

Re-exports [AudioGenerationOptions](#interfacestts_serviceaudiogenerationoptionsmd)

___

##### AzureAudioGenerationOptions

Re-exports [AzureAudioGenerationOptions](#interfacesazure_tts_serviceazureaudiogenerationoptionsmd)

___

##### AzureTtsService

Re-exports [AzureTtsService](#classesazure_tts_serviceazurettsservicemd)

___

##### BaseTtsService

Re-exports [BaseTtsService](#classestts_servicebasettsservicemd)

___

##### NarrationChapter

Re-exports [NarrationChapter](#classesnarration_scriptnarrationchaptermd)

___

##### NarrationParagraph

Re-exports [NarrationParagraph](#classesnarration_scriptnarrationparagraphmd)

___

##### NarrationScript

Re-exports [NarrationScript](#classesnarration_scriptnarrationscriptmd)

___

##### NarrationScriptFile

Re-exports [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd)

___

##### NarrationSection

Re-exports [NarrationSection](#classesnarration_scriptnarrationsectionmd)

___

##### ScriptProcessor

Re-exports [ScriptProcessor](#classesscript_processorscriptprocessormd)

___

##### ScriptSettings

Re-exports [ScriptSettings](#interfacesnarration_scriptscriptsettingsmd)

___

##### TtsNarrator

Re-exports [TtsNarrator](#classestts_narratorttsnarratormd)

___

##### TtsService

Re-exports [TtsService](#interfacestts_servicettsservicemd)

___

##### TtsServiceType

Re-exports [TtsServiceType](#enumstts_servicettsservicetypemd)

___

##### VoiceSettings

Re-exports [VoiceSettings](#interfacesnarration_scriptvoicesettingsmd)

___

##### getAudioFileDuration

Re-exports [getAudioFileDuration](#getaudiofileduration)

___

##### loadScript

Re-exports [loadScript](#loadscript)

___

##### playMp3File

Re-exports [playMp3File](#playmp3file)

___

##### saveScript

Re-exports [saveScript](#savescript)


<a name="modulesnarration_scriptnarrationscriptfilemd"></a>

### Namespace: NarrationScriptFile

[narration-script](#modulesnarration_scriptmd).NarrationScriptFile

#### Interfaces

- [Chapter](#interfacesnarration_scriptnarrationscriptfilechaptermd)
- [Paragraph](#interfacesnarration_scriptnarrationscriptfileparagraphmd)
- [Script](#interfacesnarration_scriptnarrationscriptfilescriptmd)
- [Section](#interfacesnarration_scriptnarrationscriptfilesectionmd)


<a name="modulesnarration_scriptmd"></a>

### Module: narration-script

#### Namespaces

- [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd)

#### Classes

- [NarrationChapter](#classesnarration_scriptnarrationchaptermd)
- [NarrationParagraph](#classesnarration_scriptnarrationparagraphmd)
- [NarrationScript](#classesnarration_scriptnarrationscriptmd)
- [NarrationSection](#classesnarration_scriptnarrationsectionmd)

#### Interfaces

- [ScriptSettings](#interfacesnarration_scriptscriptsettingsmd)
- [VoiceSettings](#interfacesnarration_scriptvoicesettingsmd)

#### Functions

##### loadScript

▸ **loadScript**(`scriptFilePath`): `Promise`\<[`NarrationScript`](#classesnarration_scriptnarrationscriptmd)\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `scriptFilePath` | `string` |

###### Returns

`Promise`\<[`NarrationScript`](#classesnarration_scriptnarrationscriptmd)\>

___

##### saveScript

▸ **saveScript**(`script`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

###### Returns

`Promise`\<`void`\>

▸ **saveScript**(`script`, `scriptFilePath`): `Promise`\<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd) |
| `scriptFilePath` | `string` |

###### Returns

`Promise`\<`void`\>


<a name="modulesscript_processormd"></a>

### Module: script-processor

#### Classes

- [ScriptProcessor](#classesscript_processorscriptprocessormd)


<a name="modulesscript_processor_flagsmd"></a>

### Module: script-processor-flags

#### Type Aliases

##### ScriptProcessorFlags

Ƭ **ScriptProcessorFlags**: `CommandOptions`\<\{ `flags`: typeof [`scriptProcessorFlags`](#scriptprocessorflags-1)  }\>[``"flags"``]

#### Variables

##### scriptProcessorFlags

• `Const` **scriptProcessorFlags**: `Object`

CLI flags that are required/used by the ScriptProcessor.

###### Type declaration

| Name | Type |
| :------ | :------ |
| `chapters` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |
| `debug` | `BooleanFlag`\<`boolean`\> |
| `dry-run` | `BooleanFlag`\<`boolean`\> |
| `interactive` | `BooleanFlag`\<`boolean`\> |
| `outputFormat` | `OptionFlag`\<`number`, `CustomOptions`\> |
| `overwrite` | `BooleanFlag`\<`boolean`\> |
| `play` | `BooleanFlag`\<`boolean`\> |
| `quiet` | `BooleanFlag`\<`boolean`\> |
| `region` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |
| `sections` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |
| `service` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |
| `ssml` | `BooleanFlag`\<`boolean`\> |
| `subscription-key` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |
| `subscription-key-env` | `OptionFlag`\<`undefined` \| `string`, `CustomOptions`\> |


<a name="modulestts_narratormd"></a>

### Module: tts-narrator

#### Classes

- [TtsNarrator](#classestts_narratorttsnarratormd)


<a name="modulestts_narrator_climd"></a>

### Module: tts-narrator-cli

#### Classes

- [export=](#classestts_narrator_cliexport_md)


<a name="modulestts_servicemd"></a>

### Module: tts-service

#### Enumerations

- [TtsServiceType](#enumstts_servicettsservicetypemd)

#### Classes

- [BaseTtsService](#classestts_servicebasettsservicemd)

#### Interfaces

- [AudioGenerationOptions](#interfacestts_serviceaudiogenerationoptionsmd)
- [TtsService](#interfacestts_servicettsservicemd)
<!-- API end -->
