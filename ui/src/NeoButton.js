import React from "react";
import Button from "react-materialize/lib/Button";
import Icon from "react-materialize/lib/Icon";

class NeoButton extends React.Component {
    render(content) {
        return (
            <Button floating={true} className={"btn " + this.props.color} key={this.props.key} onClick={this.props.onClick}
                    href="#"><Icon>{this.props.icon}</Icon></Button>
        );
    }
}
export default (NeoButton);