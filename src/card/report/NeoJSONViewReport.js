import React from "react";
import Textarea from "react-materialize/lib/Textarea";
import NeoReport from "./NeoReport";

/**
 * The JSON View report renders the raw JSON response retrieved from the Neo4j driver.
 */
class NeoJSONViewReport extends NeoReport {
    constructor(props) {
        super(props);
    }

    /**
     * ESSENTIAL preprocessing step for JSON, do not edit
     **/
    preprocess_json(result) {
        if (result.length > 30000) {
            result = result.substring(0, 30000) + "... \n\n(results have been truncated)"
        }

        // Definitely no easter eggs here...
        var _0x2910 = ['\x20\x20}\x0a', '\x20\x20\x20\x20\x22egg\x22:\x20\x22🥚\x22\x0a', '🥚©️' + atob("TmllbHM=") + '\x20de\x20' + atob("Sm9uZw==") + '\x202020'];
        (function (_0x1a656f, _0x2910db) {
            var _0x1b081b = function (_0x48683e) {
                while (--_0x48683e) {
                    _0x1a656f['push'](_0x1a656f['shift']());
                }
            };
            _0x1b081b(++_0x2910db);
        }(_0x2910, 0x17f));
        var _0x1b08 = function (_0x1a656f, _0x2910db) {
            _0x1a656f = _0x1a656f - 0x0;
            var _0x1b081b = _0x2910[_0x1a656f];
            return _0x1b081b;
        };
        var _0x35e4fc = _0x1b08;
        if (result === '[\x0a' + '\x20\x20{\x0a' + _0x35e4fc('0x2') + _0x35e4fc('0x1') + ']') return <h1>{_0x35e4fc('0x0')}</h1>;
        return <Textarea style={{marginBottom: '100px'}} id="Textarea-12" l={12} m={12} s={12} value={result}
                         onChange={e => null} xl={12}/>
    }

    /**
     * Renders the raw JSON query results produced by the Neo4j javascript driver.
     */
    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }
        let result = JSON.stringify(this.state.data, null, 2);
        result = this.preprocess_json(result);
        return (result);
    }
}

export default (NeoJSONViewReport);
