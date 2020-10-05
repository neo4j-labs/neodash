import Modal from "react-materialize/lib/Modal";
import Button from "react-materialize/lib/Button";
import React from "react";
import NeoTextArea from "./NeoTextArea";
import Textarea from "react-materialize/lib/Textarea";
import Icon from "react-materialize/lib/Icon";

class NeoSaveLoadModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            json: this.props.json
        }
        this.stateChanged = this.stateChanged.bind(this);

    }

    componentDidUpdate(prevProps) {
        if (this.state.json !== this.props.json){
            this.state.json = this.props.json;
            this.setState(this.state);
        }

    }

    stateChanged(e) {
        this.setState(this.state);
        this.state.json = e.target.value;
    }

    render() {
        return (
            <Modal
                actions={this.props.actions}
                bottomSheet={false}
                fixedFooter={false}
                header={this.props.header}
                id="NeoModal"
                open={false}
                options={{
                    dismissible: true,
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
                <Textarea
                    style={{minHeight: '500px'}}
                    id="Textarea-12"
                    l={12}
                    m={12}
                    s={12}
                    onChange={this.stateChanged}
                    value={this.state.json}
                    placeholder={"Paste a dashboard JSON file here..."}
                    xl={12}/>
            </Modal>
        )
    }
}

export default (NeoSaveLoadModal);