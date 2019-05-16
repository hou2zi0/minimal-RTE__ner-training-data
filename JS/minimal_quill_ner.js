let Inline = Quill.import('blots/inline');

const BUTTONS = ['PERSON', 'PLACE', 'ORG', 'TITLE'];

let source = [{
  "text": "Example text."
}];

// file upload
const counter = document.getElementById('snippet-counter');
const total = document.getElementById('snippet-total');

const readFile = function() {
  d3.json(CONFIG.reader.result, function(data) {
      return data;
    })
    .then(function(data) {
      source = data;
      quill.setText(source[0].text);
      counter.textContent = "1";
      total.textContent = source.length;
      return data;
    }, function(error) {
      console.log(error);
      CONFIG.fileLoaded = false;
    });
};

const CONFIG = {
  "fileLoaded": false
};

const Up = document.getElementById('poly-file')
  .addEventListener("change", (e) => {

    const filehandle = document.getElementById('poly-file')
      .files[0];
    CONFIG.reader = new FileReader();

    if (filehandle) {
      CONFIG.reader.readAsDataURL(filehandle);
    }

    CONFIG.reader.addEventListener("load", () => {
      readFile();
    }, false);
  });

const textSnippetCounte = function(cnt, ttl) {
  const counter = document.getElementById('snippet-counter');
  counter.value = cnt;
};

class SPAN extends Inline {
  static create(value) {
    let node = super.create();
    node.setAttribute('data-annotation', value[0]);
    node.setAttribute('data-start', value[1]);
    node.setAttribute('data-end', value[2]);
    return node;
  }
  static formats(node) {
    node = {
      'annotation': node.getAttribute('data-annotation'),
      'start': node.getAttribute('data-start'),
      'end': node.getAttribute('data-end')
    };
    return node;
  }
}

// Registering
SPAN.blotName = 'SPAN';
SPAN.tagName = 'span';
Quill.register(SPAN);

var quill = new Quill('#editor-container', {
  modules: {
    toolbar: true
  },
  theme: 'snow'
});

quill.setText(source[0].text);

BUTTONS.forEach((item) => {
  document.getElementById(`${item.toLowerCase()}-button`)
    .addEventListener('click', function() {
      if (quill.getFormat()
        .SPAN === undefined) {
        console.log('undef');
        let {
          index,
          length
        } = quill.getSelection();
        quill.format('SPAN', [item, index, index + length]);
      } else if (quill.getFormat()
        .SPAN.annotation === item) {
        let {
          index,
          length
        } = quill.getSelection();
        quill.removeFormat(index, length);
      } else {
        let {
          index,
          length
        } = quill.getSelection();
        quill.format('SPAN', [item, index, index + length]);
      }
    });
});


// Download
const prepareDownload = function(data, filename) {
  const content = JSON.stringify(data)
    .replace(/\[null\]/g, '[[0,0]]');
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

document.getElementById('download-button')
  .addEventListener('click', function() {
    let editor = document.getElementById('editor-container')
      .getElementsByClassName('ql-editor')[0].innerHTML;
    let text = quill.getText();
    // {"entities": [(15, 20, "GPE"), (24, 32, "GPE")]},
    let entities = [];
    quill.getContents()
      .ops.forEach((item) => {
        if (item.hasOwnProperty('attributes')) {
          entities.push([item.attributes.SPAN.start, item.attributes.SPAN.end, item.attributes.SPAN.annotation]);
        }
      });
    let out = {
      "text": text,
      "entities": entities
    };
    console.log(JSON.stringify(out));
    out.entities.forEach((item) => {
      let x = out.text.slice(item[0], item[1]);
      console.log(`<${x}> (${item[2]})`);
    });
    prepareDownload(out, "bing.json");
  });

//Bulk download
document.getElementById('bulk-download-button')
  .addEventListener('click', function() {
    // Set properties of active text
    const active_item = parseInt(document.getElementById('snippet-counter')
      .textContent);
    console.log(active_item);
    source[active_item - 1].annotations = quill.getContents()
      .ops;

    // Build object array for bulk download
    const bulk = [];

    source.forEach((item) => {
      let text = item.text;
      let entities = [];
      console.log(item);
      try {
        item.annotations
          .forEach((item) => {
            if (item.hasOwnProperty('attributes')) {
              entities.push([item.attributes.SPAN.start, item.attributes.SPAN.end, item.attributes.SPAN.annotation]);
            }
          });
      } catch (e) {
        console.log(e);
      }
      let out = {
        "text": text,
        "entities": entities
      };
      bulk.push(out);
    });

    prepareDownload(bulk, "bulk.json");
  });

// Prev next buttons
let current = 0;

// ToDo: Simplify
const previous = function() {
  current -= 1;
  if (current >= 0) {
    console.log(current);
    console.log(source.length);
    source[current + 1].annotations = quill.getContents()
      .ops;
    source[current + 1].delta = document.getElementById('editor-container')
      .getElementsByClassName('ql-editor')[0].innerHTML;
    console.log(source[current + 1].delta);
    counter.textContent = current + 1;
    if (source[current].delta) {
      document.getElementById('editor-container')
        .getElementsByClassName('ql-editor')[0].innerHTML = source[current].delta;
    } else {
      quill.setText(source[current].text);
    }
  } else {
    console.log('end of array');
    current = 0;
  }
};

document.getElementById('pre-button')
  .addEventListener('click', function() {
    previous();
  });

const next = function() {
  current += 1;
  if (current < source.length) {
    console.log(current);
    console.log(source.length);
    source[current - 1].annotations = quill.getContents()
      .ops;
    source[current - 1].delta = document.getElementById('editor-container')
      .getElementsByClassName('ql-editor')[0].innerHTML;
    console.log(source[current - 1].delta);
    counter.textContent = current + 1;
    if (source[current].delta) {
      document.getElementById('editor-container')
        .getElementsByClassName('ql-editor')[0].innerHTML = source[current].delta;
    } else {
      quill.setText(source[current].text);
    }
  } else {
    console.log('end of array');
    current = source.length - 1;
  }
};

document.getElementById('next-button')
  .addEventListener('click', function() {
    next();
  });

document.getElementById('editor-container')
  .addEventListener('keydown', function(event) {
    event.stopPropagation();
  });

document.body
  .addEventListener('keydown', function(event) {
    // Add arrow key navigation through sources
    switch (event.keyCode) {
      case 37:
        console.log('Left key pressed');
        previous();
        break;
      case 38:
        console.log('Up key pressed');
        previous();
        break;
      case 39:
        console.log('Right key pressed');
        next();
        break;
      case 40:
        console.log('Down key pressed');
        next();
        break;
    }
  });