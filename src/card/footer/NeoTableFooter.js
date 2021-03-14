import React from "react";
import Pagination from "react-materialize/lib/Pagination";
import Icon from "react-materialize/lib/Icon";
import NeoFooter from "./NeoFooter";

/**
 * A table report footer can be used to switch pages in the table.
 */
class NeoTableFooter extends NeoFooter {
    constructor(props) {
        super(props);
    }

    render() {
        return <Pagination
            activePage={(this.props.page ? this.props.page : 1)}
            items={1000}
            leftBtn={<Icon>chevron_left</Icon>}
            maxButtons={5}
            rightBtn={<Icon>chevron_right</Icon>}
            onSelect={value => this.props.onChange({label: "PageChanged", value: value})}
        />;
    }
}

export default (NeoTableFooter);
