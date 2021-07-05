import React from "react";
import NeoReport from "../NeoReport";
import Textarea from "react-materialize/lib/Textarea";

/**
 * TODO: Implement search bar report...
 */
class NeoSearchBarReport extends NeoReport {
    render() {
        let rendered = super.render();
        if (rendered) {
            return rendered;
        }

        let result =<Textarea noLayout={true} style={{fontSize: "30px", height: "60px", marginTop: "-40px", width: "100%"}} placeholder={"Filter metrics..."} id="TextInput-4" />
        return (result);
    }
}

export default (NeoSearchBarReport);
