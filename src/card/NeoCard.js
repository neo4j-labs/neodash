import React, {useRef} from "react";
import Card from "react-materialize/lib/Card";
import Icon from "react-materialize/lib/Icon";
import Textarea from "react-materialize/lib/Textarea";
import Button from "react-materialize/lib/Button";
import NeoTable from "../report/table/NeoTable";
import NeoPagination from "../report/table/NeoPagination";
import NeoGraphViz from "../report/graph/NeoGraphVis";
import Col from "react-materialize/lib/Col";
import NeoCardSettings from "./NeoCardSettings";
import NeoJSONView from "../report/json/NeoJSONView";
import NeoGraphChips from "../report/graph/NeoGraphChips";
import NeoPlainTextView from "../report/text/NeoPlainTextView";
import NeoBarChart from "../report/bar/NeoBarChart";
import NeoBarPropertySelect from "../report/bar/NeoBarPropertySelect";
import NeoLineChart from "../report/line/NeoLineChart";
import NeoLinePropertySelect from "../report/line/NeoLinePropertySelect";
import NeoPropertySelectReport from "../report/select/NeoPropertySelectReport";

let tallRowCount = 14;
let normalRowCount = 5;


class NeoCardComponent extends React.Component {
    resize = () => this.stateChanged({"label": "resize"})

    defaultState = {
        width: this.props.width,
        height: this.props.height,
        action: <div key={0}></div>,
        type: this.props.type,
        page: (this.props.page ? Math.min(this.props.page, 200) : 1),
        query: (this.props.query ? this.props.query : ""),
        labels: [],
        properties: (this.props.propertiesSelected ? this.props.propertiesSelected : []),
        propertiesSelected: (this.props.propertiesSelected ? this.props.propertiesSelected : []),
        parameters: (this.props.parameters) ? (this.props.parameters) : "",
        parsedParameters: {},
        refresh: (this.props.refresh ? this.props.refresh : 0),
        title: (this.props.title ? this.props.title : "")
    };

    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.updateGraphChips = this.updateGraphChips.bind(this);
        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.updateBarPropertySelect = this.updateBarPropertySelect.bind(this);
        this.updateLinePropertySelect = this.updateLinePropertySelect.bind(this);
        this.counter = 0;
        this.state = this.defaultState;
        this.myRef = React.createRef();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize)
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize)
        this.parseParameters(this.props);
        this.neoCardSettings =
            <NeoCardSettings refresh={this.props.refresh}
                             size={this.props.width + ((this.props.height - 4) / 4) * 12}
                             type={this.props.type}
                             parameters={this.state.parameters}
                             query={this.props.query}
                             onChange={this.stateChanged}/>;
        this.cardTitle = <Textarea
            onChange={e => this.stateChanged({"label": "ChangedTitle", value: e.target.value})}
            noLayout={true}
            disabled={!this.props.editable}
            defaultValue={this.state.title}
            key={this.counter}
            className="card-title editable-title"
            placeholder={"Report name..."}/>;
        this.counter += 1;
        this.stateChanged({})
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            this.counter += 1;
            this.state = this.defaultState;
            this.stateChanged({label: "SettingsSaved"})
            this.neoCardSettings =
                <NeoCardSettings refresh={this.state.refresh} size={this.props.width} type={this.props.type}
                                 key={this.counter} query={this.props.query}
                                 parameters={this.state.parameters} onChange={this.stateChanged}/>;
            this.cardTitle = <Textarea
                key={this.counter}
                onChange={e => this.stateChanged({"label": "ChangedTitle", value: e.target.value})}
                noLayout={true}
                className="card-title editable-title"
                placeholder={"Report name..."}/>;
        }
    }

    stateChanged(update) {
        if (update.label === "QueryChanged") {
            this.state.query = update.value;
            return
        }
        if (update.label === "CreateError") {
            this.props.onChange(update);
            return
        }
        if (update.label === "CypherError") {
            this.state.success = false;
        }
        if (update.label === "CypherSuccess") {
            this.state.success = true;
            return
        }
        if (update.label === "SettingsSaved") {
            this.updateCardSettings(update);

        }
        if (update.label === "CategoryChanged" || update.label === "X-AxisChanged") {
            this.state.propertiesSelected[0] = update.value;
        }
        if (update.label === "ValueChanged" || update.label === "Y-AxisChanged") {
            this.state.propertiesSelected[1] = update.value;
        }
        if (update.label === "ChangedTitle") {
            this.state.title = update.value;
            this.props.onChange({"label": "CardStateChanged", "id": this.props.id, "state": this.state});
            return
        }
        if (update.label === "CypherParamsChanged") {
            this.state.parameters = update.value;
            return
        }
        if (update.label === "RefreshRateChanged") {
            this.state.refresh = update.value;
            return
        }

        if (update.label === "CardShiftRight" || update.label === "CardShiftLeft" || update.label === "CardDelete") {
            update.card = this;
            this.props.onChange(update);
        }
        if (update.label === "propertyChanged") {
            let index = update.value.split("-")[0]
            let value = update.value.split("-")[1]
            this.state.propertiesSelected[index] = value;
            this.state.page += 1;
        }
        if (update.label === "Refresh") {
            this.state.page += 1;
        }
        if (update.label === "PageChanged") {
            this.state.page = update.value;
        }
        if (update.label === "TypeChanged") {
            this.state.page = 1;
            this.state.type = update.value;
        }
        if (update.label === "SizeChanged") {
            this.state.width = (update.value % 12 == 0) ? 12 : (update.value % 12);
            this.state.height = Math.ceil(update.value / 12) * 4;
        }

        // different settings for the different report types
        this.state = this.updateReportComponent(this.state);
        this.setState(this.state);
        this.props.onChange({"label": "CardStateChanged", "id": this.props.id, "state": this.state});
    }

    updateReportComponent(state) {
        if (this.state.type === 'table') {
            this.state.content =
                <NeoTable connection={this.props.connection}
                          rows={this.state.height == 4 ? normalRowCount : tallRowCount} page={this.state.page}
                          query={this.state.query}
                          stateChanged={this.stateChanged}
                          params={this.state.parsedParameters}
                          refresh={this.state.refresh}
                />
            this.state.action =
                <NeoPagination page={this.state.page} key={0} data={this.state.data} onChange={this.stateChanged}/>
        }
        if (this.state.type === 'bar') {
            this.state.content =
                <NeoBarChart connection={this.props.connection}
                             page={this.state.page}
                             query={this.state.query}
                             clientWidth={this.myRef.current.clientWidth}
                             id={this.props.id}
                             stateChanged={this.stateChanged}
                             propertiesSelected={this.state.propertiesSelected}
                             onNodeLabelUpdate={this.updateBarPropertySelect}
                             params={this.state.parsedParameters}
                             refresh={this.state.refresh}
                             width={this.state.width}
                             height={this.state.height}
                />
        }
        if (this.state.type === 'line') {
            this.state.content =
                <NeoLineChart connection={this.props.connection}
                              page={this.state.page}
                              query={this.state.query}
                              clientWidth={this.myRef.current.clientWidth}
                              id={this.props.id}
                              stateChanged={this.stateChanged}
                              propertiesSelected={this.state.propertiesSelected}
                              onNodeLabelUpdate={this.updateLinePropertySelect}
                              params={this.state.parsedParameters}
                              refresh={this.state.refresh}
                              width={this.state.width}
                              height={this.state.height}
                />
        }
        if (this.state.type === "graph") {
            this.state.page += 1;
            this.state.content =
                <NeoGraphViz
                    connection={this.props.connection}
                    query={this.state.query}
                    params={this.state.parsedParameters}
                    clientWidth={this.myRef.current.clientWidth}
                    propertiesSelected={this.state.propertiesSelected}
                    onNodeLabelUpdate={this.updateGraphChips}
                    width={this.state.width}
                    id={this.props.id}
                    height={this.state.height} page={this.state.page}
                    stateChanged={this.stateChanged}
                    data={this.state.data}
                    refresh={this.state.refresh}/>
        }
        if (this.state.type === 'json') {
            this.state.content =
                <NeoJSONView
                    connection={this.props.connection}
                    query={this.state.query}
                    params={this.state.parsedParameters}
                    data={this.state.data}
                    stateChanged={this.stateChanged}
                    refresh={this.state.refresh}/>
            this.state.action = <div key={0}></div>
        }
        if (this.state.type === 'select') {
            this.state.content =
                <NeoPropertySelectReport
                    connection={this.props.connection}
                    query={this.state.query}
                    params={this.state.parsedParameters}
                    data={this.state.data}
                    stateChanged={this.stateChanged}
                    onSelectionChange={this.onSelectionChange}
                    refresh={this.state.refresh}/>
            this.state.action = <div key={0}></div>
        }
        if (this.state.type === 'text') {
            this.state.content =
                <NeoPlainTextView
                    connection={this.props.connection}
                    query={'return true'}
                    data={this.state.query}
                    stateChanged={this.stateChanged}
                    refresh={this.state.refresh}/>
            this.state.action = <div key={0}></div>
        }

        // if (!this.state.success) {
        //     this.state.action = <div key={0}></div>
        // }
        return state
    }

    updateCardSettings(update) {
        this.parseParameters(this.props);

        if (this.state.type === "bar" || this.state.type === "line") {
            this.state.propertiesSelected = []
        }

        // TODO: Force a refresh of the card component in a much cleaner way.
        if (this.state.type !== "graph") {
            this.state.query = this.state.query.endsWith('\n') ?
                this.state.query.substr(0, this.state.query.length - 1) :
                this.state.query += "\n";
        }


        this.props.onChange({"label": "CardStateChanged", "id": this.props.id, "state": this.state});


    }

    onSelectionChange(label, property, value) {
        this.state.parsedParameters["neodash_movie_title"] = value;
        this.stateChanged({label: "Refresh"})
    }

    parseParameters(props) {
        this.state.parsedParameters = (

            function (parameters) {
                try {
                    if (parameters.trim() === "") {
                        return {};
                    }

                    let value = JSON.parse(parameters);
                    if (value.constructor === Object) {
                        return value;
                    }
                    return {};
                } catch (err) {

                    props.onChange({
                        label: "CreateError",
                        value: 'Unable to parse Cypher parameters. ' + err.toString()
                    })
                    return {};
                }
            })(this.state.parameters);
    }

    updateBarPropertySelect(labels) {
        this.state.page += 1;
        this.state.action =
            <NeoBarPropertySelect propertiesSelected={this.state.propertiesSelected} page={this.state.page} key={0}
                                  data={this.state.data}
                                  onChange={this.stateChanged}
                                  categories={labels} values={labels}
            />

        this.setState(this.state);
    }

    updateLinePropertySelect(labels) {
        this.state.page += 1;
        this.state.action =
            <NeoLinePropertySelect propertiesSelected={this.state.propertiesSelected} page={this.state.page} key={0}
                                   data={this.state.data}
                                   onChange={this.stateChanged}
                                   categories={labels} values={labels}
            />

        this.setState(this.state);
    }

    updateGraphChips(labels) {
        this.state.properties = Object.values(labels);
        if (this.state.labels.toString() !== Object.keys(labels).toString()) {
            this.state.propertiesSelected = Object.keys(labels).map(l => {

                // If nothing's selected, select the 'name' property. If the name's not available, just pick the first.
                if (labels[l].includes('name')) {
                    return "name"
                } else {
                    return labels[l][0]
                }
            });

            this.state.labels = Object.keys(labels);
            this.stateChanged({label: "Refresh"})
        }


        this.state.action = <NeoGraphChips key={0} nodeLabels={Object.keys(labels)}
                       width={this.props.width}
                       params={this.state.parsedParameters}
                       properties={Object.values(labels).map((labelChoices, index) => {
                           let options = {}
                           labelChoices.forEach(choice =>
                               options[(index + "-" + choice)] = choice
                           )
                           return options;
                       })}
                       onChange={this.stateChanged}/>;

    }

    render() {
        let closeIcon = <div
            style={{'width': '100%', 'height': '60px', 'top': '0px', 'right': '0px', 'position': 'absolute'}}
            onClick={e => this.stateChanged({label: 'SettingsSaved'})}>
            <Icon>save</Icon>
        </div>;
        return <Col l={this.state.width} m={12} s={12}>
            <div ref={this.myRef}>
                <Card

                    actions={[this.state.action]}
                    style={{height: (this.state.height * 100 + 22 * ((this.state.height / 4) - 1)) + 'px'}}
                    className={"neo-card medium white darken-5 paginated-card"}
                    closeIcon={
                        closeIcon
                    }
                    revealIcon={(this.props.editable) ? <Icon>more_vert</Icon> : <div></div>}
                    textClassName="black-text"
                    title={this.cardTitle}
                    reveal={this.neoCardSettings}
                >{this.state.content}   </Card></div>
        </Col>
    }
}


class AddNeoCardComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Col l={4} m={12} s={12}><a>
            <Card actions={[]}
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