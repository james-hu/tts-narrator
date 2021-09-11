# tts-narrator

Generate narration with Text-To-Speech technology

[![Version](https://img.shields.io/npm/v/tts-narrator.svg)](https://npmjs.org/package/tts-narrator)
[![Downloads/week](https://img.shields.io/npm/dw/tts-narrator.svg)](https://npmjs.org/package/tts-narrator)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)


This may be needed on MacOS for avoiding `illegal hardware instruction` issue: `npm install speaker --mpg123-backend=openal`

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

  -i, --interactive                            wait for key press before start
                                               playing next paragraph

  -k, --subscription-key=subscription-key      Azure Speech service subscription
                                               key

  -o, --overwrite                              always overwrite previously
                                               generated audio files

  -p, --[no-]play                              play generated audio

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

EXAMPLE
  tts-narrator myscript.yml --play --interactive --service azure 
  --subscription-key-env SUBSCRIPTION_KEY --region australiaeast
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

#### Classes

- [AzureTtsService](#classesazurettsservicemd)
- [BaseTtsService](#classesbasettsservicemd)
- [NarrationChapter](#classesnarrationchaptermd)
- [NarrationParagraph](#classesnarrationparagraphmd)
- [NarrationScript](#classesnarrationscriptmd)
- [NarrationSection](#classesnarrationsectionmd)

#### Interfaces

- [AudioGenerationOptions](#interfacesaudiogenerationoptionsmd)
- [AzureAudioGenerationOptions](#interfacesazureaudiogenerationoptionsmd)
- [ScriptSettings](#interfacesscriptsettingsmd)
- [TtsService](#interfacesttsservicemd)
- [VoiceSettings](#interfacesvoicesettingsmd)

#### Functions

- [getAudioFileDuration](#getaudiofileduration)
- [loadScript](#loadscript)
- [playMp3File](#playmp3file)
- [saveScript](#savescript)

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

#### Properties

##### key

• `Optional` **key**: `string`

___

##### sections

• **sections**: [`Section`](#interfacesnarrationscriptfilesectionmd)[]


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

#### Properties

##### key

• `Optional` **key**: `string`

___

##### paragraphs

• **paragraphs**: [`Paragraph`](#interfacesnarrationscriptfileparagraphmd)[]


<a name="interfacesscriptsettingsmd"></a>

[tts-narrator](#readmemd) / ScriptSettings

### Interface: ScriptSettings

#### Table of contents

##### Properties

- [voice](#voice)

#### Properties

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