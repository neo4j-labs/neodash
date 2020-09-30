import React from "react";
import Chip from "react-materialize/lib/Chip";
import Icon from "react-materialize/lib/Icon";
import NeoButton from "./NeoButton";

class NeoGraphChips extends React.Component {
    render() {
        return (
            <div style={{marginLeft: '10px'}}>
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
                    closeIcon={<Icon className="close">close</Icon>}refresh
                    options={null}
                    style={{backgroundColor: 'darkred', color: 'white'}}
                >
                    Product(name)
                </Chip>
                <div style={{float: 'right', marginRight: '10px'}}>
                    <NeoButton color="grey lighten-2" icon='refresh' onClick={click => this.props.onChange({'label': 'Refresh'})}/>
                </div>
            </div>
        );
    }
}

export default (NeoGraphChips);