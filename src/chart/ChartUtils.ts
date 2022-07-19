import domtoimage from 'dom-to-image';

/**
 * Basic function to convert a table row output to a CSV file, and download it.
 * TODO: Make this more robust. Probably the commas should be escaped to ensure the CSV is always valid.
 */
export const downloadCSV = (rows) => {
    const element = document.createElement("a");
    let csv = "";
    const headers = Object.keys(rows[0]).slice(1);
    csv += headers.join(", ") + "\n";
    rows.forEach(row => {
        headers.forEach((header) => {
            // Parse value
            var value = row[header];
            if (value && value["low"]) {
                value = value["low"];
            }
            csv += JSON.stringify(value).replaceAll(",", ";");
            csv += (headers.indexOf(header) < headers.length - 1) ? ", " : "";
        });
        csv += "\n";
    });

    const file = new Blob([csv], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "table.csv";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
}

/**
 * Replaces all global dashboard parameters inside a string with their values.
 * @param str The string to replace the parameters in.
 * @param parameters The parameters to replace.
 */
export function replaceDashboardParameters(str, parameters) {
    if (!str) return "";
    Object.keys(parameters).forEach(key => {
        str = str.replaceAll("$" + key, parameters[key] !== null ? parameters[key] : "");
    });
    return str;
}

/**
 * Downloads a screenshot of the element reference passed to it.
 * @param ref The reference to the element to download as an image.
 */
export const downloadComponentAsImage = async (ref) => {
    const element = ref.current;

    domtoimage.toPng(element,{bgcolor:'white'}).then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'image.png';
        link.href = dataUrl;
        link.click();
    });
  };

  import { QueryResult, Record as Neo4jRecord } from 'neo4j-driver'

export function recordToNative(input: any): any {
    if ( !input && input !== false ) {
        return null
    }
    else if ( typeof input.keys === 'object' && typeof input.get === 'function' ) {
        return Object.fromEntries(input.keys.map(key => [ key, recordToNative(input.get(key)) ]))
    }
    else if ( typeof input.toNumber === 'function' ) {
        return input.toNumber()
    }
    else if ( Array.isArray(input) ) {
        return (input as Array<any>).map(item => recordToNative(item))
    }
    else if ( typeof input === 'object' ) {
        const converted = Object.entries(input).map(([ key, value ]) => [ key, recordToNative(value) ])

        return Object.fromEntries(converted)
    }

    return input
}

export function resultToNative(result: QueryResult): Record<string, any> {
    if (!result) return {}

    return result.records.map(row => recordToNative(row))
}
export function checkResultKeys(first: Neo4jRecord, keys: string[]) {
    const missing = keys.filter(key => !first.keys.includes(key))

    if ( missing.length > 0 ) {
        return new Error(`The query is missing the following key${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}.  The expected keys are: ${keys.join(', ')}`)
    }

    return false
}

/**
 * For hierarchical data structures, recursively search for a key property that must have a given value.
 * If none can be found, return null.
 */
export const search = (tree, value, key = 'id', reverse = false) => {
    if (tree.length == 0) return null;
    const stack = Array.isArray(tree) ? [...tree] : [tree]
    while (stack.length) {
        const node = stack[reverse ? 'pop' : 'shift']()
        if (node[key] && node[key] === value) return node
        node.children && stack.push(...node.children)
    }
    return null
};


/**
 * For hierarchical data, we remove all intermediate node prefixes generate by `processHierarchyFromRecords`.
 * This ensures that the visualization itself shows the 'real' names, and not the intermediate ones.
 */
export const mutateName = (currentNode) => {
    if (currentNode.name){
        let s = currentNode.name.split('_');
        currentNode.name = s.length > 0 ? s.slice(1).join('_'): s[0];
    }

    if(currentNode.children)
        currentNode.children.forEach(n => mutateName(n))
}

export const findObject = (data, name) => data.find(searchedName => searchedName.name === name);

export const flatten = data =>
    data.reduce((acc, item) => {
        if (item.children)
            return [...acc, item, ...flatten(item.children)]
        return [...acc, item]
    }, []);

/**
 * Converts a list of Neo4j records into a hierarchy structure for hierarchical data visualizations.
 */
export const processHierarchyFromRecords = (records : Record<string, any>[]) => {
    return records.reduce((data: Record<string, any>, row: Record<string, any>) => {

        try {
        const index = recordToNative(row.get('index'));
        const key = recordToNative(row.get('key'));
        const value = recordToNative(row.get('value'));

        let holder = data;
        for (let [idx, val] of index.entries()) {
            // Add a level prefix to each item to avoid duplicates
            val = "lvl"+idx+"_"+val;
            let obj = search(holder, val, 'name');
            let entry = { name: val };
            if(obj)
                holder = obj;
            else{
                if(Array.isArray(holder))
                    holder.push(entry);
                else if (holder.hasOwnProperty("children"))
                    holder.children.push(entry)
                else
                    holder.children = [entry]

                holder = search(holder, val, 'name');
            }
        }
        holder.loc = value;
        return data
        } catch(e) {
            console.error(e);
            return [];
        }
    }, []);
}
