let Inline = Quill.import('blots/inline');

const source = [{
		"text": "1 :: +a) ANNO / D(OMI)NI M · CCC · L NONASb) · AUGVSTI · O(BIIT) / JOHANN[E]S / [...]RNOS · FILI(US) · D(I)C(T)I · UALME DE SO/B(ER)NH(EIM)c) ·"
	},
	{
		"text": "2 :: +a) ANNO / D(OMI)NI M · CCC · L NONASb) · AUGVSTI · O(BIIT) / JOHANN[E]S / [...]RNOS · FILI(US) · D(I)C(T)I · UALME DE SO/B(ER)NH(EIM)c) ·"
	},
	{
		"text": "3 ::+a) ANNO / D(OMI)NI M · CCC · L NONASb) · AUGVSTI · O(BIIT) / JOHANN[E]S / [...]RNOS · FILI(US) · D(I)C(T)I · UALME DE SO/B(ER)NH(EIM)c) ·"
	},
	{
		"text": "4 :: +a) ANNO / D(OMI)NI M · CCC · L NONASb) · AUGVSTI · O(BIIT) / JOHANN[E]S / [...]RNOS · FILI(US) · D(I)C(T)I · UALME DE SO/B(ER)NH(EIM)c) ·"
	},
];

//

class SPAN extends Inline {
	static create(value) {
		let node = super.create();
		// Sanitize url value if desired
		node.setAttribute('data-annotation', value[0]);
		node.setAttribute('data-start', value[1]);
		node.setAttribute('data-end', value[2]);
		return node;
	}
	static formats(node) {
		// We will only be called with a node already
		// determined to be a Link blot, so we do
		// not need to check ourselves
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

['PERSON', 'PLACE', 'ORG', 'TITLE'].forEach((item) => {
	document.getElementById(`${item.toLowerCase()}-button`)
		.addEventListener('click', function () {
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
const prepareDownload = function (data, filename) {
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
	.addEventListener('click', function () {
		console.log(quill.getContents());
		let editor = document.getElementById('editor-container')
			.getElementsByClassName('ql-editor')[0].innerHTML;
		console.log(`<doc>${editor}</doc>`);
		console.log(quill.getText());
		console.log(quill.getContents());
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

// Prev next buttons
let current = 0;

document.getElementById('pre-button')
	.addEventListener('click', function () {
		current -= 1;
		if (current >= 0) {
			console.log(current);
			console.log(source.length);
			source[current + 1].delta = document.getElementById('editor-container')
				.getElementsByClassName('ql-editor')[0].innerHTML;
			console.log(source[current + 1].delta);
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
	});

document.getElementById('next-button')
	.addEventListener('click', function () {
		current += 1;
		if (current < source.length) {
			console.log(current);
			console.log(source.length);
			source[current - 1].delta = document.getElementById('editor-container')
				.getElementsByClassName('ql-editor')[0].innerHTML;
			console.log(source[current - 1].delta);
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
	});

document.getElementById('editor-container')
	.addEventListener('keydown', function (event) {
		event.stopPropagation();
	});

document.body
	.addEventListener('keydown', function (event) {
		// Add arrow key navigation through sources
		switch (event.keyCode) {
		case 37:
			console.log('Left key pressed');
			break;
		case 38:
			console.log('Up key pressed');
			break;
		case 39:
			console.log('Right key pressed');
			break;
		case 40:
			console.log('Down key pressed');
			break;
		}
	});