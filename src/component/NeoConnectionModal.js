import Modal from "react-materialize/lib/Modal";
import React from "react";
import Button from "react-materialize/lib/Button";
import Textarea from "react-materialize/lib/Textarea";
import NeoModal from "./NeoModal";
import NavItem from "react-materialize/lib/NavItem";
import NeoTextInput from "./NeoTextInput";
import NeoCheckBox from "./NeoCheckBox";
import NeoTextButton from "./NeoTextButton";

/**
 * A Modal (pop-up) component used for setting up a Neo4j connection.
 * Values in this modal can be prepopulated based on what's active in the browser cache.
 */
class NeoConnectionModal extends NeoModal {
    constructor(props) {
        super(props);
    }

    /**
     * Draw the modal based on the properties provided to the object.
     */
    render() {
        return (
            <NeoModal
                header={'Connect to Neo4j'}
                style={{'maxWidth': '520px'}}
                key={this.props.key}
                id={this.props.key}
                footerType={"modal-dark-footer"}
                open={this.props.open}
                root={document.getElementById("root")}

                actions={[
                    <p>
                        NeoDash is a tool for prototyping Neo4j dashboards.
                        Building a production-grade front-end instead? &nbsp;
                        <u><a style={{color: "white"}} href="#"
                              onClick={this.props.onGetInTouchClicked}>Get in touch</a></u>!
                    </p>

                ]}
                trigger={
                    <NavItem href="" onClick={this.props.navClicked}>Neo4j Connection</NavItem>
                }
                content={<div className="modal-input-text" style={{margin: '20px'}}>
                    <img style={{height: '38px', right: '20px', top: '25px', position: 'absolute'}} src={"neo.png"}/>
                    <p>&nbsp;</p>
                    <form onSubmit={this.props.onConnect}>
                        <NeoTextInput onChange={this.props.stateChanged} changeEventLabel={"ConnectURLChanged"}
                                      style={{'width': '100%'}} label={"Connect URL"}
                                      defaultValue={this.props.connection.url}/>
                        <NeoTextInput onChange={this.stateChanged} changeEventLabel={"DatabaseChanged"}
                                      label={"Database"}
                                      placeholder={'neo4j'}
                                      defaultValue={this.props.connection.database}
                        />
                        <NeoTextInput onChange={this.stateChanged} changeEventLabel={"UsernameChanged"}
                                      label={"Username"}
                                      defaultValue={this.props.connection.username}/>
                        <NeoTextInput onChange={this.stateChanged} changeEventLabel={"PasswordChanged"}
                                      password={true}
                                      label={"Password"}
                                      defaultValue={this.props.connection.password}
                                      placeholder={''}/>
                        <div style={{marginTop: "10px"}}>

                            <NeoCheckBox onChange={this.stateChanged}
                                         changeEventLabel={"EncryptionChanged"}
                                         label={"Encrypted Connection"}
                                         defaultValue={(this.props.connection.encryption === "on") ? "on" : "off"}>

                            </NeoCheckBox>
                            <NeoTextButton right modal="close"
                                           color={"neo-color"}
                                           icon='play_arrow'
                                           node="button"
                                           onClick={this.props.connect}
                                           text={"connect"}
                                           waves="green"/>
                        </div>
                        <input style={{display: 'none'}} type="submit"/></form>
                </div>}
            />
        )
    }


}

export default (NeoConnectionModal);