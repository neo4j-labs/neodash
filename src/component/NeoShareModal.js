import Modal from "react-materialize/lib/Modal";
import React from "react";
import Button from "react-materialize/lib/Button";
import Textarea from "react-materialize/lib/Textarea";
import NeoModal from "./NeoModal";
import NeoTextButton from "./NeoTextButton";
import Icon from "react-materialize/lib/Icon";
import NeoCheckBox from "./NeoCheckBox";
import NeoButton from "./NeoButton";
import NeoTextInput from "./NeoTextInput";

/**
 * A modal component used for saving/loading dashboards.
 * The content of the modal is a large multi-line textbox for specifying a dashboard file as JSON.
 */
class NeoShareModal extends NeoModal {
    baseURL = "http://localhost:3000/";

    constructor(props) {
        super(props);
    }

    /**
     * Draws the modal, creating a textbox defaulting to the current active dashboard state.
     */
    render() {
        return (

            <NeoModal header={<div><Icon>people</Icon> Create Shareable Dashboard Link</div>}
                      root={document.getElementById("root")}
                      json={this.props.json}
                      actions={[
                          <NeoTextButton right
                                         color={"red"}
                                         node="button"
                                         onClick={e => this.stateChanged({label: "RemoveShareLink"})}
                                         style={{
                                             backgroundColor: "green",
                                             fontWeight: "bold",
                                             paddingRight: '0px',
                                             width: '50px',
                                             position: 'absolute',
                                             right: '20px',
                                             top: '20px'
                                         }}
                                         modal="close"
                                         text={<Icon>close</Icon>}
                                         waves="white"/>

                      ]}
                      trigger={
                          this.props.trigger
                      }
                      content={<div>
                          <hr/>
                          <p>To generate a shareable link for this dashboard,
                              make it accessible <a href={"https://gist.github.com/"}>online</a>.
                              Then, paste the <b>direct</b> link here:</p>
                          <NeoTextInput defaultValue={""} onChange={this.props.stateChanged}
                                        changeEventLabel={"ShareLinkURLChanged"} label={""}
                                        placeholder={'https://gist.githubusercontent.com/nielsdejong/492736631e65200f4159486edd678c5b/raw/ccf94786e07981e2a04e1bf708fe3365244c2d83/neodash.md'}/>

                          <p>
                              <NeoCheckBox onChange={this.props.stateChanged}
                                           changeEventLabel={"ShareLinkCredentialsChanged"}
                                           label={"Include Connection Details"}
                                           defaultValue={(this.props.connection) ? "on" : "off"}>

                              </NeoCheckBox><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                              <NeoCheckBox onChange={this.stateChanged}
                                           changeEventLabel={"ShareLinkPasswordChanged"}
                                           label={"Include Password"}
                                           defaultValue={(this.props.password) ? "on" : "off"}>

                              </NeoCheckBox>


                          </p>
                          <hr/><br/>
                          {(this.props.value && this.props.connection && !this.props.password) ?
                              <p>Use this URL to load your dashboard, database URL, and username directly into NeoDash:</p> : ""}
                          {(this.props.value && this.props.connection && this.props.password) ?
                              <p>Use this URL to load your dashboard, database URL, username, and password directly into NeoDash:</p> : ""}
                          {(this.props.value && !this.props.connection) ?
                              <p>Use this URL to load your dashboard directly into NeoDash:</p> : ""}


                          {(this.props.value && !this.props.value.startsWith("https%3A%2F%2Fgist.github.com")) ?
                              <Textarea
                                  style={{minHeight: '120px', whiteSpace: 'break-spaces', textDecoration: "underline"}}
                                  id="Textarea-13" l={12} m={12}
                                  s={12} xl={12} value={this.generateShareLink()}
                                  placeholder={this.props.placeholder}/>
                              :
                              <></>
                          }
                          {(this.props.value && this.props.value.startsWith("https%3A%2F%2Fgist.github.com")) ?
                              <p><b>That looks like a Github gist URL. Ensure you use a URL to the (raw) JSON instead.<br/>
                              For gists, these start with https://gist.githubusercontent.com, and can be found by clicking the 'raw' button on the Gist page.</b></p>:
                              <></>
                          }

                      </div>}
            />
        )
    }


    generateShareLink() {
        if (this.props.connectionValue) {
            return this.baseURL + "?url=" + this.props.value + "&connection=" + this.props.connectionValue;
        } else {
            return this.baseURL + "?url=" + this.props.value
        }

    }
}

export default (NeoShareModal);