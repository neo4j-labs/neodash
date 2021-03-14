import React from "react";
import NeoOptionSelect from "../../component/NeoOptionSelect";
import NeoFooter from "./NeoFooter";

/**
 * A bar chart footer allows the user to select:
 * - the categories of the plot (x-axis)
 * - the values of the plot (y-axis)
 *
 * On selection of new fields, the report corresponding to the footer will be refreshed.
 */
class NeoBarChartFooter extends NeoFooter {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div className="neo-property-select" style={{marginLeft: '20px', marginTop: "-8px"}}>
                <NeoOptionSelect
                    defaultValue={(this.props.propertiesSelected[0]) ? this.props.propertiesSelected[0] : Object.values(this.props.values)[0]}
                    suffix="-name" label="Category"
                    onChange={this.props.onChange} value={'name'}
                    options={this.props.categories}/>
                <NeoOptionSelect
                    defaultValue={(this.props.propertiesSelected[1]) ? this.props.propertiesSelected[1] : Object.values(this.props.values)[1]}
                    suffix="-name" label="Value" onChange={this.props.onChange} value={'name'}
                    options={this.props.values}/>
            </div>
        );
    }

}

export default (NeoBarChartFooter);