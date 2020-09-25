import React from "react";
import Card from "react-materialize/lib/Card";
import Pagination from "react-materialize/lib/Pagination";
import Icon from "react-materialize/lib/Icon";
import Textarea from "react-materialize/lib/Textarea";
import TextInput from "react-materialize/lib/TextInput";
import Select from "react-materialize/lib/Select";
import Button from "react-materialize/lib/Button";
import NeoTable from "./NeoTable";
import NeoGraphViz from "./NeoGraphVis";
import Col from "react-materialize/lib/Col";
import Chip from "react-materialize/lib/Chip";

class NeoCardComponent extends React.Component {

    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.state = {l: 6, cardHeight: 'medium', action: <NeoPagination/>}
        this.state.report = this.props.report;
        this.state.size = this.props.size;

        if (this.state.report == 'table') {
            this.state.content = <NeoTable data={this.props.data}/>
            this.state.action = <NeoPagination data={this.props.data}/>
        }
        if (this.state.report == 'graph') {
            this.state.content = <NeoGraphViz data={this.props.data}/>

            this.state.action = chip
        }
    }

    stateChanged(state) {
        console.log(state)
        if (state.label == "Type") {
            if (state.value == "table") {
                this.state.content = <NeoTable data={this.props.data}/>
                this.state.action = <NeoPagination data={this.props.data}/>
            }
            if (state.value == "graph") {
                this.state.content = <NeoGraphViz data={this.props.data}/>
                this.state.action = chip;
            }
        }
        if (state.label == "Size") {
            if (state.value == "small") {
                this.state.l = 4
                this.state.cardHeight = 'medium'
            }
            if (state.value == "medium") {
                this.state.l = 6
                this.state.cardHeight = 'medium'
            }
            if (state.value == "large") {
                this.state.l = 8
                this.state.cardHeight = 'medium'
            }
            if (state.value == "full") {
                this.state.l = 12
                this.state.cardHeight = 'medium'
            }
            if (state.value == "huge") {
                this.state.l = 12
                this.state.cardHeight = 'huge'
            }
        }
        this.setState(this.state);
    }

    render(content) {
        let cardTitle = <Textarea noLayout={true} className="card-title editable-title"
                                  placeholder={"Report name..."}/>;
        let revealCardTitle = <p style={{'padding-left': '150px', 'display': 'none'}}></p>;

        return <Col l={this.state.l} m={12} s={12}>
            <Card
                actions={[this.state.action]}
                className={this.state.cardHeight + " white darken-5 paginated-card"}
                closeIcon={<Icon>save</Icon>}
                revealIcon={<Icon>more_vert</Icon>}
                textClassName="black-text"
                // <i style={{marginRight: '40px'}} className="material-icons right">refresh</i>
                title={[revealCardTitle, cardTitle]}
                reveal={[<NeoCardReveal onChange={this.stateChanged}/>]}
            >{this.state.content}</Card>
        </Col>
    }
}

class NeoPagination extends React.Component {
    render(content) {
        return <Pagination
            activePage={1}
            items={100}
            leftBtn={<Icon>chevron_left</Icon>}
            maxButtons={5}
            rightBtn={<Icon>chevron_right</Icon>}
        />;
    }
}

class NeoTextArea extends React.Component {
    render(content) {
        return (
            <Textarea
                id="Textarea-12"
                l={12}
                m={12}
                s={12}
                placeholder={"Enter Cypher here..."}
                xl={12}></Textarea>
        );
    }
}

class NeoCardReveal extends React.Component {
    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
    }

    stateChanged(data) {
        this.props.onChange(data);
    }

    render(content) {
        let sizeOptions = {
            'small': 'Small (4x4)',
            'medium': 'Medium (6x4)',
            'large': 'Large (8x4)',
            'full': 'Full (12x4)',
            'huge': 'Huge (12x8)'
        };
        let vizOptions = {
            'table': 'Table',
            'graph': 'Graph',
            'plot': 'Plot',
            'bar': 'Bar Chart',
        };

        return (

            <div>

                <div style={{"float": "right", "position": "absolute", "left": "18px", "top": "15px"}}>
                    <NeoButton color='red' key='2' icon='delete'/>
                    <NeoButton color='black' icon='chevron_left'></NeoButton>
                    <NeoButton color='black' icon='chevron_right'></NeoButton>
                </div>
                <NeoSelect label="Type" onChange={this.stateChanged} options={vizOptions}/>
                <NeoSelect label="Size" onChange={this.stateChanged} options={sizeOptions}/>
                <TextInput style={{width: '140px'}} label={"Cypher Parameters"} placeholder={"{x: '123', y: 5}"}
                           id="TextInput-4"/>
                <TextInput style={{width: '140px'}} label={"Result Limit"} defaultValue={"100"}
                           id="TextInput-4"/>

                <NeoTextArea/>
            </div>
        );
    }
}


class NeoSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 'medium', label: this.props.label}
        this.stateChanged = this.stateChanged.bind(this);
        this.select = <Select
            label={this.props.label}
            onChange={this.stateChanged}
            multiple={false}
            options={{
                classes: '',

                dropdownOptions: {
                    alignment: 'left',
                    autoTrigger: true,
                    closeOnClick: true,
                    constrainWidth: true,
                    coverTrigger: true,
                    hover: false,
                    inDuration: 150,
                    onCloseEnd: null,
                    onCloseStart: null,
                    onOpenEnd: null,
                    onOpenStart: null,
                    outDuration: 250
                }
            }}
            value="medium"
        >
            {this.generateOptions()}
        </Select>;
    }

    generateOptions() {
        let options = this.props.options;
        let optionsComponent = [];
        Object.keys(options).forEach(key => optionsComponent.push(<option value={key}>{options[key]}</option>))
        return optionsComponent;
    }

    stateChanged(e) {
        this.setState({
            value: e.target.value
        });
        this.state.value = e.target.value;
        this.props.onChange(this.state);
    }

    render(content) {
        return this.select;
    }
}

class NeoButton extends React.Component {
    render(content) {
        return (
            <Button floating={true} className={"btn " + this.props.color} key={this.props.key}
                    href="#"><Icon>{this.props.icon}</Icon></Button>
        );
    }
}

let chip = <div style={{marginLeft: '10px'}}>
    <Chip
        close={false}
        closeIcon={<Icon className="close">close</Icon>}
        options={null}
        style={{backgroundColor: 'seagreen', color: 'white'}}
    >
        Person(name)
    </Chip>
    <Chip
        close={false}
        closeIcon={<Icon className="close">close</Icon>}
        options={null}
        style={{backgroundColor: 'darkred', color: 'white'}}
    >
        Product(name)
    </Chip>
    <div style={{float: 'right', marginRight: '10px'}}>
    <NeoButton color="grey lighten-3" icon='refresh' ></NeoButton>
    </div>
</div>;


class AddNeoCardComponent extends React.Component {
    render(content) {

        return <Col l={4} m={6} s={12}><a><Card actions={[]}
                                                className={"medium grey lighten-2 button add-neo-card"}
                                                closeIcon={<Icon>close</Icon>}
                                                revealIcon={<Icon>more_vert</Icon>}
                                                textClassName="black-text"
                                                title=""
        >
            <Button
                className="btn-floating btn-center-align blue-grey" onClick={
                function () {
                    alert("new card");
                }
            }><Icon>add</Icon></Button>
        </Card></a></Col>
    }

}

export const NeoCard = NeoCardComponent;
export const AddNeoCard = AddNeoCardComponent;