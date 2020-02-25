# minimal-RTE__ner-training-data
Minimal customization of [Quill.js](https://quilljs.com/) Rich Text Editor for easy annotation of text snippets for NER model training with, f.e. [spaCy](https://spacy.io/). A live demo may be found [here](https://hou2zi0.github.io/minimal-RTE__ner-training-data/example/minimal_quill_ner.html).

## Simple RTE for NER Annotation

The interface provides a simple file upload expecting JSON-files containing the following minimal structure:

```JSON
[
  { "text": "Lorem ipsum dolor sit."},
  { "text": "Amet adipiscit verum est."}
]
```

The object’s `text` property is displayed as text inside the RTE. Other properties present in the object’s are not processed and for internal use only, e.g. for referencing or license purposes.

![Image](./data/imgs/ner_editor.png)

The annotated texts can be downloaded as a JSON-file. The interface provides a single download of the currently active text or a bulk download of all texts. E.g.:

```JSON
[
    {
        "text": "Aufgestellt wurde ich, eine Stele, zu Häupten der Angesehenen, Frau Channa, Tochter des Herrn Alexander, die verschieden ist am 14. des Mondes Aw im Jahre 5 Tausend 32 der Zählung. Es sei ihre Seele im Garten Eden, Amen Sela",
        "entities": [
            [
                "50",
                "61",
                "TITLE"
            ],
            [
                "68",
                "74",
                "PERSON"
            ],
            [
                "88",
                "93",
                "TITLE"
            ],
            [
                "94",
                "103",
                "PERSON"
            ],
            [
                "202",
                "213",
                "PLACE"
            ]
        ]
    },
    {
        "text": "Zeuge sei dieser Haufen und Zeugin diese Stele, welche ich errichtet habe zu Häupten der angesehenen jungen Frau, Frau Bela, Tochter des Herrn Natan, die verschied 14. im Tewet des Jahres 5 Tausend und 33 der Zählung. Der Fels bewahre ihre Seele im Garten Eden, Sela",
        "entities": [
            [
                "114",
                "118",
                "TITLE"
            ],
            [
                "119",
                "123",
                "PERSON"
            ],
            [
                "137",
                "142",
                "TITLE"
            ],
            [
                "143",
                "148",
                "PERSON"
            ],
            [
                "249",
                "260",
                "PLACE"
            ]
        ]
    },
    {
        "text": "Diesen Stein, den setzte ich als Stele zu Häupten von Channa, der Jungfrau, Tochter des Herrn Elieser, die verschied Tag 2, 14. des Nissan 43 des sechsten Jahrtausends. Es sei ihre Seele im Garten Eden",
        "entities": []
    },
    {
        "text": "Dieses Zeichen, welches aufgestellt ward zu Häupten eines Liebenswürdigen, auch Liebenswerten, eingesenkt habe ich es zur Stele. Zu Grabe kam im Alter ein Stattlicher, Jaakow ward sein Name genannt inmitten des verstreuten Volkes, 28. des Adar, Tag 6, verschied Herr Jaakow, Sohn des toragelehrten Herrn Schlomo, 44 des Jahrtausends. Seine Seele sei eingebunden in das Bündel des Lebens, Amen Amen Sela",
        "entities": []
    }
]
```

If the JSON-objects contain fields other than `text`, these fields are retained, e.g.:

**In**

```JSON
[
    {
        "text": "Aufgestellt wurde ich, eine Stele, zu Häupten der Angesehenen, Frau Channa, Tochter des Herrn Alexander, die verschieden ist am 14. des Mondes Aw im Jahre 5 Tausend 32 der Zählung. Es sei ihre Seele im Garten Eden, Amen Sela",
        "src": "http://www.steinheim-institut.de:80/cgi-bin/epidat?id=ffb-97 ",
        "license": "CC-BY"
    },
]
```

**Out**

```JSON
[
    {
        "text": "Aufgestellt wurde ich, eine Stele, zu Häupten der Angesehenen, Frau Channa, Tochter des Herrn Alexander, die verschieden ist am 14. des Mondes Aw im Jahre 5 Tausend 32 der Zählung. Es sei ihre Seele im Garten Eden, Amen Sela\n",
        "entities": [
            [
                68,
                74,
                "PERSON"
            ],
            [
                94,
                103,
                "PERSON"
            ]
        ],
        "src": "http://www.steinheim-institut.de:80/cgi-bin/epidat?id=ffb-97 ",
        "license": "CC-BY",
        "delta": "<p>Aufgestellt wurde ich, eine Stele, zu Häupten der Angesehenen, Frau <span data-annotation=\"PERSON\" data-start=\"68\" data-end=\"74\">Channa<\/span>, Tochter des Herrn <span data-annotation=\"PERSON\" data-start=\"94\" data-end=\"103\">Alexander<\/span>, die verschieden ist am 14. des Mondes Aw im Jahre 5 Tausend 32 der Zählung. Es sei ihre Seele im Garten Eden, Amen Sela<\/p>"
    },
]
```

The key `delta` contains the annotated text. Each annotation is given as `<span data-annotation="NER_TYPE" date-start="INT" date-end="INT">STRING</span>`. Thus, the content of `delta` may be parsed with a simple XSLT-file in order to transform the annotations in f.e. `<tei:rs type="person">`.

## Sample data
The sample data contained in `data/texts/example.json` is taken from the first four epigraphic records of the catalogue [Frankfurt a.M., Battonstraße](http://www.steinheim-institut.de/cgi-bin/epidat?id=ffb), available on [_EPIDAT ─ Research Platform for Jewish Epigraphy_](http://www.steinheim-institut.de/cgi-bin/epidat?lang=en) built by [Thomas Kollatz](https://orcid.org/0000-0003-1904-1841). The epigraphic records are published under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

## ToDo

* Refactoring the code to be more concise.
* Easier customization for buttons.

## License

The software is published under the terms of the MIT license.

Copyright 2019 Max Grüntgens (猴子)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
