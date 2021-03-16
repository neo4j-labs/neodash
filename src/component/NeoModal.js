import Modal from "react-materialize/lib/Modal";
import React from "react";

/**
 * A NeoModal is a modal (https://materializecss.com/modals.html) or pop-up box containing text and/or images.
 * This object provides a generic way to create modals with configurable content and style.
 */
class NeoModal extends React.Component {
    /**
     * Set up default state and bind state handling methods.
     */
    constructor(props) {
        super(props);
        // TODO - check if this is still used...
        this.state = {
            json: this.props.json
        }
        this.stateChanged = this.props.stateChanged;
        if (this.stateChanged){
            this.stateChanged = this.stateChanged.bind(this);
        }
        this.componentDidUpdate = this.props.componentDidUpdate;
    }

    /**
     * Draw the modal.
     */
    render() {
        return (
            <Modal
                style={this.props.style}
                actions={this.props.actions}
                bottomSheet={false}
                fixedFooter={false}
                header={this.props.header}
                id={(this.props.footerType) ? (this.props.footerType) : "NeoModal"}
                open={this.props.open}
                options={{
                    dismissible: false,
                    endingTop: '10%',
                    inDuration: 250,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    opacity: 0.5,
                    outDuration: 250,
                    preventScrolling: true,
                    startingTop: '4%'
                }}
                root={this.props.root}
                trigger={this.props.trigger}
            >
                {this.props.content}
            </Modal>
        )
    }
}

export default (NeoModal);