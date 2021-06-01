import React from "react";
import Pagination from "react-materialize/lib/Pagination";
import Icon from "react-materialize/lib/Icon";
import NeoFooter from "./NeoFooter";

/**
 * A table footer is a Pagination (https://materializecss.com/pagination.html) component.
 * The component is used to switch pages in the table report.
 */
class NeoTableFooter extends NeoFooter {
    constructor(props) {
        super(props);
    }

    /**
     * Draw the pagination component based on the currently selected page in the table.
     */
    render() {
        return <Pagination
            count={this.props.counter}
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
