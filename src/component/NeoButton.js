import React from "react";
import Button from "react-materialize/lib/Button";
import Icon from "react-materialize/lib/Icon";

/**
 * A generic icon-only button component with configurable color and click-handler.
 * For a button with configurable text, see NeoTextButton.
 */
class NeoButton extends React.Component {
    render() {
        return (
            <Button floating={true} className={"btn " + this.props.color} key={this.props.key}
                    onClick={this.props.onClick}
                    href="#"><Icon>{this.props.icon}</Icon></Button>
        );
    }
}

export default (NeoButton);