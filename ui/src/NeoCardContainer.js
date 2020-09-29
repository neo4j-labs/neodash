import React from "react";
import Section from "react-materialize/lib/Section";
import Row from "react-materialize/lib/Row";
import Container from "react-materialize/lib/Container";
import {AddNeoCard, NeoCard} from "./NeoCard";


class NeoCardContainer extends React.Component {
    constructor(props) {
        super(props);
        this.stateChanged = this.stateChanged.bind(this);
        this.state = {
            cards: [<NeoCard data={this.data} type='table'/>, <NeoCard data={this.data} type='graph'/>,
                <NeoCard data={this.data} type='graph'/>,
                <NeoCard data={this.data} type='table'/>,
                <AddNeoCard onClick={this.stateChanged}/>]

        }
    }

    stateChanged(update) {
        if (update.label === 'newCard') {
            this.state.cards.splice(this.state.cards.length-1, 0, <NeoCard data={this.data} type='table'/>);
        }
        this.setState(this.state);
    }

    data =
        [
            {'Store': 'LDN', 'date': '9-3-2020', 'Person': 'Jim', 'Food': 'Chicken', 'Price ($)': 5.20},
            {'Store': 'END', 'Day': '10-3-2020', 'Person': 'Bob', 'Food': 'Ham', 'Price ($)': 2.00},
            {'Store': 'END', 'Day': '10-3-2020', 'Person': 'Alice', 'Food': 'Noodles', 'Price ($)': 1.50},
            {'Store': 'LDN', 'Day': '11-3-2020', 'Person': 'Anna', 'Food': 'Noodles', 'Price ($)': 2.50},
            {'Store': 'END', 'Day': '11-3-2020', 'Person': 'Kenny', 'Food': 'Beer', 'Price ($)': 8.60},
            {'Store': 'PTH', 'Day': '12-3-2020', 'Person': 'Mike', 'Food': 'Water', 'Price ($)': 8.20},
            {'Store': 'PTH', 'Day': '12-3-2020', 'Person': 'Fry', 'Food': 'Chicken', 'Price ($)': 5.20},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price ($)': 1.30}
        ];


    render() {
        return (
            <Container>
                <Section>
                    <Row>
                        {this.state.cards}
                    </Row>
                </Section>
            </Container>
        );
    }
}


export default (NeoCardContainer);