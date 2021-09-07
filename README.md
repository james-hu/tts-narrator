# tts-narrator
Generate narration with Text-To-Speech technology

# API

<!-- API start -->
<a name="readmemd"></a>

tts-narrator

## tts-narrator

### Table of contents

#### Modules

- [index](#modulesindexmd)
- [narration-script](#modulesnarration_scriptmd)

## Classes


<a name="classesnarration_scriptnarrationchaptermd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / NarrationChapter

### Class: NarrationChapter

[narration-script](#modulesnarration_scriptmd).NarrationChapter

#### Implements

- [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [chapter](#chapter)
- [script](#script)
- [sections](#sections)

##### Accessors

- [key](#key)

##### Methods

- [getSectionByKey](#getsectionbykey)

#### Constructors

##### constructor

• **new NarrationChapter**(`chapter`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `chapter` | [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd) |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

#### Properties

##### chapter

• `Protected` **chapter**: [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd)

___

##### script

• **script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

___

##### sections

• **sections**: [`NarrationSection`](#classesnarration_scriptnarrationsectionmd)[]

###### Implementation of

[Chapter](#interfacesnarration_scriptnarrationscriptfilechaptermd).[sections](#sections)

#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Chapter](#interfacesnarration_scriptnarrationscriptfilechaptermd).[key](#key)

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

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / NarrationParagraph

### Class: NarrationParagraph

[narration-script](#modulesnarration_scriptmd).NarrationParagraph

#### Implements

- [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [chapter](#chapter)
- [paragraph](#paragraph)
- [script](#script)
- [section](#section)

##### Accessors

- [settings](#settings)
- [text](#text)

#### Constructors

##### constructor

• **new NarrationParagraph**(`paragraph`, `section`, `chapter`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `paragraph` | [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd) |
| `section` | [`NarrationSection`](#classesnarration_scriptnarrationsectionmd) |
| `chapter` | [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd) |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

#### Properties

##### chapter

• **chapter**: [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)

___

##### paragraph

• `Protected` **paragraph**: [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd)

___

##### script

• **script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

___

##### section

• **section**: [`NarrationSection`](#classesnarration_scriptnarrationsectionmd)

#### Accessors

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

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / NarrationScript

### Class: NarrationScript

[narration-script](#modulesnarration_scriptmd).NarrationScript

#### Implements

- [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd)

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
| `script` | [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd) |
| `scriptFilePath` | `string` |

#### Properties

##### chapters

• **chapters**: [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)[]

###### Implementation of

[Script](#interfacesnarration_scriptnarrationscriptfilescriptmd).[chapters](#chapters)

___

##### script

• `Protected` **script**: [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd)

___

##### scriptFilePath

• **scriptFilePath**: `string`

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

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / NarrationSection

### Class: NarrationSection

[narration-script](#modulesnarration_scriptmd).NarrationSection

#### Implements

- [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd)

#### Table of contents

##### Constructors

- [constructor](#constructor)

##### Properties

- [chapter](#chapter)
- [paragraphs](#paragraphs)
- [script](#script)
- [section](#section)

##### Accessors

- [key](#key)

#### Constructors

##### constructor

• **new NarrationSection**(`section`, `chapter`, `script`)

###### Parameters

| Name | Type |
| :------ | :------ |
| `section` | [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd) |
| `chapter` | [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd) |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

#### Properties

##### chapter

• **chapter**: [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)

___

##### paragraphs

• **paragraphs**: [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd)[]

###### Implementation of

[Section](#interfacesnarration_scriptnarrationscriptfilesectionmd).[paragraphs](#paragraphs)

___

##### script

• **script**: [`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

___

##### section

• `Protected` **section**: [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd)

#### Accessors

##### key

• `get` **key**(): `string`

###### Returns

`string`

###### Implementation of

[Section](#interfacesnarration_scriptnarrationscriptfilesectionmd).[key](#key)

## Interfaces


<a name="interfacesnarration_scriptnarrationscriptfilechaptermd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd) / Chapter

### Interface: Chapter

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Chapter

#### Implemented by

- [`NarrationChapter`](#classesnarration_scriptnarrationchaptermd)

#### Table of contents

##### Properties

- [key](#key)
- [sections](#sections)

#### Properties

##### key

• **key**: `string`

___

##### sections

• **sections**: [`Section`](#interfacesnarration_scriptnarrationscriptfilesectionmd)[]


<a name="interfacesnarration_scriptnarrationscriptfileparagraphmd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd) / Paragraph

### Interface: Paragraph

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Paragraph

#### Implemented by

- [`NarrationParagraph`](#classesnarration_scriptnarrationparagraphmd)

#### Table of contents

##### Properties

- [settings](#settings)
- [text](#text)

#### Properties

##### settings

• `Optional` **settings**: [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)

___

##### text

• **text**: `string`


<a name="interfacesnarration_scriptnarrationscriptfilescriptmd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd) / Script

### Interface: Script

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Script

#### Implemented by

- [`NarrationScript`](#classesnarration_scriptnarrationscriptmd)

#### Table of contents

##### Properties

- [chapters](#chapters)
- [settings](#settings)

#### Properties

##### chapters

• **chapters**: [`Chapter`](#interfacesnarration_scriptnarrationscriptfilechaptermd)[]

___

##### settings

• **settings**: [`ScriptSettings`](#interfacesnarration_scriptscriptsettingsmd)


<a name="interfacesnarration_scriptnarrationscriptfilesectionmd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd) / Section

### Interface: Section

[narration-script](#modulesnarration_scriptmd).[NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd).Section

#### Implemented by

- [`NarrationSection`](#classesnarration_scriptnarrationsectionmd)

#### Table of contents

##### Properties

- [key](#key)
- [paragraphs](#paragraphs)

#### Properties

##### key

• **key**: `string`

___

##### paragraphs

• **paragraphs**: [`Paragraph`](#interfacesnarration_scriptnarrationscriptfileparagraphmd)[]


<a name="interfacesnarration_scriptscriptsettingsmd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / ScriptSettings

### Interface: ScriptSettings

[narration-script](#modulesnarration_scriptmd).ScriptSettings

#### Table of contents

##### Properties

- [voice](#voice)

#### Properties

##### voice

• `Optional` **voice**: [`VoiceSettings`](#interfacesnarration_scriptvoicesettingsmd)


<a name="interfacesnarration_scriptvoicesettingsmd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / VoiceSettings

### Interface: VoiceSettings

[narration-script](#modulesnarration_scriptmd).VoiceSettings

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


<a name="modulesindexmd"></a>

[tts-narrator](#readmemd) / index

### Module: index

#### Table of contents

##### References

- [NarrationChapter](#narrationchapter)
- [NarrationParagraph](#narrationparagraph)
- [NarrationScript](#narrationscript)
- [NarrationScriptFile](#narrationscriptfile)
- [NarrationSection](#narrationsection)
- [ScriptSettings](#scriptsettings)
- [VoiceSettings](#voicesettings)
- [loadScript](#loadscript)
- [saveScript](#savescript)

#### References

##### NarrationChapter

Re-exports: [NarrationChapter](#classesnarration_scriptnarrationchaptermd)

___

##### NarrationParagraph

Re-exports: [NarrationParagraph](#classesnarration_scriptnarrationparagraphmd)

___

##### NarrationScript

Re-exports: [NarrationScript](#classesnarration_scriptnarrationscriptmd)

___

##### NarrationScriptFile

Re-exports: [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd)

___

##### NarrationSection

Re-exports: [NarrationSection](#classesnarration_scriptnarrationsectionmd)

___

##### ScriptSettings

Re-exports: [ScriptSettings](#interfacesnarration_scriptscriptsettingsmd)

___

##### VoiceSettings

Re-exports: [VoiceSettings](#interfacesnarration_scriptvoicesettingsmd)

___

##### loadScript

Re-exports: [loadScript](#loadscript)

___

##### saveScript

Re-exports: [saveScript](#savescript)


<a name="modulesnarration_scriptnarrationscriptfilemd"></a>

[tts-narrator](#readmemd) / [narration-script](#modulesnarration_scriptmd) / NarrationScriptFile

### Namespace: NarrationScriptFile

[narration-script](#modulesnarration_scriptmd).NarrationScriptFile

#### Table of contents

##### Interfaces

- [Chapter](#interfacesnarration_scriptnarrationscriptfilechaptermd)
- [Paragraph](#interfacesnarration_scriptnarrationscriptfileparagraphmd)
- [Script](#interfacesnarration_scriptnarrationscriptfilescriptmd)
- [Section](#interfacesnarration_scriptnarrationscriptfilesectionmd)


<a name="modulesnarration_scriptmd"></a>

[tts-narrator](#readmemd) / narration-script

### Module: narration-script

#### Table of contents

##### Namespaces

- [NarrationScriptFile](#modulesnarration_scriptnarrationscriptfilemd)

##### Classes

- [NarrationChapter](#classesnarration_scriptnarrationchaptermd)
- [NarrationParagraph](#classesnarration_scriptnarrationparagraphmd)
- [NarrationScript](#classesnarration_scriptnarrationscriptmd)
- [NarrationSection](#classesnarration_scriptnarrationsectionmd)

##### Interfaces

- [ScriptSettings](#interfacesnarration_scriptscriptsettingsmd)
- [VoiceSettings](#interfacesnarration_scriptvoicesettingsmd)

##### Functions

- [loadScript](#loadscript)
- [saveScript](#savescript)

#### Functions

##### loadScript

▸ **loadScript**(`scriptFilePath`): `Promise`<[`NarrationScript`](#classesnarration_scriptnarrationscriptmd)\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `scriptFilePath` | `string` |

###### Returns

`Promise`<[`NarrationScript`](#classesnarration_scriptnarrationscriptmd)\>

___

##### saveScript

▸ **saveScript**(`script`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`NarrationScript`](#classesnarration_scriptnarrationscriptmd) |

###### Returns

`Promise`<`void`\>

▸ **saveScript**(`script`, `scriptFilePath`): `Promise`<`void`\>

###### Parameters

| Name | Type |
| :------ | :------ |
| `script` | [`Script`](#interfacesnarration_scriptnarrationscriptfilescriptmd) |
| `scriptFilePath` | `string` |

###### Returns

`Promise`<`void`\>
<!-- API end -->