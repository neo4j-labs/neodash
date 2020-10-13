import Modal from "react-materialize/lib/Modal";
import React from "react";


class NeoModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            json: this.props.json
        }
        this.stateChanged = this.props.stateChanged;
        if (this.stateChanged){
            this.stateChanged = this.stateChanged.bind(this);
        }
        this.componentDidUpdate = this.props.componentDidUpdate;

    }

    render() {
        return (
            <Modal
                style={this.props.style}
                actions={this.props.actions}
                bottomSheet={false}
                fixedFooter={false}
                header={this.props.header}
                id="NeoModal"
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