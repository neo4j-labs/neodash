
export const extensionEnabled = (extensions, name) => {
    return extensions && extensions[name]; 
}


export const getExampleReports = (extensions, exampleReports, exampleAdvancedReports) => {
    if(extensions['advanced-charts']){
        return [...exampleReports, ...exampleAdvancedReports];
    }
    return exampleReports;
}

export const getReportTypes = (extensions, reportTypes, advancedReportTypes) => {
    if(extensions['advanced-charts']){
        return {...reportTypes, ...advancedReportTypes};
    }
    return reportTypes;
}