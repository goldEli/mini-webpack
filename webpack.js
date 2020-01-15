const fs = require("fs");
// const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

// 初始化：转换代码，获取依赖

function getFileInfo(filename) {
  const content = fs.readFileSync(filename, "utf-8");

  const ast = parser.parse(content, {
    sourceType: "module" //babel官方规定必须加这个参数，不然无法识别ES Module
  });

  const dependencies = {};
  //遍历AST抽象语法树
  traverse(ast, {
    //获取通过import引入的模块
    ImportDeclaration({ node }) {
      dependencies[node.source.value] = node.source.value;
    }
  });

  //通过@babel/core和@babel/preset-env进行代码的转换
  const {code} = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"]
  })
  return {
    filename,
    dependencies,
    code
  }
}

/**
 * 创建依赖关系
 * @param {*} entry 入口文件
 */
function generateDependencyGraph(entry) {

  const graphArray = []

  function createGraphArray(filename) {
    const fileInfo = getFileInfo(filename)
    console.log(filename)
    graphArray.push(fileInfo)
    Object.keys(fileInfo.dependencies).forEach(dependency => {
      createGraphArray(dependency)
    })
  }
  createGraphArray(entry)

  return graphArray.reduce((res, item) => {
    const o = {[item.filename]: item}
    return {...res, ...o}
  }, {})

}

/**
 * 生成打包后的代码
 * @param {*} entry 
 */
function generateCode(entry) {

  const graph = JSON.stringify(generateDependencyGraph(entry))

  return `
    (graph => {
      function require(module) {
        const exports = {}
        excuteCode(graph[module].code, require, exports)
        return exports
      }
      function excuteCode(code, require, exports) {
        eval(code)
      }
      require('${entry}')
    })(${graph})
  
  `
}

/**
 * 创建打包文件
 * @param {*} entry 
 */
function createOutPutFile(entry) {
  const code = generateCode(entry)
  fs.writeFile('./dist/main.js', code, 'utf8', err => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

createOutPutFile("./index.js")
