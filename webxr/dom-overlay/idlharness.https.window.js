// META: script=/resources/WebIDLParser.js
// META: script=/resources/idlharness.js

'use strict';

// https://immersive-web.github.io/dom-overlays/

idl_test(
  ['dom-overlays'],
  ['webxr', 'html', 'dom', 'SVG'],
  async idl_array => {
    self.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svgElement);
    // There currently isn't a MathML definition for idlharness,
    // use a minimal definition to verify that the inheritance of
    // GlobalEventHandlers works.
    idl_array.add_idls("interface MathMLElement : Element {}; MathMLElement includes GlobalEventHandlers;")
    self.mathmlElement = document.createElementNS('http://www.w3.org/1998/Math/MathML', 'math');
    document.body.appendChild(mathmlElement);
    idl_array.add_objects({
      Document: ['document'],
      HTMLElement: ['document.body'],
      MathMLElement: ['mathmlElement'],
      SVGElement: ['svgElement'],
      Window: ['window']
    });
  }
);
