import React from "react";
import Pagination from "react-materialize/lib/Pagination";
import Icon from "react-materialize/lib/Icon";


class NeoPagination extends React.Component {
    constructor(props) {
        super(props);
    }

    render(content) {
        return <Pagination
            activePage={1}
            items={100}
            leftBtn={<Icon>chevron_left</Icon>}
            maxButtons={5}
            rightBtn={<Icon>chevron_right</Icon>}
            onSelect={value => this.props.onChange({label: "PageChanged", value: value})}
        />;
    }
}

export default (NeoPagination);
