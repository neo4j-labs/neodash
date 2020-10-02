import React from "react";
import Card from "react-materialize/lib/Card";
import Icon from "react-materialize/lib/Icon";
import Textarea from "react-materialize/lib/Textarea";
import Button from "react-materialize/lib/Button";
import NeoTable from "./reports/NeoTable";
import NeoPagination from "./NeoPagination";
import NeoGraphViz from "./reports/NeoGraphVis";
import Col from "react-materialize/lib/Col";
import Chip from "react-materialize/lib/Chip";
import NeoCardSettings from "./NeoCardSettings";
import NeoButton from "./NeoButton";

import NeoJSONView from "./reports/NeoJSONView";
import NeoGraphChips from "./NeoGraphChips";

let tallRowCount = 14;
let normalRowCount = 5;

class NeoCardComponent extends React.Component {


    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.updateGraphChips = this.updateGraphChips.bind(this);
        this.state = {
            width: 4,
            height: 4,
            action: <NeoPagination data={this.props.data} onChange={this.stateChanged}/>,
            type: this.props.type,
            page: 1,
            data: this.props.data,
        }
        this.stateChanged({})
    }

    stateChanged(update) {

        if (update.label == "CardShiftRight" || update.label == "CardShiftLeft" || update.label == "CardDelete") {
            update.card = this;
            this.props.onChange(update);
        }
        if (update.label == "Refresh") {
            this.state.page += 1;
        }
        if (update.label == "PageChanged") {
            this.state.page = update.value;
        }
        if (update.label == "TypeChanged") {
            this.state.page = 1;
            this.state.type = update.value;
        }
        if (update.label === "SizeChanged") {
            this.state.width = (update.value % 12 == 0) ? 12 : (update.value % 12);
            this.state.height = Math.ceil(update.value / 12) * 4;
        }
        if (this.state.type == 'table') {
            this.state.content =
                <NeoTable rows={this.state.height == 4 ? normalRowCount : tallRowCount} page={this.state.page}
                          data={this.state.data}/>
            this.state.action = <NeoPagination data={this.state.data} onChange={this.stateChanged}/>
        }
        if (this.state.type == "graph") {
            this.state.page += 1;
            this.state.content = <NeoGraphViz onNodeLabelUpdate={this.updateGraphChips} width={this.state.width}
                                              height={this.state.height} page={this.state.page}
                                              data={this.state.data}/>
            this.state.action = <NeoGraphChips
                nodeLabels={["test", "test2", "aa", "aas", "asadv", "asas", "asasfa", "asfa", "asf", "saaaaaa", "a", 'asfa', "asda"]}
                onChange={this.stateChanged}/>;
        }
        if (this.state.type == 'json') {
            this.state.content =
                <NeoJSONView data={this.state.data}/>
            this.state.action = <></>
        }
        this.setState(this.state);
    }

    updateGraphChips(labels) {
        this.state.action = <NeoGraphChips nodeLabels={labels} onChange={this.stateChanged}/>;
        this.setState(this.state);
    }

    render() {
        let cardTitle = <Textarea noLayout={true} className="card-title editable-title"
                                  placeholder={"Report name..."}/>;
        let revealCardTitle = <p style={{'padding-left': '150px', 'display': 'none'}}></p>;

        return <Col l={this.state.width} m={12} s={12}>
            <Card
                actions={[this.state.action]}
                className={((this.state.height == 4) ? 'medium' : 'huge') + " neo-card medium white darken-5 paginated-card"}
                closeIcon={<Icon>save</Icon>}
                revealIcon={<Icon>more_vert</Icon>}
                textClassName="black-text"
                // <i style={{marginRight: '40px'}} className="material-icons right">refresh</i>
                title={[revealCardTitle, cardTitle]}
                reveal={[<NeoCardSettings onChange={this.stateChanged}/>]}
            >{this.state.content}</Card>
        </Col>
    }
}


class AddNeoCardComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Col l={4} m={6} s={12}><a><Card actions={[]}
                                                className={"medium grey lighten-2 button add-neo-card"}
                                                closeIcon={<Icon>close</Icon>}
                                                revealIcon={<Icon>more_vert</Icon>}
                                                textClassName="black-text"
                                                title=""
        >
            <Button className="btn-floating btn-center-align blue-grey"
                    onClick={e => this.props.onClick({'label': 'newCard'})}><Icon>add</Icon></Button>
        </Card></a></Col>
    }

}

export const NeoCard = NeoCardComponent;
export const AddNeoCard = AddNeoCardComponent;