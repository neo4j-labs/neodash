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
            key: 3,
        }
        this.state.cards =
            [<NeoCard key={0} id={0} onChange={this.stateChanged} data={this.data} type='graph'/>,
                <NeoCard key={1} id={1} onChange={this.stateChanged} data={this.data} type='table'/>,
                <NeoCard key={2} id={2} onChange={this.stateChanged} data={this.data} type='json'/>,
                <AddNeoCard key={3} id={3} onClick={this.stateChanged}/>
            ]
    }

    stateChanged(update) {
        console.log(this.state.cards.map(card => (card.key)));
        if (update.label === 'newCard') {
            let newCard = <NeoCard id={this.state.key} key={this.state.key} onChange={this.stateChanged}
                                   data={this.data}
                                   type='table'/>;
            this.state.key += 1;
            this.state.cards.splice(this.state.cards.length - 1, 0, newCard);
        }

        if (update.label === 'CardShiftLeft') {
            let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
            let index = this.state.cards.indexOf(card);
            if (index != 0) {
                let otherCard = this.state.cards[index - 1];
                this.state.cards.splice(index - 1, 2, card, otherCard);
            }
        }
        if (update.label === 'CardShiftRight') {
            let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
            let index = this.state.cards.indexOf(card);
            if (index != this.state.cards.length - 2) {
                let otherCard = this.state.cards[index + 1];
                this.state.cards.splice(index, 2);
                this.state.cards.splice(index, 0, otherCard, card);
            }
        }
        if (update.label === 'CardDelete') {
            let card = this.state.cards.filter((card) => card.props.id === update.card.props.id)[0]
            let index = this.state.cards.indexOf(card);
            this.state.cards.splice(index, 1);
        }
        this.setState(this.state);
    }

    data =
        [
            {'Store': 'LDN', 'date': '9-3-2020', 'Person': 'Jim', 'Food': 'Chicken', 'Price': 5.20},
            {'Store': 'END', 'Day': '10-3-2020', 'Person': 'Bob', 'Food': 'Ham', 'Price': 2.00},
            {'Store': 'END', 'Day': '10-3-2020', 'Person': 'Alice', 'Food': 'Noodles', 'Price': 1.50},
            {'Store': 'LDN', 'Day': '11-3-2020', 'Person': 'Anna', 'Food': 'Noodles', 'Price': 2.50},
            {'Store': 'END', 'Day': '11-3-2020', 'Person': 'Kenny', 'Food': 'Beer', 'Price': 8.60},
            {'Store': 'PTH', 'Day': '12-3-2020', 'Person': 'Mike', 'Food': 'Water', 'Price': 8.20},
            {'Store': 'PTH', 'Day': '12-3-2020', 'Person': 'Fry', 'Food': 'Chicken', 'Price': 5.20},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Coooooooooooooooooooooooooooooooooooooooooooooookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30},
            {'Store': 'END', 'Day': '12-3-2020', 'Person': 'Steve', 'Food': 'Cookies', 'Price': 1.30}
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