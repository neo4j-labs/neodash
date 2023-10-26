/** 
 * Code transpiled and extended from https://github.com/hustcc/gantt-for-react
 * (MIT License) 
 */
import React, { Component } from 'react';
import { bind, clear } from 'size-sensor';
import Gantt from './lib';

export default class ReactGantt extends Component {
    ganttRef : SVGSVGElement | undefined = undefined;
    ganttInst: any;

    componentDidMount() {
        this.renderFrappeGanttDOM();
    };

    // redraw the gantt when update. now change the viewMode
    componentDidUpdate(prevProps, _) {
        if (this.ganttInst) {
            this.ganttInst.refresh(this.props.tasks);
            if (this.props.viewMode !== prevProps.viewMode) {
                this.ganttInst.change_view_mode(this.props.viewMode);
            }
        }
    }

    componentWillUnmount() {
        clear(this.ganttRef);
    }

    /**
     * render the gantt chart
     * @returns {Gantt}
     */
    renderFrappeGanttDOM() {
        // init the Gantt
        // if exist, return
        if (this.ganttInst){
            return this.ganttInst;
        }
        
        const {
            onClick,
            onDateChange,
            onProgressChange,
            onViewChange,
            customPopupHtml,
            tasks,
            viewMode,
        } = this.props;

        // when resize
        bind(this.ganttRef, () => {
            if (this.ganttInst) {
                this.ganttInst.refresh(this.props.tasks);
            }
        });

        // new instance
        this.ganttInst = new Gantt(this.ganttRef, tasks, {
            on_click: onClick,
            on_date_change: onDateChange,
            on_progress_change: onProgressChange,
            on_view_change: onViewChange,
            custom_popup_html: customPopupHtml || null
        });
        // change view mode
        this.ganttInst.change_view_mode(viewMode);
        return this.ganttInst;
    };

    render() {
        return (
            <svg ref={node => { this.ganttRef = node; }} />
        );
    }
};
