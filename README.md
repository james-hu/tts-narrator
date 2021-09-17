# tts-narrator

Generate narration with Text-To-Speech technology

[![Version](https://img.shields.io/npm/v/tts-narrator.svg)](https://npmjs.org/package/tts-narrator)
[![Downloads/week](https://img.shields.io/npm/dw/tts-narrator.svg)](https://npmjs.org/package/tts-narrator)
[![Build](https://img.shields.io/github/workflow/status/james-hu/tts-narrator/CI)]
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)

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

The `text` field of a paragraph can be pure text, or an SSML fragment. Multi-line strings are supported.

When running on MacOS, to avoid `illegal hardware instruction` issue, try `npm install speaker --mpg123-backend=openal`

# CLI

<!-- help start -->
```
USAGE
  $ tts-narrator [FILE]

ARGUMENTS
  FILE  path to the script file (.yml)

OPTIONS
  -d, --debug                                  output debug information
  -h, --help                                   show CLI help

  -i, --interactive                            wait for key press before
                                               entering each section

  -k, --subscription-key=subscription-key      Azure Speech service subscription
                                               key

  -o, --overwrite                              always overwrite previously
                                               generated audio files

  -p, --[no-]play                              play generated audio

  -q, --quiet                                  output warn and error information
                                               only

  -r, --region=region                          region of the text-to-speech
                                               service

  -s, --service=azure                          text-to-speech service to use

  -v, --version                                show CLI version

  --chapters=chapters                          list of chapters to process,
                                               examples: "1-10,13,15", "4-"

  --dry-run                                    don't try to generate or play
                                               audio

  --sections=sections                          list of sections to process,
                                               examples: "1-10,13,15", "5-"

  --ssml                                       display generated SSML

  --subscription-key-env=subscription-key-env  Name of the environment variable
                                               that holds the subscription key

EXAMPLES
  tts-narrator myscript.yml --play --interactive --service azure 
  --subscription-key-env SUBSCRIPTION_KEY --region australiaeast
  tts-narrator ./test/fixtures/script3.yml -s azure --ssml -r australiaeast 
  --subscription-key-env=TTS_SUB_KEY  --no-play --interactive -d
  tts-narrator ./test/fixtures/script3.yml -s azure -r australiaeast 
  --subscription-key-env=TTS_SUB_KEY --quiet
  tts-narrator ./test/fixtures/script3.yml
```

<!-- help end -->

# API

<!-- API start -->
<a name="readmemd"></a>

tts-narrator

## tts-narrator

### Table of contents

#### Namespaces

- [NarrationScriptFile](#modulesnarrationscriptfilemd)

#### Enumerations

- [TtsServiceType](#enumsttsservicetypemd)

#### Classes

- [AzureTtsService](#classesazurettsservicemd)
- [BaseTtsService](#classesbasettsservicemd)
- [NarrationChapter](#classesnarrationchaptermd)
- [NarrationParagraph](#classesnarrationparagraphmd)
- [NarrationScript](#classesnarrationscriptmd)
- [NarrationSection](#classesnarrationsectionmd)
- [ScriptProcessor](#classesscriptprocessormd)

#### Interfaces

- [AudioGenerationOptions](#interfacesaudiogenerationoptionsmd)
- [AzureAudioGenerationOptions](#interfacesazureaudiogenerationoptionsmd)
- [ScriptSettings](#interfacesscriptsettingsmd)
- [TtsService](#interfacesttsservicemd)
- [VoiceSettings](#interfacesvoicesettingsmd)

#### Variables

- [scriptProcessorFlags](#scriptprocessorflags)

#### Functions

- [getAudioFileDuration](#getaudiofileduration)
- [loadScript](#loadscript)
- [playMp3File](#playmp3file)
- [saveScript](#savescript)

### Variables

#### scriptProcessorFlags

• `Const` **scriptProcessorFlags**: `Object`

CLI flags that are required/used by the ScriptProcessor.

##### Type declaration

| Name | Type |
| :------ | :------ |
| `chapters` | `IOptionFlag`<`undefined` \| `string`\> |
| `debug` | `IBooleanFlag`<`boolean`\> |
| `dry-run` | `IBooleanFlag`<`boolean`\> |
| `interactive` | `IBooleanFlag`<`boolean`\> |
| `overwrite` | `IBooleanFlag`<`boolean`\> |
| `play` | `IBooleanFlag`<`boolean`\> |
| `quiet` | `IBooleanFlag`<`boolean`\> |
| `region` | `IOptionFlag`<`undefined` \| `string`\> |
| `sections` | `IOptionFlag`<`undefined` \| `string`\> |
| `service` | `IOptionFlag`<`undefined` \| `string`\> |
| `ssml` | `IBooleanFlag`<`boolean`\> |
| `subscription-key` | `IOptionFlag`<`undefined` \| `string`\> |
| `subscription-key-env` | `IOptionFlag`<`undefined` \| `string`\> |

### Functions

#### getAudioFileDuration

▸ **getAudioFileDuration**(`filePath`): `Promise`<`number`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

##### Returns

`Promise`<`number`\>

___

#### loadScript

▸ **loadScript**(`scriptFilePath`): `Promise`<[`NarrationScript`](#classesnarrationscriptmd)\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `scriptFilePath` | `string` |

##### Returns

`Promise`<[`NarrationScript`](#classesnarrationscriptmd)\>

___

#### playMp3File

▸ **playMp3File**(`filePath`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

##### Returns

`Promise`<`void`\>

___

#### saveScript

▸ **saveScript**(`script`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`NarrationScript`](#classesnarrationscriptmd) |

##### Returns

`Promise`<`void`\>

▸ **saveScript**(`script`, `scriptFilePath`): `Promise`<`void`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`Script`](#interfacesnarrationscriptfilescriptmd) |
| `scriptFilePath` | `string` |

##### Returns

`Promise`<`void`\>

## Classes


<a name="classesazurettsservicemd"></a>

[tts-narrator](#readmemd) / AzureTtsService

### Class: AzureTtsService

#### Hierarchy

- [`BaseTtsService`](#classesbasettsservicemd)

  ↳ **`AzureTtsService`**

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Methods

- [buildSpeakStartTag](#buildspeakstarttag)
- [buildVoiceStartTag](#buildvoicestarttag)
- [generateAudio](#generateaudio)
- [generateSSML](#generatessml)
- [generateSsmlWithoutValidation](#generatessmlwithoutvalidation)
- [validateXML](#validatexml)

#### Constructors

##### constructor

• **new AzureTtsService**()

###### Inherited from

[BaseTtsService](#classesbasettsservicemd).[constructor](#constructor)

#### Methods

##### buildSpeakStartTag

▸ `Protected` **buildSpeakStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesvoicesettingsmd) |

###### Returns

`string`

###### Overrides

[BaseTtsService](#classesbasettsservicemd).[buildSpeakStartTag](#buildspeakstarttag)

___

##### buildVoiceStartTag

▸ `Protected` **buildVoiceStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesvoicesettingsmd) |

###### Returns

`string`

###### Inherited from

[BaseTtsService](#classesbasettsservicemd).[buildVoiceStartTag](#buildvoicestarttag)

___

##### generateAudio

▸ **generateAudio**(`ssml`, `options`): `Promise`<`any`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssml` | `string` |
| `options` | [`AzureAudioGenerationOptions`](#interfacesazureaudiogenerationoptionsmd) |

###### Returns

`Promise`<`any`\>

###### Overrides

[BaseTtsService](#classesbasettsservicemd).[generateAudio](#generateaudio)

___

##### generateSSML

▸ **generateSSML**(`paragraph`): `Promise`<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarrationparagraphmd) |

###### Returns

`Promise`<`string`\>

###### Inherited from

[BaseTtsService](#classesbasettsservicemd).[generateSSML](#generatessml)

___

##### generateSsmlWithoutValidation

▸ `Protected` **generateSsmlWithoutValidation**(`paragraph`): `Object`

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarrationparagraphmd) |

###### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `lineOffset` | `number` |
| `ssml` | `string` |

###### Inherited from

[BaseTtsService](#classesbasettsservicemd).[generateSsmlWithoutValidation](#generatessmlwithoutvalidation)

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

[BaseTtsService](#classesbasettsservicemd).[validateXML](#validatexml)


<a name="classesbasettsservicemd"></a>

[tts-narrator](#readmemd) / BaseTtsService

### Class: BaseTtsService

#### Hierarchy

- **`BaseTtsService`**

  ↳ [`AzureTtsService`](#classesazurettsservicemd)

#### Implements

- [`TtsService`](#interfacesttsservicemd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Methods

- [buildSpeakStartTag](#buildspeakstarttag)
- [buildVoiceStartTag](#buildvoicestarttag)
- [generateAudio](#generateaudio)
- [generateSSML](#generatessml)
- [generateSsmlWithoutValidation](#generatessmlwithoutvalidation)
- [validateXML](#validatexml)

#### Constructors

##### constructor

• **new BaseTtsService**()

#### Methods

##### buildSpeakStartTag

▸ `Protected` **buildSpeakStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesvoicesettingsmd) |

###### Returns

`string`

___

##### buildVoiceStartTag

▸ `Protected` **buildVoiceStartTag**(`voiceSettings`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `voiceSettings` | [`VoiceSettings`](#interfacesvoicesettingsmd) |

###### Returns

`string`

___

##### generateAudio

▸ **generateAudio**(`_ssml`, `_options`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `_ssml` | `string` |
| `_options` | [`AudioGenerationOptions`](#interfacesaudiogenerationoptionsmd) |

###### Returns

`Promise`<`void`\>

###### Implementation of

[TtsService](#interfacesttsservicemd).[generateAudio](#generateaudio)

___

##### generateSSML

▸ **generateSSML**(`paragraph`): `Promise`<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarrationparagraphmd) |

###### Returns

`Promise`<`string`\>

###### Implementation of

[TtsService](#interfacesttsservicemd).[generateSSML](#generatessml)

___

##### generateSsmlWithoutValidation

▸ `Protected` **generateSsmlWithoutValidation**(`paragraph`): `Object`

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarrationparagraphmd) |

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


<a name="classesnarrationchaptermd"></a>

[tts-narrator](#readmemd) / NarrationChapter

### Class: NarrationChapter

#### Implements

- [`Chapter`](#interfacesnarrationscriptfilechaptermd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [chapter](#chapter)
- [index](#index)
- [script](#script)
- [sections](#sections)

##### Accessors

- [key](#key)
- [settings](#settings)

##### Methods

- [getSectionByKey](#getsectionbykey)

#### Constructors

##### constructor

• **new NarrationChapter**(`chapter`, `index`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `chapter` | [`Chapter`](#interfacesnarrationscriptfilechaptermd) |
| `index` | `number` |
| `script` | [`NarrationScript`](#classesnarrationscriptmd) |

#### Properties

##### chapter

• `Protected` **chapter**: [`Chapter`](#interfacesnarrationscriptfilechaptermd)

___

##### index

• **index**: `number`

___

##### script

• **script**: [`NarrationScript`](#classesnarrationscriptmd)

___

##### sections

• **sections**: [`NarrationSection`](#classesnarrationsectionmd)[]

###### Implementation of

[Chapter](#interfacesnarrationscriptfilechaptermd).[sections](#sections)

#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Chapter](#interfacesnarrationscriptfilechaptermd).[key](#key)

___

##### settings

• `get` **settings**(): [`VoiceSettings`](#interfacesvoicesettingsmd)

###### Returns

[`VoiceSettings`](#interfacesvoicesettingsmd)

###### Implementation of

[Chapter](#interfacesnarrationscriptfilechaptermd).[settings](#settings)

#### Methods

##### getSectionByKey

▸ **getSectionByKey**(`key`): `undefined` \| [`NarrationSection`](#classesnarrationsectionmd)

###### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`undefined` \| [`NarrationSection`](#classesnarrationsectionmd)


<a name="classesnarrationparagraphmd"></a>

[tts-narrator](#readmemd) / NarrationParagraph

### Class: NarrationParagraph

#### Implements

- [`Paragraph`](#interfacesnarrationscriptfileparagraphmd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [chapter](#chapter)
- [index](#index)
- [paragraph](#paragraph)
- [script](#script)
- [section](#section)

##### Accessors

- [key](#key)
- [settings](#settings)
- [text](#text)

#### Constructors

##### constructor

• **new NarrationParagraph**(`paragraph`, `index`, `section`, `chapter`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`Paragraph`](#interfacesnarrationscriptfileparagraphmd) |
| `index` | `number` |
| `section` | [`NarrationSection`](#classesnarrationsectionmd) |
| `chapter` | [`NarrationChapter`](#classesnarrationchaptermd) |
| `script` | [`NarrationScript`](#classesnarrationscriptmd) |

#### Properties

##### chapter

• **chapter**: [`NarrationChapter`](#classesnarrationchaptermd)

___

##### index

• **index**: `number`

___

##### paragraph

• `Protected` **paragraph**: [`Paragraph`](#interfacesnarrationscriptfileparagraphmd)

___

##### script

• **script**: [`NarrationScript`](#classesnarrationscriptmd)

___

##### section

• **section**: [`NarrationSection`](#classesnarrationsectionmd)

#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Paragraph](#interfacesnarrationscriptfileparagraphmd).[key](#key)

___

##### settings

• `get` **settings**(): [`VoiceSettings`](#interfacesvoicesettingsmd)

###### Returns

[`VoiceSettings`](#interfacesvoicesettingsmd)

###### Implementation of

[Paragraph](#interfacesnarrationscriptfileparagraphmd).[settings](#settings)

___

##### text

• `get` **text**(): `string`

###### Returns

`string`

###### Implementation of

[Paragraph](#interfacesnarrationscriptfileparagraphmd).[text](#text)


<a name="classesnarrationscriptmd"></a>

[tts-narrator](#readmemd) / NarrationScript

### Class: NarrationScript

#### Implements

- [`Script`](#interfacesnarrationscriptfilescriptmd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [chapters](#chapters)
- [script](#script)
- [scriptFilePath](#scriptfilepath)

##### Accessors

- [settings](#settings)

##### Methods

- [export](#export)
- [getChapterByKey](#getchapterbykey)

#### Constructors

##### constructor

• **new NarrationScript**(`script`, `scriptFilePath`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`Script`](#interfacesnarrationscriptfilescriptmd) |
| `scriptFilePath` | `string` |

#### Properties

##### chapters

• **chapters**: [`NarrationChapter`](#classesnarrationchaptermd)[]

###### Implementation of

[Script](#interfacesnarrationscriptfilescriptmd).[chapters](#chapters)

___

##### script

• `Protected` **script**: [`Script`](#interfacesnarrationscriptfilescriptmd)

___

##### scriptFilePath

• **scriptFilePath**: `string`

#### Accessors

##### settings

• `get` **settings**(): [`ScriptSettings`](#interfacesscriptsettingsmd)

###### Returns

[`ScriptSettings`](#interfacesscriptsettingsmd)

###### Implementation of

[Script](#interfacesnarrationscriptfilescriptmd).[settings](#settings)

#### Methods

##### export

▸ **export**(): [`Script`](#interfacesnarrationscriptfilescriptmd)

###### Returns

[`Script`](#interfacesnarrationscriptfilescriptmd)

___

##### getChapterByKey

▸ **getChapterByKey**(`key`): `undefined` \| [`NarrationChapter`](#classesnarrationchaptermd)

###### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

###### Returns

`undefined` \| [`NarrationChapter`](#classesnarrationchaptermd)


<a name="classesnarrationsectionmd"></a>

[tts-narrator](#readmemd) / NarrationSection

### Class: NarrationSection

#### Implements

- [`Section`](#interfacesnarrationscriptfilesectionmd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [chapter](#chapter)
- [index](#index)
- [paragraphs](#paragraphs)
- [script](#script)
- [section](#section)

##### Accessors

- [key](#key)
- [settings](#settings)

#### Constructors

##### constructor

• **new NarrationSection**(`section`, `index`, `chapter`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `section` | [`Section`](#interfacesnarrationscriptfilesectionmd) |
| `index` | `number` |
| `chapter` | [`NarrationChapter`](#classesnarrationchaptermd) |
| `script` | [`NarrationScript`](#classesnarrationscriptmd) |

#### Properties

##### chapter

• **chapter**: [`NarrationChapter`](#classesnarrationchaptermd)

___

##### index

• **index**: `number`

___

##### paragraphs

• **paragraphs**: [`NarrationParagraph`](#classesnarrationparagraphmd)[]

###### Implementation of

[Section](#interfacesnarrationscriptfilesectionmd).[paragraphs](#paragraphs)

___

##### script

• **script**: [`NarrationScript`](#classesnarrationscriptmd)

___

##### section

• `Protected` **section**: [`Section`](#interfacesnarrationscriptfilesectionmd)

#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Section](#interfacesnarrationscriptfilesectionmd).[key](#key)

___

##### settings

• `get` **settings**(): [`VoiceSettings`](#interfacesvoicesettingsmd)

###### Returns

[`VoiceSettings`](#interfacesvoicesettingsmd)

###### Implementation of

[Section](#interfacesnarrationscriptfilesectionmd).[settings](#settings)


<a name="classesscriptprocessormd"></a>

[tts-narrator](#readmemd) / ScriptProcessor

### Class: ScriptProcessor

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [audioGenerationOptions](#audiogenerationoptions)
- [chapterRange](#chapterrange)
- [cliConsole](#cliconsole)
- [flags](#flags)
- [script](#script)
- [scriptFilePath](#scriptfilepath)
- [sectionRange](#sectionrange)
- [ttsService](#ttsservice)

##### Methods

- [determineAudioFilePath](#determineaudiofilepath)
- [hash](#hash)
- [initialiseTtsServiceIfNeeded](#initialisettsserviceifneeded)
- [loadScript](#loadscript)
- [parseRanges](#parseranges)
- [processGeneratedAudioFile](#processgeneratedaudiofile)
- [run](#run)
- [runWithoutCatch](#runwithoutcatch)

#### Constructors

##### constructor

• **new ScriptProcessor**(`scriptFilePath`, `flags`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `scriptFilePath` | `string` |
| `flags` | `Object` |

#### Properties

##### audioGenerationOptions

• `Protected` **audioGenerationOptions**: `undefined` \| [`AudioGenerationOptions`](#interfacesaudiogenerationoptionsmd)

___

##### chapterRange

• `Protected` **chapterRange**: `undefined` \| `MultiRange`

___

##### cliConsole

• `Protected` **cliConsole**: `CliConsole`<`fn`, `fn`, `fn`, `fn`\>

___

##### flags

• `Protected` **flags**: `Object`

___

##### script

• `Protected` **script**: [`NarrationScript`](#classesnarrationscriptmd)

___

##### scriptFilePath

• `Protected` **scriptFilePath**: `string`

___

##### sectionRange

• `Protected` **sectionRange**: `undefined` \| `MultiRange`

___

##### ttsService

• `Protected` **ttsService**: [`TtsService`](#interfacesttsservicemd)

#### Methods

##### determineAudioFilePath

▸ `Protected` **determineAudioFilePath**(`ssmlHash`, `_paragraph`): `Promise`<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssmlHash` | `string` |
| `_paragraph` | [`NarrationParagraph`](#classesnarrationparagraphmd) |

###### Returns

`Promise`<`string`\>

___

##### hash

▸ `Protected` **hash**(`ssml`, `_paragraph`): `string`

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssml` | `string` |
| `_paragraph` | [`NarrationParagraph`](#classesnarrationparagraphmd) |

###### Returns

`string`

___

##### initialiseTtsServiceIfNeeded

▸ `Protected` **initialiseTtsServiceIfNeeded**(): `Promise`<`void`\>

###### Returns

`Promise`<`void`\>

___

##### loadScript

▸ `Protected` **loadScript**(): `Promise`<`void`\>

###### Returns

`Promise`<`void`\>

___

##### parseRanges

▸ `Protected` **parseRanges**(): `void`

###### Returns

`void`

___

##### processGeneratedAudioFile

▸ `Protected` **processGeneratedAudioFile**(`audioFilePath`): `Promise`<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `audioFilePath` | `string` |

###### Returns

`Promise`<`string`\>

___

##### run

▸ **run**(`reconstructedcommandLine`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `reconstructedcommandLine` | `string` |

###### Returns

`Promise`<`void`\>

___

##### runWithoutCatch

▸ **runWithoutCatch**(`reconstructedcommandLine`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `reconstructedcommandLine` | `string` |

###### Returns

`Promise`<`void`\>

## Enums


<a name="enumsttsservicetypemd"></a>

[tts-narrator](#readmemd) / TtsServiceType

### Enumeration: TtsServiceType

#### Table of contents

##### Enumeration members

- [Azure](#azure)

#### Enumeration members

##### Azure

• **Azure** = `"azure"`

## Interfaces


<a name="interfacesaudiogenerationoptionsmd"></a>

[tts-narrator](#readmemd) / AudioGenerationOptions

### Interface: AudioGenerationOptions

#### Hierarchy

- **`AudioGenerationOptions`**

  ↳ [`AzureAudioGenerationOptions`](#interfacesazureaudiogenerationoptionsmd)

#### Table of contents

##### Properties

- [outputFilePath](#outputfilepath)

#### Properties

##### outputFilePath

• **outputFilePath**: `string`


<a name="interfacesazureaudiogenerationoptionsmd"></a>

[tts-narrator](#readmemd) / AzureAudioGenerationOptions

### Interface: AzureAudioGenerationOptions

#### Hierarchy

- [`AudioGenerationOptions`](#interfacesaudiogenerationoptionsmd)

  ↳ **`AzureAudioGenerationOptions`**

#### Table of contents

##### Properties

- [outputFilePath](#outputfilepath)
- [serviceRegion](#serviceregion)
- [subscriptionKey](#subscriptionkey)

#### Properties

##### outputFilePath

• **outputFilePath**: `string`

###### Inherited from

[AudioGenerationOptions](#interfacesaudiogenerationoptionsmd).[outputFilePath](#outputfilepath)

___

##### serviceRegion

• `Optional` **serviceRegion**: `string`

___

##### subscriptionKey

• `Optional` **subscriptionKey**: `string`


<a name="interfacesnarrationscriptfilechaptermd"></a>

[tts-narrator](#readmemd) / [NarrationScriptFile](#modulesnarrationscriptfilemd) / Chapter

### Interface: Chapter

[NarrationScriptFile](#modulesnarrationscriptfilemd).Chapter

#### Implemented by

- [`NarrationChapter`](#classesnarrationchaptermd)

#### Table of contents

##### Properties

- [key](#key)
- [sections](#sections)
- [settings](#settings)

#### Properties

##### key

• `Optional` **key**: `string`

___

##### sections

• **sections**: [`Section`](#interfacesnarrationscriptfilesectionmd)[]

___

##### settings

• `Optional` **settings**: [`VoiceSettings`](#interfacesvoicesettingsmd)


<a name="interfacesnarrationscriptfileparagraphmd"></a>

[tts-narrator](#readmemd) / [NarrationScriptFile](#modulesnarrationscriptfilemd) / Paragraph

### Interface: Paragraph

[NarrationScriptFile](#modulesnarrationscriptfilemd).Paragraph

#### Implemented by

- [`NarrationParagraph`](#classesnarrationparagraphmd)

#### Table of contents

##### Properties

- [key](#key)
- [settings](#settings)
- [text](#text)

#### Properties

##### key

• `Optional` **key**: `string`

___

##### settings

• `Optional` **settings**: [`VoiceSettings`](#interfacesvoicesettingsmd)

___

##### text

• **text**: `string`


<a name="interfacesnarrationscriptfilescriptmd"></a>

[tts-narrator](#readmemd) / [NarrationScriptFile](#modulesnarrationscriptfilemd) / Script

### Interface: Script

[NarrationScriptFile](#modulesnarrationscriptfilemd).Script

#### Implemented by

- [`NarrationScript`](#classesnarrationscriptmd)

#### Table of contents

##### Properties

- [chapters](#chapters)
- [settings](#settings)

#### Properties

##### chapters

• **chapters**: [`Chapter`](#interfacesnarrationscriptfilechaptermd)[]

___

##### settings

• **settings**: [`ScriptSettings`](#interfacesscriptsettingsmd)


<a name="interfacesnarrationscriptfilesectionmd"></a>

[tts-narrator](#readmemd) / [NarrationScriptFile](#modulesnarrationscriptfilemd) / Section

### Interface: Section

[NarrationScriptFile](#modulesnarrationscriptfilemd).Section

#### Implemented by

- [`NarrationSection`](#classesnarrationsectionmd)

#### Table of contents

##### Properties

- [key](#key)
- [paragraphs](#paragraphs)
- [settings](#settings)

#### Properties

##### key

• `Optional` **key**: `string`

___

##### paragraphs

• **paragraphs**: [`Paragraph`](#interfacesnarrationscriptfileparagraphmd)[]

___

##### settings

• `Optional` **settings**: [`VoiceSettings`](#interfacesvoicesettingsmd)


<a name="interfacesscriptsettingsmd"></a>

[tts-narrator](#readmemd) / ScriptSettings

### Interface: ScriptSettings

#### Table of contents

##### Properties

- [service](#service)
- [voice](#voice)

#### Properties

##### service

• `Optional` **service**: [`Azure`](#azure)

___

##### voice

• `Optional` **voice**: [`VoiceSettings`](#interfacesvoicesettingsmd)


<a name="interfacesttsservicemd"></a>

[tts-narrator](#readmemd) / TtsService

### Interface: TtsService

#### Implemented by

- [`BaseTtsService`](#classesbasettsservicemd)

#### Table of contents

##### Methods

- [generateAudio](#generateaudio)
- [generateSSML](#generatessml)

#### Methods

##### generateAudio

▸ **generateAudio**(`ssml`, `options`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `ssml` | `string` |
| `options` | [`AudioGenerationOptions`](#interfacesaudiogenerationoptionsmd) |

###### Returns

`Promise`<`void`\>

___

##### generateSSML

▸ **generateSSML**(`paragraph`): `Promise`<`string`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`NarrationParagraph`](#classesnarrationparagraphmd) |

###### Returns

`Promise`<`string`\>


<a name="interfacesvoicesettingsmd"></a>

[tts-narrator](#readmemd) / VoiceSettings

### Interface: VoiceSettings

#### Table of contents

##### Properties

- [language](#language)
- [name](#name)

#### Properties

##### language

• `Optional` **language**: `string`

___

##### name

• `Optional` **name**: `string`

## Modules


<a name="modulesnarrationscriptfilemd"></a>

[tts-narrator](#readmemd) / NarrationScriptFile

### Namespace: NarrationScriptFile

#### Table of contents

##### Interfaces

- [Chapter](#interfacesnarrationscriptfilechaptermd)
- [Paragraph](#interfacesnarrationscriptfileparagraphmd)
- [Script](#interfacesnarrationscriptfilescriptmd)
- [Section](#interfacesnarrationscriptfilesectionmd)
<!-- API end -->
