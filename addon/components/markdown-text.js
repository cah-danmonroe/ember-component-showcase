import Component from '@ember/component';
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";
import Remarkable from 'remarkable';
import hbs from 'htmlbars-inline-precompile';
import layout from '../templates/components/markdown-text';

export default Component.extend({
  layout: layout,
  tagName: '',
  text: '',
  typographer: false,
  linkify: false,
  linkTarget: '',
  html: false,
  extensions: true,

  parsedMarkdownUnsafe: computed('text', 'html', 'typographer', 'linkify', 'linkTarget', function () {
    var md = new Remarkable({
      typographer: this.get('typographer'),
      linkify: this.get('linkify'),
      linkTarget: this.get('linkTarget'),
      html: this.get('html')
    });

    if (this.get('extensions')) {
      md.core.ruler.enable([
        'abbr'
      ]);
      md.block.ruler.enable([
        'footnote',
        'deflist'
      ]);
      md.inline.ruler.enable([
        'footnote_inline',
        'ins',
        'mark',
        'sub',
        'sup'
      ]);
    }

    return md.render(this.get('text'));
  }),

  parsedMarkdown: computed('parsedMarkdownUnsafe', function () {
    const parsedMarkdownUnsafe = this.get('parsedMarkdownUnsafe');
    return new htmlSafe(parsedMarkdownUnsafe);
  }),

  precompiledTemplate: computed('parsedMarkdownUnsafe', function () {
    const parsedMarkdownUnsafe = this.get('parsedMarkdownUnsafe');
    return hbs.compile(parsedMarkdownUnsafe, false);
  })
});
