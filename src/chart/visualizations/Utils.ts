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
        currentNode.name = s.length > 0 ? s[1] : s[0];
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

// TODO: Delete this test data for hierarchical reports.
export const hierarchicalTestData =  {
    "name": "nivo",
    "children": [
        {
            "name": "viz",
            "children": [
                {
                    "name": "stack",
                    "children": [
                        {
                            "name": "cchart",
                            "loc": 30064
                        },
                        {
                            "name": "xAxis",
                            "loc": 163841
                        },
                        {
                            "name": "yAxis",
                            "loc": 81499
                        },
                        {
                            "name": "layers",
                            "loc": 123359
                        }
                    ]
                },
                {
                    "name": "ppie",
                    "children": [
                        {
                            "name": "chart",
                            "children": [
                                {
                                    "name": "pie",
                                    "children": [
                                        {
                                            "name": "outline",
                                            "loc": 18509
                                        },
                                        {
                                            "name": "slices",
                                            "loc": 96675
                                        },
                                        {
                                            "name": "bbox",
                                            "loc": 161558
                                        }
                                    ]
                                },
                                {
                                    "name": "donut",
                                    "loc": 192783
                                },
                                {
                                    "name": "gauge",
                                    "loc": 92239
                                }
                            ]
                        },
                        {
                            "name": "legends",
                            "loc": 27356
                        }
                    ]
                }
            ]
        },
        {
            "name": "colors",
            "children": [
                {
                    "name": "rgb",
                    "loc": 138303
                },
                {
                    "name": "hsl",
                    "loc": 28193
                }
            ]
        },
        {
            "name": "utils",
            "children": [
                {
                    "name": "randomize",
                    "loc": 21157
                },
                {
                    "name": "resetClock",
                    "loc": 125941
                },
                {
                    "name": "noop",
                    "loc": 149459
                },
                {
                    "name": "tick",
                    "loc": 129827
                },
                {
                    "name": "forceGC",
                    "loc": 943
                },
                {
                    "name": "stackTrace",
                    "loc": 47399
                },
                {
                    "name": "dbg",
                    "loc": 123995
                }
            ]
        },
        {
            "name": "generators",
            "children": [
                {
                    "name": "address",
                    "loc": 100493
                }
            ]
        },
        {
            "name": "set",
            "children": [
                {
                    "name": "clone",
                    "loc": 81139
                },
                {
                    "name": "intersect",
                    "loc": 62508
                },
                {
                    "name": "merge",
                    "loc": 55346
                },
                {
                    "name": "reverse",
                    "loc": 121311
                },
                {
                    "name": "toArray",
                    "loc": 38100
                },
                {
                    "name": "toObject",
                    "loc": 154522
                },
                {
                    "name": "fromCSV",
                    "loc": 41776
                },
                {
                    "name": "slice",
                    "loc": 101958
                },
                {
                    "name": "append",
                    "loc": 147860
                },
                {
                    "name": "prepend",
                    "loc": 112871
                },
                {
                    "name": "shuffle",
                    "loc": 9858
                },
                {
                    "name": "pick",
                    "loc": 152671
                },
                {
                    "name": "plouc",
                    "loc": 166894
                }
            ]
        },
        {
            "name": "text",
            "children": [
                {
                    "name": "trim",
                    "loc": 16888
                },
                {
                    "name": "slugify",
                    "loc": 1891
                },
                {
                    "name": "snakeCase",
                    "loc": 93336
                },
                {
                    "name": "camelCase",
                    "loc": 12307
                },
                {
                    "name": "repeat",
                    "loc": 83941
                },
                {
                    "name": "padLeft",
                    "loc": 51330
                },
                {
                    "name": "padRight",
                    "loc": 109450
                },
                {
                    "name": "sanitize",
                    "loc": 163124
                },
                {
                    "name": "ploucify",
                    "loc": 118283
                }
            ]
        },
        {
            "name": "misc",
            "children": [
                {
                    "name": "greetings",
                    "children": [
                        {
                            "name": "hey",
                            "loc": 147145
                        },
                        {
                            "name": "HOWDY",
                            "loc": 115821
                        },
                        {
                            "name": "aloha",
                            "loc": 168617
                        },
                        {
                            "name": "AHOY",
                            "loc": 5059
                        }
                    ]
                },
                {
                    "name": "other",
                    "loc": 141182
                },
                {
                    "name": "path",
                    "children": [
                        {
                            "name": "pathA",
                            "loc": 111697
                        },
                        {
                            "name": "pathB",
                            "children": [
                                {
                                    "name": "pathB1",
                                    "loc": 19589
                                },
                                {
                                    "name": "pathB2",
                                    "loc": 139581
                                },
                                {
                                    "name": "pathB3",
                                    "loc": 32288
                                },
                                {
                                    "name": "pathB4",
                                    "loc": 128382
                                }
                            ]
                        },
                        {
                            "name": "pathC",
                            "children": [
                                {
                                    "name": "pathC1",
                                    "loc": 134193
                                },
                                {
                                    "name": "pathC2",
                                    "loc": 131748
                                },
                                {
                                    "name": "pathC3",
                                    "loc": 48812
                                },
                                {
                                    "name": "pathC4",
                                    "loc": 92870
                                },
                                {
                                    "name": "pathC5",
                                    "loc": 60282
                                },
                                {
                                    "name": "pathC6",
                                    "loc": 89867
                                },
                                {
                                    "name": "pathC7",
                                    "loc": 197107
                                },
                                {
                                    "name": "pathC8",
                                    "loc": 15449
                                },
                                {
                                    "name": "pathC9",
                                    "loc": 95465
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};