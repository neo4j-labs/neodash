import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import ApolloClient from "apollo-boost";
import {ApolloProvider} from "@apollo/react-hooks";

import Navbar from "react-materialize/lib/Navbar";
import Container from "react-materialize/lib/Container";
import Card from "react-materialize/lib/Card";
import Section from "react-materialize/lib/Section";
import Col from "react-materialize/lib/Col";
import Row from "react-materialize/lib/Row";
import Icon from "react-materialize/lib/Icon";
import Table from "react-materialize/lib/Table";
import Button from "react-materialize/lib/Button";
import Pagination from "react-materialize/lib/Pagination";
import Modal from "react-materialize/lib/Modal";
import Textarea from "react-materialize/lib/Textarea";
import Select from "react-materialize/lib/Select";
import Graph from './forcedirectedgraph.js'
import TextInput from "react-materialize/lib/TextInput";

let cardtitle = <Textarea noLayout={true} className="card-title editable-title"
                          placeholder={"Report name..."}></Textarea>;
let pagetitle = <Textarea noLayout={true} className="card-title editable-title"
                          defaultValue={"neodash.js ⚡"}></Textarea>;

const client = new ApolloClient({uri: process.env.REACT_APP_GRAPHQL_URI});
let brandName = 'Neo4j Dashboard Tool';
const brand = <a className="brand-logo" href="#">{brandName}</a>;
const navbar = <Navbar style={{backgroundColor: 'black'}} brand={pagetitle} id="mobile-nav" centerLogo></Navbar>;

let table = <Table>
    <thead>
    <tr>
        <th></th>
        <th data-field="id">Name</th>
        <th data-field="name">Item Name</th>
        <th data-field="price">Item Price</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>1</td>
        <td>
            Alvin
        </td>
        <td>
            Eclair
        </td>
        <td>
            $0.87
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            Alan
        </td>
        <td>
            Jellybean
        </td>
        <td>
            $3.76
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            Jonathan
        </td>
        <td>
            Lollipop
        </td>
        <td>
            $7.00
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            Jonathan
        </td>
        <td>
            Lollipop
        </td>
        <td>
            $7.00
        </td>
    </tr>
    <tr>
        <td>2</td>
        <td>
            Jonathan
        </td>
        <td>
            Lollipop
        </td>
        <td>
            $7.00
        </td>
    </tr>

    </tbody>
</Table>

let editbutton = <Button className="btn  teal" key="1" href="#"><Icon>edit</Icon></Button>;
let closebutton = <Button className="btn red" key="3" href="#"><Icon>delete</Icon></Button>;
let refreshbutton = <Button className="btn  teal" key="2" href="#"><Icon>refresh</Icon></Button>;
let expandbutton = <Button className="btn  teal " key="4" href="#"><Icon>zoom_out_map</Icon></Button>;
let root = document.getElementById("root");

let modal = <Modal
    actions={[
        <Button flat modal="close" node="button" waves="green">Close</Button>
    ]}
    bottomSheet={false}
    fixedFooter={false}
    header="Modal Header"
    id="Modal-0"
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
    root={root}
    trigger={expandbutton}
>
    <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum
    </p>

</Modal>


class AddNeoCard extends React.Component {
    render(content) {

        return <a><Card actions={[]}
                        className="medium grey lighten-2 button add-neo-card"
                        closeIcon={<Icon>close</Icon>}
                        revealIcon={<Icon>more_vert</Icon>}
                        textClassName="black-text"
                        title=""
        >
            {this.props.content}</Card></a>
    }
}
let cardsizeselect = <Select
    label="Width"
    id="Select-9"
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
    value="2"
>
    <option value="small">
        Small (4x4)
    </option>
    <option value="medium">
        Medium (6x4)
    </option>
    <option value="large">
        Large (8x4)
    </option>
    <option value="full">
        Full (12x4)
    </option>
    <option value="huge">
        Huge (12x8)
    </option>
</Select>
let visualizationselect = <Select
    label="Report type"
    id="Select-9"
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
    value="2"
>
    <option value="table">
        Table
    </option>
    <option value="json">
        JSON
    </option>
    <option value="plot">
        Plot
    </option>
</Select>
let textarea = <Textarea
    id="Textarea-12"
    l={12}
    m={12}
    s={12}
    placeholder={"Enter Cypher here..."}
    xl={12} ></Textarea>

let neocardreveal =
    <div>
        <p>{visualizationselect} {cardsizeselect}
        <TextInput label={"Cypher Parameters"} placeholder={"{x: '123', y: 5}"} id="TextInput-4" />
        <div style={{"float": "right", "margin-top": "14px"}}>{closebutton}
         {modal}
        </div></p>
        {textarea}


    </div>


class NeoCard extends React.Component {
    render(content) {



        return <Card
            actions={[<Pagination
                activePage={1}
                items={100}
                leftBtn={<Icon>chevron_left</Icon>}
                maxButtons={5}
                rightBtn={<Icon>chevron_right</Icon>}
            />]}
            className="medium white darken-5 paginated-card"
            closeIcon={<Icon>save</Icon>}
            revealIcon={<Icon>more_vert</Icon>}
            textClassName="black-text"

            title={[<p style={{'display': 'none'}}>Editing report</p>, cardtitle]}

            reveal={[neocardreveal]}
        >

            {this.props.content}
        </Card>
    }
}

let addNeoCardButton = <Button
    className="btn-floating btn-center-align blue-grey" onClick={
    function () {
        cards += <p>dddddddd</p>;
    }
}><Icon>add</Icon></Button>;

let cards = <>
    <Col l={12} m={12} s={12}>
        <NeoCard content={table}></NeoCard>
    </Col>
    <Col l={4} m={6} s={12}>
        <NeoCard content={table}></NeoCard>
    </Col>
    <Col className="s12 m6 l8">

        <NeoCard content={ <Graph/>}></NeoCard>
    </Col>
    <Col className="s12 m6 l4">
        <NeoCard content={table}></NeoCard>
    </Col>
    <Col l={6} m={6} s={12}>
        <NeoCard content={table}></NeoCard>
    </Col>
    <Col l={6} m={6} s={12}>
        <AddNeoCard content={addNeoCardButton}></AddNeoCard>
    </Col></>;

const Main = () => {

    return (
        <ApolloProvider client={client}>
            {navbar}
            <Container>
                <Section>
                    <Row>
                        {cards}
                    </Row>
                </Section>
                {/*<KettleLoggingTable/>*/}
            </Container>
        </ApolloProvider>
    );
};

ReactDOM.render(<Main/>, root);
registerServiceWorker();


