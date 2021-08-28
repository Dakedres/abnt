## Classes

<dl>
<dt><a href="#BundleAPI">BundleAPI</a></dt>
<dd><p>Class for interacting with the data in the bundle</p>
</dd>
<dt><a href="#Dirent">Dirent</a></dt>
<dd><p>Represents an entry in a directory</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#$bundle">$bundle</a> : <code><a href="#BundleAPI">BundleAPI</a></code></dt>
<dd></dd>
</dl>

<a name="BundleAPI"></a>

## BundleAPI
Class for interacting with the data in the bundle

**Kind**: global class  

* [BundleAPI](#BundleAPI)
    * [.for(path)](#BundleAPI+for) ⇒ [<code>BundleAPI</code>](#BundleAPI)
    * [.resolveRelative(path)](#BundleAPI+resolveRelative) ⇒ <code>String</code>
    * [.readDir(path, asEntries)](#BundleAPI+readDir) ⇒ <code>Array.&lt;String&gt;</code> \| [<code>Array.&lt;Dirent&gt;</code>](#Dirent)
    * [.access(path)](#BundleAPI+access) ⇒ <code>Boolean</code>
    * [.load(path, [window])](#BundleAPI+load) ⇒ <code>HTMLScriptElement</code>
    * [.open(path, format)](#BundleAPI+open) ⇒ <code>Promise</code>
    * [.openSync(path, format)](#BundleAPI+openSync) ⇒ <code>URL</code> \| <code>Blob</code> \| <code>ArrayBuffer</code> \| <code>String</code>
    * [.cwd](#BundleAPI+cwd) : <code>String</code>
    * [.location](#BundleAPI+location) : <code>String</code>

<a name="BundleAPI+for"></a>

### bundleAPI.for(path) ⇒ [<code>BundleAPI</code>](#BundleAPI)
Returns an instance of the API for a different working directory.

**Kind**: instance method of [<code>BundleAPI</code>](#BundleAPI)  
**Returns**: [<code>BundleAPI</code>](#BundleAPI) - The new API instance  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The new working directory |

<a name="BundleAPI+resolveRelative"></a>

### bundleAPI.resolveRelative(path) ⇒ <code>String</code>
Resolves an absolute path in the bundle from the API's current working directory.

**Kind**: instance method of [<code>BundleAPI</code>](#BundleAPI)  
**Returns**: <code>String</code> - Absolute path  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | Relative path |

<a name="BundleAPI+readDir"></a>

### bundleAPI.readDir(path, asEntries) ⇒ <code>Array.&lt;String&gt;</code> \| [<code>Array.&lt;Dirent&gt;</code>](#Dirent)
Lists the contents of a directory

**Kind**: instance method of [<code>BundleAPI</code>](#BundleAPI)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| path | <code>String</code> | <code>.</code> | The path to the directory to list the contents of |
| asEntries | <code>Boolean</code> | <code>false</code> | Whether or not to return the entries as [Dirent](#Dirent) objects |

<a name="BundleAPI+access"></a>

### bundleAPI.access(path) ⇒ <code>Boolean</code>
Checks if an entry exists

**Kind**: instance method of [<code>BundleAPI</code>](#BundleAPI)  
**Returns**: <code>Boolean</code> - Whether or not the entry exists  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The path to the directory or file to check |

<a name="BundleAPI+load"></a>

### bundleAPI.load(path, [window]) ⇒ <code>HTMLScriptElement</code>
Loads a JavaScript file with the $bundle api.

**Kind**: instance method of [<code>BundleAPI</code>](#BundleAPI)  
**Returns**: <code>HTMLScriptElement</code> - The script element that loaded the file  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The path to the Javscript file you want to run. |
| [window] | <code>Window</code> | Window to load the script into, only supports child windows. |

<a name="BundleAPI+open"></a>

### bundleAPI.open(path, format) ⇒ <code>Promise</code>
Returns a file's content from the bundle.

**Kind**: instance method of [<code>BundleAPI</code>](#BundleAPI)  
**Returns**: <code>Promise</code> - The file contents.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The path to the file you want to open. |
| format | <code>String</code> | Class type you want the file data returned in, supports URL, Blob and anything that can be converted from it by $io. |

<a name="BundleAPI+openSync"></a>

### bundleAPI.openSync(path, format) ⇒ <code>URL</code> \| <code>Blob</code> \| <code>ArrayBuffer</code> \| <code>String</code>
Like [ open()](BundleAPI.open) but sync, and with a smaller range of format support

**Kind**: instance method of [<code>BundleAPI</code>](#BundleAPI)  
**Returns**: <code>URL</code> \| <code>Blob</code> \| <code>ArrayBuffer</code> \| <code>String</code> - The file contents.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The path to the file you want to open. |
| format | <code>String</code> | Class type you want the file data returned in, this can be URL, Blob, ArrayBuffer, or String |

<a name="BundleAPI+cwd"></a>

### bundleAPI.cwd : <code>String</code>
The current working directory in the bundle, equivalent to __dirname in node, for instance.

**Kind**: instance typedef of [<code>BundleAPI</code>](#BundleAPI)  
<a name="BundleAPI+location"></a>

### bundleAPI.location : <code>String</code>
Path in Windows93's filesystem for the bundle

**Kind**: instance typedef of [<code>BundleAPI</code>](#BundleAPI)  
<a name="Dirent"></a>

## Dirent
Represents an entry in a directory

**Kind**: global class  

* [Dirent](#Dirent)
    * [.name](#Dirent+name) : <code>String</code>
    * [.isDirectory](#Dirent+isDirectory) : <code>Boolean</code>
    * [.relativePath](#Dirent+relativePath) : <code>String</code>

<a name="Dirent+name"></a>

### dirent.name : <code>String</code>
Name of the entry

**Kind**: instance typedef of [<code>Dirent</code>](#Dirent)  
<a name="Dirent+isDirectory"></a>

### dirent.isDirectory : <code>Boolean</code>
Whether or not the entry is a directory

**Kind**: instance typedef of [<code>Dirent</code>](#Dirent)  
<a name="Dirent+relativePath"></a>

### dirent.relativePath : <code>String</code>
Relative path to the directory

**Kind**: instance typedef of [<code>Dirent</code>](#Dirent)  
<a name="$bundle"></a>

## $bundle : [<code>BundleAPI</code>](#BundleAPI)
**Kind**: global typedef  
