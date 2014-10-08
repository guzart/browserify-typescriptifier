
var ts      = require('typescript-api');
var through = require('through');

var tsRegex = new RegExp('\\.ts$', 'i');
var jsRegex = new RegExp('\\.js$', 'i');


function typescriptifier(file) {
    var data, stream, throughWrite, throughEnd;

    if (!isTypescript(file)) {
        return through();
    }

    data = '';
    throughWrite = function (buf) {
        data += buf;
    };

    throughEnd = function () {
        compile(file, data, function (error, result) {
            if (error) {
                stream.emit('error', error);
            }

            stream.queue(result);
            stream.queue(null);
        });
    };

    stream = through(throughWrite, throughEnd);
    return stream;
}

function isTypescript(file) {
    return tsRegex.test(file);
}

function compile(file, data, callback) {
    var compiled;

    try {
        compiled = compileTs(file, data.toString());
    } catch (e) {
        return callback(e);
    }

    callback(null, compiled);
}

function getTsSettings() {
    var st = new ts.CompilationSettings();
    st.codeGenTarget = 1; // EcmaScript 5
    st.moduleGenTarget = 1; // commonjs
    st.syntacticErrors = true;
    st.semanticErrors = false;
    return ts.ImmutableCompilationSettings.fromCompilationSettings(st);
}

function compileTs(file, data) {
    var logger = new ts.ConsoleLogger();
    var settings = getTsSettings();
    var compiler = new ts.TypeScriptCompiler(logger, settings);

    var snapshot = ts.ScriptSnapshot.fromString(data);
    compiler.addFile(file, snapshot);

    var it = compiler.compile();
    var output = '';
    var result, ix, current;
    while (it.moveNext()) {
        result = it.current();
        for (ix = 0; ix < result.outputFiles.length; ix++) {
            current = result.outputFiles[ix];
            if (!current) { continue; }
            if (jsRegex.test(current.name)) {
                output += current.text;
            }
        }
    }

    return output;
}

typescriptifier.isTypescript  = isTypescript;
typescriptifier.compile       = compile;

module.exports = typescriptifier;
