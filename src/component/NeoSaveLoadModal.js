import Modal from "react-materialize/lib/Modal";
import React from "react";
import Button from "react-materialize/lib/Button";
import Textarea from "react-materialize/lib/Textarea";
import NeoModal from "./NeoModal";
import NeoTextButton from "./NeoTextButton";

/**
 * A modal component used for saving/loading dashboards.
 * The content of the modal is a large multi-line textbox for specifying a dashboard file as JSON.
 */
class NeoSaveLoadModal extends NeoModal {
    constructor(props) {
        super(props);
    }

    /**
     * Draws the modal, creating a textbox defaulting to the current active dashboard state.
     */
    render() {
        return (
            <NeoModal header={"Load/Export Dashboard as JSON"}
                      root={document.getElementById("root")}
                      json={this.props.json}
                      placeholder={"Paste a dashboard JSON file here..."}
                      actions={[

                          <NeoTextButton right modal="close"
                                         color={"white-color"}
                                         icon='play_arrow'
                                         node="button"
                                         modal="close"
                                         style={{backgroundColor: "green", position: 'absolute', right: '20px', top: '20px'}}
                                         onClick={this.props.loadJson}
                                         text={"load"}
                                         waves="green"/>,
                          <NeoTextButton right
                                         color={"black"}
                                         node="button"
                                         style={{backgroundColor: "green", fontWeight: "bold", paddingRight: '0px',width:'50px', position: 'absolute', right: '150px', top: '20px'}}
                                         onClick={this.props.onQuestionMarkClicked}
                                         text={"?"}
                                         waves="white"/>,

                      ]}
                      trigger={
                          this.props.trigger
                      }
                      componentDidUpdate={this.props.update}
                      stateChanged={this.props.stateChanged}
                      content={<div>
                          <p> </p><hr/>
                          <Textarea style={{minHeight: '1500px'}} id="Textarea-12" l={12} m={12}
                                    s={12} xl={12}
                                    onChange={this.props.change} value={this.props.value}
                                    placeholder={this.props.placeholder}/>
                      </div>}
            />
        )
    }


}

export default (NeoSaveLoadModal);