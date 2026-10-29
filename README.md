# tts-narrator

Generate narration with Text-To-Speech technology.
_Please note that you need to have an Azure TTS subscription key or ElevenLabs API key._

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
Please note that SSML is not supported by ElevenLabs. 

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
  $ tts-narrator   FILE [-h] [-v] [-d] [-s azure|elevenlabs]
    [-k <value>] [--api-key-env <value>] [-r <value>] [-f <value>] [-p] [-i]
    [-o] [--dry-run] [--ssml | -q] [--chapters <value>] [--sections <value>] [-u
    <value>]

ARGUMENTS
  FILE  path to the script file (.yml)

FLAGS
  -d, --debug                 output debug information
  -f, --outputFormat=<value>  [default: 3] Output format for audio
  -h, --help                  Show help
  -i, --interactive           wait for key press before entering each section
  -k, --api-key=<value>       Azure Speech service subscription key or
                              ElevenLabs API key
  -o, --overwrite             always overwrite previously generated audio files
  -p, --[no-]play             play generated audio
  -q, --quiet                 output warn and error information only
  -r, --region=<value>        Region of the text-to-speech service
  -s, --service=<option>      text-to-speech service to use
                              <options: azure|elevenlabs>
  -u, --pause=<value>         [default: 0.2] pause in seconds between adjacent
                              paragraphs in generated SRT file
  -v, --version               Show CLI version
      --api-key-env=<value>   Name of the environment variable that holds the
                              Azure Speech service subscription key or
                              ElevenLabs API key
      --chapters=<value>      list of chapters to process, examples:
                              "1-10,13,15", "4-"
      --dry-run               don't try to generate or play audio
      --sections=<value>      list of sections to process, examples:
                              "1-10,13,15", "5-"
      --ssml                  display generated SSML

DESCRIPTION
  Generate narration with Text-To-Speech technology

EXAMPLES
  $ tts-narrator myscript.yml --play --interactive --service azure --api-key-env TTS_SUBSCRIPTION_KEY --region australiaeast

  $ tts-narrator ./test/fixtures/script3.yml -s azure --ssml -r australiaeast --api-key-env=TTS_SUB_KEY  --no-play --interactive -d

  $ tts-narrator ./test/fixtures/script3.yml -s azure -r australiaeast --api-key-env=TTS_SUB_KEY --quiet

  $ tts-narrator ./test/fixtures/script4.yml -s elevenlabs --api-key-env=ELEVENLABS_API_KEY

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

| Module | Description |
| ------ | ------ |
| [audio-utils](#audio-utilsreadmemd) | - |
| [azure-tts-service](#azure-tts-servicereadmemd) | - |
| [elevenlabs-tts-service](#elevenlabs-tts-servicereadmemd) | - |
| [index](#indexreadmemd) | - |
| [narration-script](#narration-scriptreadmemd) | - |
| [script-processor](#script-processorreadmemd) | - |
| [script-processor-flags](#script-processor-flagsreadmemd) | - |
| [tts-narrator](#tts-narratorreadmemd) | - |
| [tts-narrator-cli](#tts-narrator-clireadmemd) | - |
| [tts-service](#tts-servicereadmemd) | - |

## Audio Utils


<a id="audio-utilsreadmemd"></a>

### audio-utils

#### Functions

| Function | Description |
| ------ | ------ |
| [getAudioFileDuration](#audio-utilsfunctionsgetaudiofiledurationmd) | Get the duration of the audio file in milliseconds. An empty (zero-byte) file is treated as audio of zero duration, which can happen when a TTS service reports success but returns no audio data, for example when the text can't be spoken by the voice. If the file is not empty but is corrupted or invalid, throws an error. |
| [playMp3File](#audio-utilsfunctionsplaymp3filemd) | - |

### Functions


<a id="audio-utilsfunctionsgetaudiofiledurationmd"></a>

#### Function: getAudioFileDuration()

> **getAudioFileDuration**(`filePath`): `Promise`\<`number`\>

Get the duration of the audio file in milliseconds.
An empty (zero-byte) file is treated as audio of zero duration, which can happen when a TTS service
reports success but returns no audio data, for example when the text can't be spoken by the voice.
If the file is not empty but is corrupted or invalid, throws an error.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filePath` | `string` | Path to the audio file |

##### Returns

`Promise`\<`number`\>

Duration of the audio file in milliseconds, or 0 if the file is empty.


<a id="audio-utilsfunctionsplaymp3filemd"></a>

#### Function: playMp3File()

> **playMp3File**(`filePath`, `infoLogger`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `filePath` | `string` |
| `infoLogger` | (`msg`) => `void` |

##### Returns

`Promise`\<`void`\>

## Azure Tts Service


<a id="azure-tts-servicereadmemd"></a>

### azure-tts-service

#### Classes

| Class | Description |
| ------ | ------ |
| [AzureTtsService](#azure-tts-serviceclassesazurettsservicemd) | - |

#### Interfaces

| Interface | Description |
| ------ | ------ |
| [AzureAudioGenerationOptions](#azure-tts-serviceinterfacesazureaudiogenerationoptionsmd) | - |

### Classes


<a id="azure-tts-serviceclassesazurettsservicemd"></a>

#### Class: AzureTtsService

##### Extends

- [`BaseTtsService`](#tts-serviceclassesbasettsservicemd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new AzureTtsService**(`options?`): `AzureTtsService`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `Omit`\<[`AzureAudioGenerationOptions`](#azure-tts-serviceinterfacesazureaudiogenerationoptionsmd), `"outputFilePath"`\> |

####### Returns

`AzureTtsService`

####### Overrides

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`constructor`](#api-constructor)

##### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="api-property-options"></a> `options?` | `protected` | `Omit`\<[`AzureAudioGenerationOptions`](#azure-tts-serviceinterfacesazureaudiogenerationoptionsmd), `"outputFilePath"`\> |

##### Methods

<a id="api-buildmsttsexpressasstarttag"></a>

###### buildMsttsExpressAsStartTag()

> `protected` **buildMsttsExpressAsStartTag**(`msttsExpressAsSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `msttsExpressAsSettings` | \{ `role?`: `string`; `style?`: `string`; `styleDegree?`: `string`; \} |
| `msttsExpressAsSettings.role?` | `string` |
| `msttsExpressAsSettings.style?` | `string` |
| `msttsExpressAsSettings.styleDegree?` | `string` |

####### Returns

`string`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildMsttsExpressAsStartTag`](#api-buildmsttsexpressasstarttag)

***

<a id="api-buildprosodystarttag"></a>

###### buildProsodyStartTag()

> `protected` **buildProsodyStartTag**(`prosodySettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `prosodySettings` | \{ `pitch?`: `string`; `rate?`: `string`; `volume?`: `string`; \} |
| `prosodySettings.pitch?` | `string` |
| `prosodySettings.rate?` | `string` |
| `prosodySettings.volume?` | `string` |

####### Returns

`string`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildProsodyStartTag`](#api-buildprosodystarttag)

***

<a id="api-buildspeakstarttag"></a>

###### buildSpeakStartTag()

> `protected` **buildSpeakStartTag**(`voiceSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `voiceSettings` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |

####### Returns

`string`

####### Overrides

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildSpeakStartTag`](#api-buildspeakstarttag)

***

<a id="api-buildvoicestarttag"></a>

###### buildVoiceStartTag()

> `protected` **buildVoiceStartTag**(`voiceSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `voiceSettings` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |

####### Returns

`string`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildVoiceStartTag`](#api-buildvoicestarttag)

***

<a id="api-generateaudio"></a>

###### generateAudio()

> **generateAudio**(`ssml`, `options`): `Promise`\<`any`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `ssml` | `string` |
| `options` | [`AzureAudioGenerationOptions`](#azure-tts-serviceinterfacesazureaudiogenerationoptionsmd) \| `Pick`\<[`AzureAudioGenerationOptions`](#azure-tts-serviceinterfacesazureaudiogenerationoptionsmd), `"outputFilePath"`\> |

####### Returns

`Promise`\<`any`\>

####### Overrides

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`generateAudio`](#api-generateaudio)

***

<a id="api-generatessml"></a>

###### generateSSML()

> **generateSSML**(`paragraph`): `Promise`\<`string`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`Promise`\<`string`\>

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`generateSSML`](#api-generatessml)

***

<a id="api-generatessmlwithoutvalidation"></a>

###### generateSsmlWithoutValidation()

> `protected` **generateSsmlWithoutValidation**(`paragraph`): `object`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`object`

| Name | Type |
| ------ | ------ |
| `lineOffset` | `number` |
| `ssml` | `string` |

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`generateSsmlWithoutValidation`](#api-generatessmlwithoutvalidation)

***

<a id="api-validatexml"></a>

###### validateXML()

> `protected` **validateXML**(`xml`, `lineOffset`): `void`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `xml` | `string` |
| `lineOffset` | `number` |

####### Returns

`void`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`validateXML`](#api-validatexml)

### Interfaces


<a id="azure-tts-serviceinterfacesazureaudiogenerationoptionsmd"></a>

#### Interface: AzureAudioGenerationOptions

##### Extends

- [`AudioGenerationOptions`](#tts-serviceinterfacesaudiogenerationoptionsmd)

##### Properties

| Property | Type | Inherited from |
| ------ | ------ | ------ |
| <a id="api-property-outputfilepath"></a> `outputFilePath` | `string` | [`AudioGenerationOptions`](#tts-serviceinterfacesaudiogenerationoptionsmd).[`outputFilePath`](#api-property-outputfilepath) |
| <a id="api-property-outputformat"></a> `outputFormat?` | `SpeechSynthesisOutputFormat` | - |
| <a id="api-property-serviceregion"></a> `serviceRegion?` | `string` | - |
| <a id="api-property-subscriptionkey"></a> `subscriptionKey?` | `string` | - |

## Elevenlabs Tts Service


<a id="elevenlabs-tts-servicereadmemd"></a>

### elevenlabs-tts-service

#### Classes

| Class | Description |
| ------ | ------ |
| [ElevenLabsTtsService](#elevenlabs-tts-serviceclasseselevenlabsttsservicemd) | - |

#### Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ElevenLabsAudioGenerationOptions](#elevenlabs-tts-servicetype-aliaseselevenlabsaudiogenerationoptionsmd) | - |

### Classes


<a id="elevenlabs-tts-serviceclasseselevenlabsttsservicemd"></a>

#### Class: ElevenLabsTtsService

##### Extends

- [`BaseTtsService`](#tts-serviceclassesbasettsservicemd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new ElevenLabsTtsService**(`options?`): `ElevenLabsTtsService`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `options?` | `Omit`\<[`ElevenLabsAudioGenerationOptions`](#elevenlabs-tts-servicetype-aliaseselevenlabsaudiogenerationoptionsmd), `"outputFilePath"`\> & `object` |

####### Returns

`ElevenLabsTtsService`

####### Overrides

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`constructor`](#api-constructor)

##### Methods

<a id="api-buildmsttsexpressasstarttag"></a>

###### buildMsttsExpressAsStartTag()

> `protected` **buildMsttsExpressAsStartTag**(`msttsExpressAsSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `msttsExpressAsSettings` | \{ `role?`: `string`; `style?`: `string`; `styleDegree?`: `string`; \} |
| `msttsExpressAsSettings.role?` | `string` |
| `msttsExpressAsSettings.style?` | `string` |
| `msttsExpressAsSettings.styleDegree?` | `string` |

####### Returns

`string`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildMsttsExpressAsStartTag`](#api-buildmsttsexpressasstarttag)

***

<a id="api-buildprosodystarttag"></a>

###### buildProsodyStartTag()

> `protected` **buildProsodyStartTag**(`prosodySettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `prosodySettings` | \{ `pitch?`: `string`; `rate?`: `string`; `volume?`: `string`; \} |
| `prosodySettings.pitch?` | `string` |
| `prosodySettings.rate?` | `string` |
| `prosodySettings.volume?` | `string` |

####### Returns

`string`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildProsodyStartTag`](#api-buildprosodystarttag)

***

<a id="api-buildspeakstarttag"></a>

###### buildSpeakStartTag()

> `protected` **buildSpeakStartTag**(`voiceSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `voiceSettings` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |

####### Returns

`string`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildSpeakStartTag`](#api-buildspeakstarttag)

***

<a id="api-buildvoicestarttag"></a>

###### buildVoiceStartTag()

> `protected` **buildVoiceStartTag**(`voiceSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `voiceSettings` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |

####### Returns

`string`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`buildVoiceStartTag`](#api-buildvoicestarttag)

***

<a id="api-generateaudio"></a>

###### generateAudio()

> **generateAudio**(`specJSON`, `options`): `Promise`\<`void`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `specJSON` | `string` |
| `options` | [`ElevenLabsAudioGenerationOptions`](#elevenlabs-tts-servicetype-aliaseselevenlabsaudiogenerationoptionsmd) \| `Pick`\<[`ElevenLabsAudioGenerationOptions`](#elevenlabs-tts-servicetype-aliaseselevenlabsaudiogenerationoptionsmd), `"outputFilePath"`\> |

####### Returns

`Promise`\<`void`\>

####### Overrides

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`generateAudio`](#api-generateaudio)

***

<a id="api-generatessml"></a>

###### generateSSML()

> **generateSSML**(`paragraph`): `Promise`\<`string`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`Promise`\<`string`\>

####### Overrides

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`generateSSML`](#api-generatessml)

***

<a id="api-generatessmlwithoutvalidation"></a>

###### generateSsmlWithoutValidation()

> `protected` **generateSsmlWithoutValidation**(`paragraph`): `object`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`object`

| Name | Type |
| ------ | ------ |
| `lineOffset` | `number` |
| `ssml` | `string` |

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`generateSsmlWithoutValidation`](#api-generatessmlwithoutvalidation)

***

<a id="api-validatexml"></a>

###### validateXML()

> `protected` **validateXML**(`xml`, `lineOffset`): `void`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `xml` | `string` |
| `lineOffset` | `number` |

####### Returns

`void`

####### Inherited from

[`BaseTtsService`](#tts-serviceclassesbasettsservicemd).[`validateXML`](#api-validatexml)

### Type Aliases


<a id="elevenlabs-tts-servicetype-aliaseselevenlabsaudiogenerationoptionsmd"></a>

#### Type Alias: ElevenLabsAudioGenerationOptions

> **ElevenLabsAudioGenerationOptions** = [`AudioGenerationOptions`](#tts-serviceinterfacesaudiogenerationoptionsmd) & `Omit`\<`ElevenLabs.TextToSpeechRequest`, `"text"`\>

## Index


<a id="indexreadmemd"></a>

### index

#### References

<a id="api-audiogenerationoptions"></a>

##### AudioGenerationOptions

Re-exports [AudioGenerationOptions](#tts-serviceinterfacesaudiogenerationoptionsmd)

***

<a id="api-azureaudiogenerationoptions"></a>

##### AzureAudioGenerationOptions

Re-exports [AzureAudioGenerationOptions](#azure-tts-serviceinterfacesazureaudiogenerationoptionsmd)

***

<a id="api-azurettsservice"></a>

##### AzureTtsService

Re-exports [AzureTtsService](#azure-tts-serviceclassesazurettsservicemd)

***

<a id="api-basettsservice"></a>

##### BaseTtsService

Re-exports [BaseTtsService](#tts-serviceclassesbasettsservicemd)

***

<a id="api-elevenlabsaudiogenerationoptions"></a>

##### ElevenLabsAudioGenerationOptions

Re-exports [ElevenLabsAudioGenerationOptions](#elevenlabs-tts-servicetype-aliaseselevenlabsaudiogenerationoptionsmd)

***

<a id="api-elevenlabsttsservice"></a>

##### ElevenLabsTtsService

Re-exports [ElevenLabsTtsService](#elevenlabs-tts-serviceclasseselevenlabsttsservicemd)

***

<a id="api-escapexml"></a>

##### escapeXml

Re-exports [escapeXml](#tts-servicefunctionsescapexmlmd)

***

<a id="api-generatedaudio"></a>

##### GeneratedAudio

Re-exports [GeneratedAudio](#script-processorinterfacesgeneratedaudiomd)

***

<a id="api-getaudiofileduration"></a>

##### getAudioFileDuration

Re-exports [getAudioFileDuration](#audio-utilsfunctionsgetaudiofiledurationmd)

***

<a id="api-loadscript"></a>

##### loadScript

Re-exports [loadScript](#narration-scriptfunctionsloadscriptmd)

***

<a id="api-narrationchapter"></a>

##### NarrationChapter

Re-exports [NarrationChapter](#narration-scriptclassesnarrationchaptermd)

***

<a id="api-narrationparagraph"></a>

##### NarrationParagraph

Re-exports [NarrationParagraph](#narration-scriptclassesnarrationparagraphmd)

***

<a id="api-narrationscript"></a>

##### NarrationScript

Re-exports [NarrationScript](#narration-scriptclassesnarrationscriptmd)

***

<a id="api-narrationscriptfile"></a>

##### NarrationScriptFile

Re-exports [NarrationScriptFile](#narration-scriptnamespacesnarrationscriptfilereadmemd)

***

<a id="api-narrationsection"></a>

##### NarrationSection

Re-exports [NarrationSection](#narration-scriptclassesnarrationsectionmd)

***

<a id="api-normaliserate"></a>

##### normaliseRate

Re-exports [normaliseRate](#tts-servicefunctionsnormaliseratemd)

***

<a id="api-playmp3file"></a>

##### playMp3File

Re-exports [playMp3File](#audio-utilsfunctionsplaymp3filemd)

***

<a id="api-savescript"></a>

##### saveScript

Re-exports [saveScript](#narration-scriptfunctionssavescriptmd)

***

<a id="api-scriptprocessor"></a>

##### ScriptProcessor

Re-exports [ScriptProcessor](#script-processorclassesscriptprocessormd)

***

<a id="api-scriptsettings"></a>

##### ScriptSettings

Re-exports [ScriptSettings](#narration-scriptinterfacesscriptsettingsmd)

***

<a id="api-ttsnarrator"></a>

##### TtsNarrator

Re-exports [TtsNarrator](#tts-narratorclassesttsnarratormd)

***

<a id="api-ttsservice"></a>

##### TtsService

Re-exports [TtsService](#tts-serviceinterfacesttsservicemd)

***

<a id="api-ttsservicetype"></a>

##### TtsServiceType

Re-exports [TtsServiceType](#tts-serviceenumerationsttsservicetypemd)

***

<a id="api-voicesettings"></a>

##### VoiceSettings

Re-exports [VoiceSettings](#narration-scriptinterfacesvoicesettingsmd)

## Narration Script


<a id="narration-scriptreadmemd"></a>

### narration-script

#### Namespaces

| Namespace | Description |
| ------ | ------ |
| [NarrationScriptFile](#narration-scriptnamespacesnarrationscriptfilereadmemd) | - |

#### Classes

| Class | Description |
| ------ | ------ |
| [NarrationChapter](#narration-scriptclassesnarrationchaptermd) | - |
| [NarrationParagraph](#narration-scriptclassesnarrationparagraphmd) | - |
| [NarrationScript](#narration-scriptclassesnarrationscriptmd) | - |
| [NarrationSection](#narration-scriptclassesnarrationsectionmd) | - |

#### Interfaces

| Interface | Description |
| ------ | ------ |
| [ScriptSettings](#narration-scriptinterfacesscriptsettingsmd) | - |
| [VoiceSettings](#narration-scriptinterfacesvoicesettingsmd) | - |

#### Functions

| Function | Description |
| ------ | ------ |
| [loadScript](#narration-scriptfunctionsloadscriptmd) | - |
| [saveScript](#narration-scriptfunctionssavescriptmd) | - |

### Classes


<a id="narration-scriptclassesnarrationchaptermd"></a>

#### Class: NarrationChapter

##### Implements

- [`Chapter`](#narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new NarrationChapter**(`chapter`, `index`, `script`): `NarrationChapter`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `chapter` | [`Chapter`](#narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd) |
| `index` | `number` |
| `script` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) |

####### Returns

`NarrationChapter`

##### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="api-property-chapter"></a> `chapter` | `protected` | [`Chapter`](#narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd) |
| <a id="api-property-index"></a> `index` | `public` | `number` |
| <a id="api-property-script"></a> `script` | `public` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) |
| <a id="api-property-sections"></a> `sections` | `public` | [`NarrationSection`](#narration-scriptclassesnarrationsectionmd)[] |

##### Accessors

<a id="api-key"></a>

###### key

####### Get Signature

> **get** **key**(): `string`

######## Returns

`string`

####### Implementation of

[`Chapter`](#narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd).[`key`](#api-property-key)

***

<a id="api-settings"></a>

###### settings

####### Get Signature

> **get** **settings**(): [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd)

######## Returns

[`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd)

####### Implementation of

[`Chapter`](#narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd).[`settings`](#api-property-settings)

##### Methods

<a id="api-getsectionbykey"></a>

###### getSectionByKey()

> **getSectionByKey**(`key`): [`NarrationSection`](#narration-scriptclassesnarrationsectionmd) \| `undefined`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

####### Returns

[`NarrationSection`](#narration-scriptclassesnarrationsectionmd) \| `undefined`


<a id="narration-scriptclassesnarrationparagraphmd"></a>

#### Class: NarrationParagraph

##### Implements

- [`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new NarrationParagraph**(`paragraph`, `index`, `section`, `chapter`, `script`): `NarrationParagraph`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd) |
| `index` | `number` |
| `section` | [`NarrationSection`](#narration-scriptclassesnarrationsectionmd) |
| `chapter` | [`NarrationChapter`](#narration-scriptclassesnarrationchaptermd) |
| `script` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) |

####### Returns

`NarrationParagraph`

##### Properties

| Property | Modifier | Type | Description |
| ------ | ------ | ------ | ------ |
| <a id="api-property-audiodurationms"></a> `audioDurationMS?` | `public` | `number` | Duration of the generated audio in milliseconds. When it is 0, it could be that the TTS service returned no audio, that means the file could have zero-length. |
| <a id="api-property-audiofilepath"></a> `audioFilePath?` | `public` | `string` | Path of the generated audio file. Only for in-memory processing, not supposed to be stored in file. |
| <a id="api-property-chapter"></a> `chapter` | `public` | [`NarrationChapter`](#narration-scriptclassesnarrationchaptermd) | - |
| <a id="api-property-index"></a> `index` | `public` | `number` | - |
| <a id="api-property-paragraph"></a> `paragraph` | `protected` | [`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd) | - |
| <a id="api-property-script"></a> `script` | `public` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) | - |
| <a id="api-property-section"></a> `section` | `public` | [`NarrationSection`](#narration-scriptclassesnarrationsectionmd) | - |

##### Accessors

<a id="api-key"></a>

###### key

####### Get Signature

> **get** **key**(): `string`

######## Returns

`string`

####### Implementation of

[`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd).[`key`](#api-property-key)

***

<a id="api-settings"></a>

###### settings

####### Get Signature

> **get** **settings**(): [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd)

######## Returns

[`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd)

####### Implementation of

[`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd).[`settings`](#api-property-settings)

***

<a id="api-ssml"></a>

###### ssml

####### Get Signature

> **get** **ssml**(): `string` \| `undefined`

Full or partial SSML (a kind of XML)
If provided, it will be used instead of `text`.
If both `text` and `ssml` are provided, `ssml` will be used.
If both are empty, an error will be thrown.

######## Returns

`string` \| `undefined`

Full or partial SSML (a kind of XML)
If provided, it will be used instead of `text`.
If both `text` and `ssml` are provided, `ssml` will be used.
If both are empty, an error will be thrown.

####### Implementation of

[`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd).[`ssml`](#api-property-ssml)

***

<a id="api-text"></a>

###### text

####### Get Signature

> **get** **text**(): `string` \| `undefined`

Text to be narrated, it can't be XML.
If you want to use XML, use `ssml` property instead.
If both `text` and `ssml` are provided, `ssml` will be used.
If both are empty, an error will be thrown.

######## Returns

`string` \| `undefined`

Text to be narrated, it can't be XML.
If you want to use XML, use `ssml` property instead.
If both `text` and `ssml` are provided, `ssml` will be used.
If both are empty, an error will be thrown.

####### Implementation of

[`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd).[`text`](#api-property-text)


<a id="narration-scriptclassesnarrationscriptmd"></a>

#### Class: NarrationScript

##### Implements

- [`Script`](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new NarrationScript**(`script`, `scriptFilePath`): `NarrationScript`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `script` | [`Script`](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd) |
| `scriptFilePath` | `string` |

####### Returns

`NarrationScript`

##### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="api-property-chapters"></a> `chapters` | `public` | [`NarrationChapter`](#narration-scriptclassesnarrationchaptermd)[] |
| <a id="api-property-script"></a> `script` | `protected` | [`Script`](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd) |
| <a id="api-property-scriptfilepath"></a> `scriptFilePath` | `public` | `string` |

##### Accessors

<a id="api-settings"></a>

###### settings

####### Get Signature

> **get** **settings**(): [`ScriptSettings`](#narration-scriptinterfacesscriptsettingsmd)

######## Returns

[`ScriptSettings`](#narration-scriptinterfacesscriptsettingsmd)

####### Implementation of

[`Script`](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd).[`settings`](#api-property-settings)

##### Methods

<a id="api-export"></a>

###### export()

> **export**(): [`Script`](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd)

####### Returns

[`Script`](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd)

***

<a id="api-getchapterbykey"></a>

###### getChapterByKey()

> **getChapterByKey**(`key`): [`NarrationChapter`](#narration-scriptclassesnarrationchaptermd) \| `undefined`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `string` |

####### Returns

[`NarrationChapter`](#narration-scriptclassesnarrationchaptermd) \| `undefined`


<a id="narration-scriptclassesnarrationsectionmd"></a>

#### Class: NarrationSection

##### Implements

- [`Section`](#narration-scriptnamespacesnarrationscriptfileinterfacessectionmd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new NarrationSection**(`section`, `index`, `chapter`, `script`): `NarrationSection`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `section` | [`Section`](#narration-scriptnamespacesnarrationscriptfileinterfacessectionmd) |
| `index` | `number` |
| `chapter` | [`NarrationChapter`](#narration-scriptclassesnarrationchaptermd) |
| `script` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) |

####### Returns

`NarrationSection`

##### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="api-property-chapter"></a> `chapter` | `public` | [`NarrationChapter`](#narration-scriptclassesnarrationchaptermd) |
| <a id="api-property-index"></a> `index` | `public` | `number` |
| <a id="api-property-paragraphs"></a> `paragraphs` | `public` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd)[] |
| <a id="api-property-script"></a> `script` | `public` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) |
| <a id="api-property-section"></a> `section` | `protected` | [`Section`](#narration-scriptnamespacesnarrationscriptfileinterfacessectionmd) |

##### Accessors

<a id="api-key"></a>

###### key

####### Get Signature

> **get** **key**(): `string`

######## Returns

`string`

####### Implementation of

[`Section`](#narration-scriptnamespacesnarrationscriptfileinterfacessectionmd).[`key`](#api-property-key)

***

<a id="api-settings"></a>

###### settings

####### Get Signature

> **get** **settings**(): [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd)

######## Returns

[`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd)

####### Implementation of

[`Section`](#narration-scriptnamespacesnarrationscriptfileinterfacessectionmd).[`settings`](#api-property-settings)

### Functions


<a id="narration-scriptfunctionsloadscriptmd"></a>

#### Function: loadScript()

> **loadScript**(`scriptFilePath`): `Promise`\<[`NarrationScript`](#narration-scriptclassesnarrationscriptmd)\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `scriptFilePath` | `string` |

##### Returns

`Promise`\<[`NarrationScript`](#narration-scriptclassesnarrationscriptmd)\>


<a id="narration-scriptfunctionssavescriptmd"></a>

#### Function: saveScript()

##### Call Signature

> **saveScript**(`script`): `Promise`\<`void`\>

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `script` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) |

###### Returns

`Promise`\<`void`\>

##### Call Signature

> **saveScript**(`script`, `scriptFilePath`): `Promise`\<`void`\>

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `script` | [`Script`](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd) |
| `scriptFilePath` | `string` |

###### Returns

`Promise`\<`void`\>

### Interfaces


<a id="narration-scriptinterfacesscriptsettingsmd"></a>

#### Interface: ScriptSettings

##### Properties

| Property | Type |
| ------ | ------ |
| <a id="api-property-service"></a> `service?` | [`TtsServiceType`](#tts-serviceenumerationsttsservicetypemd) |
| <a id="api-property-voice"></a> `voice?` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |


<a id="narration-scriptinterfacesvoicesettingsmd"></a>

#### Interface: VoiceSettings

##### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="api-property-effect"></a> `effect?` | `string` | Voice effect, corresponding to `speak.voice#effect` in SSML. |
| <a id="api-property-language"></a> `language?` | `string` | Language, corresponding to `speak#xml:lang` in SSML. |
| <a id="api-property-msttsexpressas"></a> `msttsExpressAs?` | `object` | Corresponding to `speak.voice.mstts:express-as` in SSML. |
| `msttsExpressAs.role?` | `string` | - |
| `msttsExpressAs.style?` | `string` | - |
| `msttsExpressAs.styleDegree?` | `string` | - |
| <a id="api-property-name"></a> `name?` | `string` | Voice name, corresponding to `speak.voice#name` in SSML. |
| <a id="api-property-prosody"></a> `prosody?` | `object` | Corresponding to `speak.voice.prosody` in SSML. |
| `prosody.pitch?` | `string` | - |
| `prosody.rate?` | `string` | - |
| `prosody.volume?` | `string` | - |

### Namespaces

#### Narration Script File


<a id="narration-scriptnamespacesnarrationscriptfilereadmemd"></a>

##### NarrationScriptFile

###### Interfaces

| Interface | Description |
| ------ | ------ |
| [Chapter](#narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd) | - |
| [Paragraph](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd) | - |
| [Script](#narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd) | - |
| [Section](#narration-scriptnamespacesnarrationscriptfileinterfacessectionmd) | - |

##### Interfaces


<a id="narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd"></a>

###### Interface: Chapter

####### Properties

| Property | Type |
| ------ | ------ |
| <a id="api-property-key"></a> `key?` | `string` |
| <a id="api-property-sections"></a> `sections` | [`Section`](#narration-scriptnamespacesnarrationscriptfileinterfacessectionmd)[] |
| <a id="api-property-settings"></a> `settings?` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |


<a id="narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd"></a>

###### Interface: Paragraph

####### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="api-property-key"></a> `key?` | `string` | - |
| <a id="api-property-settings"></a> `settings?` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) | - |
| <a id="api-property-ssml"></a> `ssml?` | `string` | Full or partial SSML (a kind of XML) If provided, it will be used instead of `text`. If both `text` and `ssml` are provided, `ssml` will be used. If both are empty, an error will be thrown. |
| <a id="api-property-text"></a> `text?` | `string` | Text to be narrated, it can't be XML. If you want to use XML, use `ssml` property instead. If both `text` and `ssml` are provided, `ssml` will be used. If both are empty, an error will be thrown. |


<a id="narration-scriptnamespacesnarrationscriptfileinterfacesscriptmd"></a>

###### Interface: Script

####### Properties

| Property | Type |
| ------ | ------ |
| <a id="api-property-chapters"></a> `chapters` | [`Chapter`](#narration-scriptnamespacesnarrationscriptfileinterfaceschaptermd)[] |
| <a id="api-property-settings"></a> `settings` | [`ScriptSettings`](#narration-scriptinterfacesscriptsettingsmd) |


<a id="narration-scriptnamespacesnarrationscriptfileinterfacessectionmd"></a>

###### Interface: Section

####### Properties

| Property | Type |
| ------ | ------ |
| <a id="api-property-key"></a> `key?` | `string` |
| <a id="api-property-paragraphs"></a> `paragraphs` | [`Paragraph`](#narration-scriptnamespacesnarrationscriptfileinterfacesparagraphmd)[] |
| <a id="api-property-settings"></a> `settings?` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |

## Script Processor Flags


<a id="script-processor-flagsreadmemd"></a>

### script-processor-flags

#### Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ScriptProcessorFlags](#script-processor-flagstype-aliasesscriptprocessorflagsmd) | - |

#### Variables

| Variable | Description |
| ------ | ------ |
| [scriptProcessorFlags](#script-processor-flagsvariablesscriptprocessorflagsmd) | CLI flags that are required/used by the ScriptProcessor. |

### Type Aliases


<a id="script-processor-flagstype-aliasesscriptprocessorflagsmd"></a>

#### Type Alias: ScriptProcessorFlags

> **ScriptProcessorFlags** = `CommandOptions`\<\{ `flags`: *typeof* [`scriptProcessorFlags`](#script-processor-flagsvariablesscriptprocessorflagsmd); \}\>\[`"flags"`\]

### Variables


<a id="script-processor-flagsvariablesscriptprocessorflagsmd"></a>

#### Variable: scriptProcessorFlags

> `const` **scriptProcessorFlags**: `object`

CLI flags that are required/used by the ScriptProcessor.

##### Type Declaration

| Name | Type |
| ------ | ------ |
| <a id="api-property-api-key"></a> `api-key` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> |
| <a id="api-property-api-key-env"></a> `api-key-env` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> |
| <a id="api-property-chapters"></a> `chapters` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> |
| <a id="api-property-debug"></a> `debug` | `BooleanFlag`\<`boolean`\> |
| <a id="api-property-dry-run"></a> `dry-run` | `BooleanFlag`\<`boolean`\> |
| <a id="api-property-interactive"></a> `interactive` | `BooleanFlag`\<`boolean`\> |
| <a id="api-property-outputformat"></a> `outputFormat` | `OptionFlag`\<`number`, `CustomOptions`\> |
| <a id="api-property-overwrite"></a> `overwrite` | `BooleanFlag`\<`boolean`\> |
| <a id="api-property-pause"></a> `pause` | `OptionFlag`\<`number`, `CustomOptions`\> |
| <a id="api-property-play"></a> `play` | `BooleanFlag`\<`boolean`\> |
| <a id="api-property-quiet"></a> `quiet` | `BooleanFlag`\<`boolean`\> |
| <a id="api-property-region"></a> `region` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> |
| <a id="api-property-sections"></a> `sections` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> |
| <a id="api-property-service"></a> `service` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> |
| <a id="api-property-ssml"></a> `ssml` | `BooleanFlag`\<`boolean`\> |

## Script Processor


<a id="script-processorreadmemd"></a>

### script-processor

#### Classes

| Class | Description |
| ------ | ------ |
| [ScriptProcessor](#script-processorclassesscriptprocessormd) | - |

#### Interfaces

| Interface | Description |
| ------ | ------ |
| [GeneratedAudio](#script-processorinterfacesgeneratedaudiomd) | An audio file generated for a paragraph, together with its duration. |

### Classes


<a id="script-processorclassesscriptprocessormd"></a>

#### Class: ScriptProcessor

##### Extended by

- [`TtsNarrator`](#tts-narratorclassesttsnarratormd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new ScriptProcessor**(`scriptFilePath`, `flags`, `cliConsole?`): `ScriptProcessor`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `scriptFilePath` | `string` |
| `flags` | `object` & `FlagOutput` & `object` |
| `cliConsole?` | `LineLogger`\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\> |

####### Returns

`ScriptProcessor`

##### Properties

| Property | Modifier | Type |
| ------ | ------ | ------ |
| <a id="api-property-_chalk"></a> `_chalk` | `protected` | `Chalk` & `ChalkFunction` & `object` \| `null` \| `undefined` |
| <a id="api-property-_prompts"></a> `_prompts` | `protected` | *typeof* `prompts` \| `null` \| `undefined` |
| <a id="api-property-_script"></a> `_script` | `protected` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) |
| <a id="api-property-audiogenerationoptions"></a> `audioGenerationOptions` | `protected` | `Omit`\<[`AudioGenerationOptions`](#tts-serviceinterfacesaudiogenerationoptionsmd), `"outputFilePath"`\> \| `undefined` |
| <a id="api-property-chapterrange"></a> `chapterRange` | `protected` | `MultiRange` \| `undefined` |
| <a id="api-property-cliconsole"></a> `cliConsole` | `protected` | `LineLogger` |
| <a id="api-property-flags"></a> `flags` | `protected` | `object` & `FlagOutput` & `object` |
| <a id="api-property-scriptfilepath"></a> `scriptFilePath` | `protected` | `string` |
| <a id="api-property-sectionrange"></a> `sectionRange` | `protected` | `MultiRange` \| `undefined` |
| <a id="api-property-ttsservice"></a> `ttsService` | `protected` | [`TtsService`](#tts-serviceinterfacesttsservicemd) |

##### Accessors

<a id="api-chalk"></a>

###### chalk

####### Get Signature

> **get** `protected` **chalk**(): *typeof* `prompts` \| `null` \| `undefined`

chalk, or null caused by library not available

######## Returns

*typeof* `prompts` \| `null` \| `undefined`

***

<a id="api-prompts"></a>

###### prompts

####### Get Signature

> **get** `protected` **prompts**(): *typeof* `prompts` \| `null` \| `undefined`

prompts function, or null caused by library not available

######## Returns

*typeof* `prompts` \| `null` \| `undefined`

***

<a id="api-script"></a>

###### script

####### Get Signature

> **get** **script**(): [`NarrationScript`](#narration-scriptclassesnarrationscriptmd)

######## Returns

[`NarrationScript`](#narration-scriptclassesnarrationscriptmd)

##### Methods

<a id="api-determineaudiofilepath"></a>

###### determineAudioFilePath()

> `protected` **determineAudioFilePath**(`ssmlHash`, `_paragraph`, `audioFileFolder?`): `Promise`\<`string`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `ssmlHash` | `string` |
| `_paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |
| `audioFileFolder?` | `string` |

####### Returns

`Promise`\<`string`\>

***

<a id="api-getoutputfilefolder"></a>

###### getOutputFileFolder()

> `protected` **getOutputFileFolder**(): `string`

####### Returns

`string`

***

<a id="api-hash"></a>

###### hash()

> `protected` **hash**(`ssml`, `_paragraph`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `ssml` | `string` |
| `_paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`string`

***

<a id="api-initialisettsserviceifneeded"></a>

###### initialiseTtsServiceIfNeeded()

> `protected` **initialiseTtsServiceIfNeeded**(): `Promise`\<`void`\>

####### Returns

`Promise`\<`void`\>

***

<a id="api-loadscriptifneeded"></a>

###### loadScriptIfNeeded()

> `protected` **loadScriptIfNeeded**(): `Promise`\<`void`\>

####### Returns

`Promise`\<`void`\>

***

<a id="api-parseranges"></a>

###### parseRanges()

> `protected` **parseRanges**(): `void`

####### Returns

`void`

***

<a id="api-processgeneratedaudiofile"></a>

###### processGeneratedAudioFile()

> `protected` **processGeneratedAudioFile**(`audio`, `_paragraph`): `Promise`\<[`GeneratedAudio`](#script-processorinterfacesgeneratedaudiomd)\>

Post-process the audio file generated for a paragraph.
Subclasses can override this method to transform the audio, for example to adjust its volume.
It is called for audio files both newly generated and re-used from previous runs,
so an override should write the processed audio to a new file rather than modifying the input file in place,
otherwise a re-used file would be processed more than once.
It is not called for empty audio (zero duration).

####### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `audio` | [`GeneratedAudio`](#script-processorinterfacesgeneratedaudiomd) | The generated audio file and its duration in milliseconds |
| `_paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) | The paragraph that the audio was generated for |

####### Returns

`Promise`\<[`GeneratedAudio`](#script-processorinterfacesgeneratedaudiomd)\>

The processed audio file and its duration in milliseconds. The default implementation returns the input as is.

***

<a id="api-run"></a>

###### run()

> **run**(`reconstructedCommandLine?`): `Promise`\<`void`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `reconstructedCommandLine?` | `string` |

####### Returns

`Promise`\<`void`\>

***

<a id="api-runwithoutcatch"></a>

###### runWithoutCatch()

> **runWithoutCatch**(`reconstructedCommandLine?`): `Promise`\<`void`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `reconstructedCommandLine?` | `string` |

####### Returns

`Promise`\<`void`\>

### Interfaces


<a id="script-processorinterfacesgeneratedaudiomd"></a>

#### Interface: GeneratedAudio

An audio file generated for a paragraph, together with its duration.

##### Properties

| Property | Type | Description |
| ------ | ------ | ------ |
| <a id="api-property-durationms"></a> `durationMS` | `number` | Duration of the audio in milliseconds. When it is 0, it could be that the TTS service returned no audio, that means the file could have zero-length. |
| <a id="api-property-filepath"></a> `filePath` | `string` | Path of the audio file |

## Tts Narrator Cli


<a id="tts-narrator-clireadmemd"></a>

### tts-narrator-cli

#### Classes

| Class | Description |
| ------ | ------ |
| [export=](#tts-narrator-cliclassesexportmd) | - |

### Classes


<a id="tts-narrator-cliclassesexportmd"></a>

#### Class: export=

##### Extends

- `Command`

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new export=**(`argv`, `config`): `TtsNarratorCli`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `argv` | `string`[] |
| `config` | `Config` |

####### Returns

`TtsNarratorCli`

####### Inherited from

`Command.constructor`

##### Properties

| Property | Modifier | Type | Default value | Description | Overrides |
| ------ | ------ | ------ | ------ | ------ | ------ |
| <a id="api-property-args"></a> `args` | `static` | `object` | `...` | An order-dependent object of arguments for the command | `Command.args` |
| `args.file` | `public` | `Arg`\<`string`, `Record`\<`string`, `unknown`\>\> | `...` | - | - |
| <a id="api-property-description"></a> `description` | `static` | `string` | `'Generate narration with Text-To-Speech technology'` | A full description of how to use the command. If no summary, the first line of the description will be used as the summary. | `Command.description` |
| <a id="api-property-examples"></a> `examples` | `static` | `string`[] | `...` | An array of examples to show at the end of the command's help. IF only a string is provided, it will try to look for a line that starts with the cmd.bin as the example command and the rest as the description. If found, the command will be formatted appropriately. `EXAMPLES: A description of a particular use case. $ <%= config.bin => command flags` | `Command.examples` |
| <a id="api-property-flags"></a> `flags` | `static` | `object` | `...` | A hash of flags for the command | `Command.flags` |
| `flags.api-key` | `public` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> | `...` | - | - |
| `flags.api-key-env` | `public` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> | `...` | - | - |
| `flags.chapters` | `public` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> | `...` | - | - |
| `flags.debug` | `public` | `BooleanFlag`\<`boolean`\> | `...` | - | - |
| `flags.dry-run` | `public` | `BooleanFlag`\<`boolean`\> | `...` | - | - |
| `flags.interactive` | `public` | `BooleanFlag`\<`boolean`\> | `...` | - | - |
| `flags.outputFormat` | `public` | `OptionFlag`\<`number`, `CustomOptions`\> | `...` | - | - |
| `flags.overwrite` | `public` | `BooleanFlag`\<`boolean`\> | `...` | - | - |
| `flags.pause` | `public` | `OptionFlag`\<`number`, `CustomOptions`\> | `...` | - | - |
| `flags.play` | `public` | `BooleanFlag`\<`boolean`\> | `...` | - | - |
| `flags.quiet` | `public` | `BooleanFlag`\<`boolean`\> | `...` | - | - |
| `flags.region` | `public` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> | `...` | - | - |
| `flags.sections` | `public` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> | `...` | - | - |
| `flags.service` | `public` | `OptionFlag`\<`string` \| `undefined`, `CustomOptions`\> | `...` | - | - |
| `flags.ssml` | `public` | `BooleanFlag`\<`boolean`\> | `...` | - | - |
| <a id="api-property-id"></a> `id` | `static` | `string` | `' '` | A command ID, used mostly in error or verbose reporting. | `Command.id` |

##### Methods

<a id="api-run"></a>

###### run()

> **run**(): `Promise`\<`void`\>

actual command run code goes here

####### Returns

`Promise`\<`void`\>

####### Overrides

`Command.run`

## Tts Narrator


<a id="tts-narratorreadmemd"></a>

### tts-narrator

#### Classes

| Class | Description |
| ------ | ------ |
| [TtsNarrator](#tts-narratorclassesttsnarratormd) | Class for generating narration. Instance of this class can be used to generate narration audio for scripts by calling the `narrate(...)` method. |

### Classes


<a id="tts-narratorclassesttsnarratormd"></a>

#### Class: TtsNarrator

Class for generating narration.
Instance of this class can be used to generate narration audio for scripts by calling the `narrate(...)` method.

##### Example

```ts
const ttsService = new AzureTtsService(...);
const ttsNarrator = new TtsNarrator(ttsService, './output-folder');
const script = await loadScript('./my-script.yml');
await ttsNarrator.narrate(script);
console.log(`One of the generated audio file is: ${script.chapters[0].sections[0].paragraphs[0].audioFilePath}`);
```

##### Extends

- [`ScriptProcessor`](#script-processorclassesscriptprocessormd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new TtsNarrator**(`ttsService`, `audioFileFolder`, `options?`, `cliConsole?`): `TtsNarrator`

Constructor

####### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `ttsService` | [`TtsService`](#tts-serviceinterfacesttsservicemd) | `undefined` | The TTS service to be used for generating audio |
| `audioFileFolder` | `string` | `undefined` | The folder that generated audio files will be placed |
| `options?` | `Partial`\<`object` & `FlagOutput` & `object`\> | `undefined` | Optional settings |
| `cliConsole?` | `LineLogger` | `silentLogger` | Optional logger |

####### Returns

`TtsNarrator`

####### Overrides

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`constructor`](#api-constructor)

##### Properties

| Property | Modifier | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ | ------ |
| <a id="api-property-_chalk"></a> `_chalk` | `protected` | `Chalk` & `ChalkFunction` & `object` \| `null` \| `undefined` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`_chalk`](#api-property-_chalk) |
| <a id="api-property-_prompts"></a> `_prompts` | `protected` | *typeof* `prompts` \| `null` \| `undefined` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`_prompts`](#api-property-_prompts) |
| <a id="api-property-_script"></a> `_script` | `protected` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`_script`](#api-property-_script) |
| <a id="api-property-audiofilefolder"></a> `audioFileFolder` | `protected` | `string` | The folder that generated audio files will be placed | - |
| <a id="api-property-audiogenerationoptions"></a> `audioGenerationOptions` | `protected` | `Omit`\<[`AudioGenerationOptions`](#tts-serviceinterfacesaudiogenerationoptionsmd), `"outputFilePath"`\> \| `undefined` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`audioGenerationOptions`](#api-property-audiogenerationoptions) |
| <a id="api-property-chapterrange"></a> `chapterRange` | `protected` | `MultiRange` \| `undefined` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`chapterRange`](#api-property-chapterrange) |
| <a id="api-property-cliconsole"></a> `cliConsole` | `protected` | `LineLogger` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`cliConsole`](#api-property-cliconsole) |
| <a id="api-property-flags"></a> `flags` | `protected` | `object` & `FlagOutput` & `object` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`flags`](#api-property-flags) |
| <a id="api-property-scriptfilepath"></a> `scriptFilePath` | `protected` | `string` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`scriptFilePath`](#api-property-scriptfilepath) |
| <a id="api-property-sectionrange"></a> `sectionRange` | `protected` | `MultiRange` \| `undefined` | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`sectionRange`](#api-property-sectionrange) |
| <a id="api-property-ttsservice"></a> `ttsService` | `protected` | [`TtsService`](#tts-serviceinterfacesttsservicemd) | - | [`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`ttsService`](#api-property-ttsservice) |

##### Accessors

<a id="api-chalk"></a>

###### chalk

####### Get Signature

> **get** `protected` **chalk**(): *typeof* `prompts` \| `null` \| `undefined`

chalk, or null caused by library not available

######## Returns

*typeof* `prompts` \| `null` \| `undefined`

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`chalk`](#api-chalk)

***

<a id="api-prompts"></a>

###### prompts

####### Get Signature

> **get** `protected` **prompts**(): *typeof* `prompts` \| `null` \| `undefined`

prompts function, or null caused by library not available

######## Returns

*typeof* `prompts` \| `null` \| `undefined`

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`prompts`](#api-prompts)

***

<a id="api-script"></a>

###### script

####### Get Signature

> **get** **script**(): [`NarrationScript`](#narration-scriptclassesnarrationscriptmd)

######## Returns

[`NarrationScript`](#narration-scriptclassesnarrationscriptmd)

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`script`](#api-script)

##### Methods

<a id="api-determineaudiofilepath"></a>

###### determineAudioFilePath()

> `protected` **determineAudioFilePath**(`ssmlHash`, `_paragraph`): `Promise`\<`string`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `ssmlHash` | `string` |
| `_paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`Promise`\<`string`\>

####### Overrides

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`determineAudioFilePath`](#api-determineaudiofilepath)

***

<a id="api-getoutputfilefolder"></a>

###### getOutputFileFolder()

> `protected` **getOutputFileFolder**(): `string`

####### Returns

`string`

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`getOutputFileFolder`](#api-getoutputfilefolder)

***

<a id="api-hash"></a>

###### hash()

> `protected` **hash**(`ssml`, `_paragraph`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `ssml` | `string` |
| `_paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`string`

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`hash`](#api-hash)

***

<a id="api-initialisettsserviceifneeded"></a>

###### initialiseTtsServiceIfNeeded()

> `protected` **initialiseTtsServiceIfNeeded**(): `Promise`\<`void`\>

####### Returns

`Promise`\<`void`\>

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`initialiseTtsServiceIfNeeded`](#api-initialisettsserviceifneeded)

***

<a id="api-loadscriptifneeded"></a>

###### loadScriptIfNeeded()

> `protected` **loadScriptIfNeeded**(): `Promise`\<`void`\>

####### Returns

`Promise`\<`void`\>

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`loadScriptIfNeeded`](#api-loadscriptifneeded)

***

<a id="api-narrate"></a>

###### narrate()

> **narrate**(`script`): `Promise`\<`void`\>

Generate narration for the script

####### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `script` | [`NarrationScript`](#narration-scriptclassesnarrationscriptmd) | the input script which will also be modified for recording audioFilePath and audioDurationMS |

####### Returns

`Promise`\<`void`\>

nothing

***

<a id="api-parseranges"></a>

###### parseRanges()

> `protected` **parseRanges**(): `void`

####### Returns

`void`

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`parseRanges`](#api-parseranges)

***

<a id="api-processgeneratedaudiofile"></a>

###### processGeneratedAudioFile()

> `protected` **processGeneratedAudioFile**(`audio`, `_paragraph`): `Promise`\<[`GeneratedAudio`](#script-processorinterfacesgeneratedaudiomd)\>

Post-process the audio file generated for a paragraph.
Subclasses can override this method to transform the audio, for example to adjust its volume.
It is called for audio files both newly generated and re-used from previous runs,
so an override should write the processed audio to a new file rather than modifying the input file in place,
otherwise a re-used file would be processed more than once.
It is not called for empty audio (zero duration).

####### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `audio` | [`GeneratedAudio`](#script-processorinterfacesgeneratedaudiomd) | The generated audio file and its duration in milliseconds |
| `_paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) | The paragraph that the audio was generated for |

####### Returns

`Promise`\<[`GeneratedAudio`](#script-processorinterfacesgeneratedaudiomd)\>

The processed audio file and its duration in milliseconds. The default implementation returns the input as is.

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`processGeneratedAudioFile`](#api-processgeneratedaudiofile)

***

<a id="api-run"></a>

###### run()

> **run**(`reconstructedCommandLine?`): `Promise`\<`void`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `reconstructedCommandLine?` | `string` |

####### Returns

`Promise`\<`void`\>

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`run`](#api-run)

***

<a id="api-runwithoutcatch"></a>

###### runWithoutCatch()

> **runWithoutCatch**(`reconstructedCommandLine?`): `Promise`\<`void`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `reconstructedCommandLine?` | `string` |

####### Returns

`Promise`\<`void`\>

####### Inherited from

[`ScriptProcessor`](#script-processorclassesscriptprocessormd).[`runWithoutCatch`](#api-runwithoutcatch)

## Tts Service


<a id="tts-servicereadmemd"></a>

### tts-service

#### Enumerations

| Enumeration | Description |
| ------ | ------ |
| [TtsServiceType](#tts-serviceenumerationsttsservicetypemd) | - |

#### Classes

| Class | Description |
| ------ | ------ |
| [BaseTtsService](#tts-serviceclassesbasettsservicemd) | - |

#### Interfaces

| Interface | Description |
| ------ | ------ |
| [AudioGenerationOptions](#tts-serviceinterfacesaudiogenerationoptionsmd) | - |
| [TtsService](#tts-serviceinterfacesttsservicemd) | - |

#### Functions

| Function | Description |
| ------ | ------ |
| [escapeXml](#tts-servicefunctionsescapexmlmd) | - |
| [normaliseRate](#tts-servicefunctionsnormaliseratemd) | - |

### Classes


<a id="tts-serviceclassesbasettsservicemd"></a>

#### Abstract Class: BaseTtsService

##### Extended by

- [`AzureTtsService`](#azure-tts-serviceclassesazurettsservicemd)
- [`ElevenLabsTtsService`](#elevenlabs-tts-serviceclasseselevenlabsttsservicemd)

##### Implements

- [`TtsService`](#tts-serviceinterfacesttsservicemd)

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new BaseTtsService**(): `BaseTtsService`

####### Returns

`BaseTtsService`

##### Methods

<a id="api-buildmsttsexpressasstarttag"></a>

###### buildMsttsExpressAsStartTag()

> `protected` **buildMsttsExpressAsStartTag**(`msttsExpressAsSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `msttsExpressAsSettings` | \{ `role?`: `string`; `style?`: `string`; `styleDegree?`: `string`; \} |
| `msttsExpressAsSettings.role?` | `string` |
| `msttsExpressAsSettings.style?` | `string` |
| `msttsExpressAsSettings.styleDegree?` | `string` |

####### Returns

`string`

***

<a id="api-buildprosodystarttag"></a>

###### buildProsodyStartTag()

> `protected` **buildProsodyStartTag**(`prosodySettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `prosodySettings` | \{ `pitch?`: `string`; `rate?`: `string`; `volume?`: `string`; \} |
| `prosodySettings.pitch?` | `string` |
| `prosodySettings.rate?` | `string` |
| `prosodySettings.volume?` | `string` |

####### Returns

`string`

***

<a id="api-buildspeakstarttag"></a>

###### buildSpeakStartTag()

> `protected` **buildSpeakStartTag**(`voiceSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `voiceSettings` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |

####### Returns

`string`

***

<a id="api-buildvoicestarttag"></a>

###### buildVoiceStartTag()

> `protected` **buildVoiceStartTag**(`voiceSettings`): `string`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `voiceSettings` | [`VoiceSettings`](#narration-scriptinterfacesvoicesettingsmd) |

####### Returns

`string`

***

<a id="api-generateaudio"></a>

###### generateAudio()

> **generateAudio**(`_ssml`, `_options`): `Promise`\<`void`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `_ssml` | `string` |
| `_options` | [`AudioGenerationOptions`](#tts-serviceinterfacesaudiogenerationoptionsmd) |

####### Returns

`Promise`\<`void`\>

####### Implementation of

[`TtsService`](#tts-serviceinterfacesttsservicemd).[`generateAudio`](#api-generateaudio)

***

<a id="api-generatessml"></a>

###### generateSSML()

> **generateSSML**(`paragraph`): `Promise`\<`string`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`Promise`\<`string`\>

####### Implementation of

[`TtsService`](#tts-serviceinterfacesttsservicemd).[`generateSSML`](#api-generatessml)

***

<a id="api-generatessmlwithoutvalidation"></a>

###### generateSsmlWithoutValidation()

> `protected` **generateSsmlWithoutValidation**(`paragraph`): `object`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`object`

| Name | Type |
| ------ | ------ |
| `lineOffset` | `number` |
| `ssml` | `string` |

***

<a id="api-validatexml"></a>

###### validateXML()

> `protected` **validateXML**(`xml`, `lineOffset`): `void`

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `xml` | `string` |
| `lineOffset` | `number` |

####### Returns

`void`

### Enumerations


<a id="tts-serviceenumerationsttsservicetypemd"></a>

#### Enumeration: TtsServiceType

##### Enumeration Members

| Enumeration Member | Value |
| ------ | ------ |
| <a id="api-enumeration-member-azure"></a> `Azure` | `"azure"` |
| <a id="api-enumeration-member-elevenlabs"></a> `ElevenLabs` | `"elevenlabs"` |

### Functions


<a id="tts-servicefunctionsescapexmlmd"></a>

#### Function: escapeXml()

> **escapeXml**(`text`): `string`

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `text` | `string` |

##### Returns

`string`


<a id="tts-servicefunctionsnormaliseratemd"></a>

#### Function: normaliseRate()

> **normaliseRate**(`rate?`, `min?`, `max?`): `number` \| `undefined`

##### Parameters

| Parameter | Type | Default value |
| ------ | ------ | ------ |
| `rate?` | `string` | `undefined` |
| `min?` | `number` | `0.5` |
| `max?` | `number` | `2` |

##### Returns

`number` \| `undefined`

### Interfaces


<a id="tts-serviceinterfacesaudiogenerationoptionsmd"></a>

#### Interface: AudioGenerationOptions

##### Extended by

- [`AzureAudioGenerationOptions`](#azure-tts-serviceinterfacesazureaudiogenerationoptionsmd)

##### Properties

| Property | Type |
| ------ | ------ |
| <a id="api-property-outputfilepath"></a> `outputFilePath` | `string` |


<a id="tts-serviceinterfacesttsservicemd"></a>

#### Interface: TtsService

##### Methods

<a id="api-generateaudio"></a>

###### generateAudio()

> **generateAudio**(`ssml`, `options`): `Promise`\<`void`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `ssml` | `string` |
| `options` | [`AudioGenerationOptions`](#tts-serviceinterfacesaudiogenerationoptionsmd) |

####### Returns

`Promise`\<`void`\>

***

<a id="api-generatessml"></a>

###### generateSSML()

> **generateSSML**(`paragraph`): `Promise`\<`string`\>

####### Parameters

| Parameter | Type |
| ------ | ------ |
| `paragraph` | [`NarrationParagraph`](#narration-scriptclassesnarrationparagraphmd) |

####### Returns

`Promise`\<`string`\>
<!-- API end -->
