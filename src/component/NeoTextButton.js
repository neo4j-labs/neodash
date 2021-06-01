import React from "react";
import Button from "react-materialize/lib/Button";
import Icon from "react-materialize/lib/Icon";

/**
 * A generic text-based button component with configurable color and click-handler.
 */
class NeoTextButton extends React.Component {
    render() {
        return (
            <Button floating={false} className={"btn right wide-button " + this.props.color} key={this.props.key}
                    onClick={this.props.onClick}
                    style={this.props.style}
                    modal={this.props.modal}
                    href="#">{this.props.text}

                    <Icon className={"fixed-icon"}>{this.props.icon}</Icon>
            </Button>
        );
    }
}

export default (NeoTextButton);