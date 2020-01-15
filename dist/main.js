
    (graph => {
      function require(module) {
        const exports = {}
        excuteCode(graph[module].code, require, exports)
        return exports
      }
      function excuteCode(code, require, exports) {
        eval(code)
      }
      require('./index.js')
    })({"./index.js":{"filename":"./index.js","dependencies":{"./message.js":"./message.js"},"code":"\"use strict\";\n\nvar _message = _interopRequireDefault(require(\"./message.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log(_message[\"default\"]);"},"./message.js":{"filename":"./message.js","dependencies":{"./word.js":"./word.js"},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports[\"default\"] = void 0;\n\nvar _word = require(\"./word.js\");\n\nvar message = \"say \".concat(_word.word);\nvar _default = message;\nexports[\"default\"] = _default;"},"./word.js":{"filename":"./word.js","dependencies":{},"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.word = void 0;\nvar word = \"hello\";\nexports.word = word;"}})
  
  