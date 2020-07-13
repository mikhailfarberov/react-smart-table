import React from "react";
import { 
    Table, 
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Collapse
} from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";
import { Multiselect } from 'react-widgets'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import moment from 'moment';
import classnames from "classnames";
import "bootstrap/dist/css/bootstrap.css";
import 'react-widgets/dist/css/react-widgets.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import '@mikhailfarberov/react-smart-table/dist/styles.css';

var defaultProps = {
    "headers": [],
    "data": [],
    "filters": {},
    "labels": {
        "emptyTable": "no data found",
        "open": "open",
        "emptyList": "list is empty",
        "emptyFilter": "filter is empty",
        "selectedItems": "selected items",
        "noneSelected": "items are not selected",
        "removeLabel": "remove",
        "format": "MM/DD/YYYY",
        "separator": " - ",
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": [
            "Su",
            "Mo",
            "Tu",
            "We",
            "Th",
            "Fr",
            "Sa"
        ],
        "monthNames": [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ],
        "firstDay": 1
    }
}
class SmartTable extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
        this.state = {...defaultProps, ...{"headers": props.headers, "data": props.data}}
        this.state.labels = {...defaultProps.labels, ...props.labels}
        if (props.headers !== undefined) {
            for (let col of props.headers) {
                if (col.filter === undefined || col.filter.default === undefined)
                    continue;
                this.state.filters[col.key] = col.filter.default
            }
        }
        this.state.opened = {}
        
        this.filterChangeHandler = this.filterChangeHandler.bind(this)
        this.filterDatesSelected = this.filterDatesSelected.bind(this)
        this.filterListHandler = this.filterListHandler.bind(this)
    }

    static getDerivedStateFromProps(props, prevState) {
        prevState.headers = props.headers
        if (props.headers !== undefined) {
            for (let col of props.headers) {
                if (col.filter === undefined || col.filter.default === undefined)
                    continue;
                prevState.filters[col.key] = col.filter.default
            }
        }
        prevState.data = props.data
        return prevState
    }

    filterChangeHandler(key) {
        const val = this["table-filter-" + key].value
        let filters = {...this.state.filters}
        filters[key] = val
        this.setState({"filters": filters})
        if (this.props.onFilter !== undefined)
            this.props.onFilter(filters)
    }

    filterListHandler(items, key) {
        let filters = {...this.state.filters}
        filters[key] = items.map((item) => { return item.id })
        this.setState({"filters": filters})
        if (this.props.onFilter !== undefined)
            this.props.onFilter(filters)
    }

    filterDatesSelected(e, picker, key) {
        let filters = {...this.state.filters}
        filters[key][0] = picker.startDate
        filters[key][1] = picker.endDate
        this.setState({"filters": filters})
        if (this.props.onFilter !== undefined)
            this.props.onFilter(filters)
    }

    tableHeader() {
        if (this.state.headers === undefined)
            return ''
        let columns = this.state.headers.map((col) => {
            if (col.collapsed) 
                return null
            return (col.width !== undefined) ? (<th key={col.key} style={{"width": col.width}}>{col.title}</th>):(<th key={col.key}>{col.title}</th>)
        })
        return (
            <tr className="smart-table-head">
                {columns}
            </tr>
        )
    }

    tableFilters() {
        if (this.state.headers === undefined)
            return ''
        let filtered = false;
        let columns = this.state.headers.map((col) => {
            let filter = '';
            if (col.collapsed) 
                return null
            if (col.filter !== undefined) {
                filtered = true;
                switch (col.filter.type) {
                    case 'multi':
                        let val = []
                        if (this.state.filters[col.key]) {
                            for (let v of this.state.filters[col.key]) {
                                if (col.filter.data) {
                                    for (let vv of col.filter.data) {
                                        if (vv.id == v)
                                            val.push(vv)
                                    }
                                }
                            }
                        }
                        filter = (
                            <Multiselect 
                                id={'filter-' + col.key} 
                                messages={{
                                    "open": this.state.labels.open,
                                    "emptyList": this.state.labels.emptyList,
                                    "emptyFilter": this.state.labels.emptyFilter,
                                    "selectedItems": this.state.labels.selectedItems,
                                    "noneSelected": this.state.labels.noneSelected,
                                    "removeLabel": this.state.labels.removeLabel
                                }}
                                data={col.filter.data} 
                                valueField='id' 
                                textField='name' 
                                defaultValue={val} 
                                placeholder={col.filter.placeholder} 
                                onChange={(items) => this.filterListHandler(items, col.key)} />
                            )
                        break;
                    case 'daterange':
                        filter = (
                            <DateRangePicker
                                locale={this.state.labels}
                                startDate={this.state.filters[col.key] ? moment(this.state.filters[col.key][0]).format(this.state.labels.format):moment().format(this.state.labels.format)}
                                endDate={this.state.filters[col.key] ? moment(this.state.filters[col.key][1]).format(this.state.labels.format):moment().format(this.state.labels.format)}
                                onApply={(e, picker) => this.filterDatesSelected(e, picker, col.key)}>
                                <Input type="text" id={'filter-' + col.key} value={this.state.filters[col.key] ? (moment(this.state.filters[col.key][0]).format(this.state.labels.format) + this.state.labels.separator + moment(this.state.filters[col.key][1]).format(this.state.labels.format)):''} onChange={(e) => this.filterChangeHandler(e, col.key)} autoComplete="off" />
                            </DateRangePicker>
                        )
                        break;
                    default:
                        filter = (
                            <InputGroup>
                                <Input 
                                    type="text" 
                                    id={'filter-' + col.key}
                                    onKeyDown={(e) => { 
                                        if (e.key == 'Enter') {
                                            this.filterChangeHandler(col.key);
                                            return;
                                        }
                                        if (e.key == 'Backspace') {
                                            return;
                                        }
                                        if (col.pattern) { 
                                            var re = new RegExp(col.pattern); 
                                            if (!re.test(e.key)) e.preventDefault();
                                        }
                                    }}
                                    innerRef={node => (this["table-filter-" + col.key] = node)}
                                    defaultValue={this.state.filters[col.key]} 
                                    placeholder={col.filter.placeholder} />
                                <InputGroupAddon addonType="append">
                                    <InputGroupText>
                                        <i className="fa fa-search" onClick={(e) => this.filterChangeHandler(col.key)}></i>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>)
                }
            }
            return (<th key={'filter-' + col.key} >{filter}</th>)
        })
        return (filtered) ? (
            <tr className="smart-table-filter">
                {columns}
            </tr>
        ):''
    }

    tableData() {
        if (this.props.isLoading) {
            return (
                <tr>
                    <td className="loading" colSpan={(this.state.headers) ? this.state.headers.length:1}>
                        <span className="fa fa-spinner fa-pulse fa-3x fa-fw"></span>
                    </td>
                </tr>
            )
        }
        else if (this.state.data !== undefined && this.state.data.length > 0) {
            return this.state.data.map((row) => {
                let cols = this.state.headers.map((header) => {
                    if (header.collapsed)
                        return null
                    if (row[header.key] && typeof row[header.key] === 'object') {
                        if (row[header.key] instanceof moment)
                            return (
                                <td key={header.key}>
                                    {moment(row[header.key]).format(this.state.labels.format)}
                                </td>
                            )
                        else if (row[header.key]['name'])
                            return (
                                <td key={header.key}>
                                    {row[header.key]['name']}
                                </td>
                            )
                        else 
                            return (
                                <td key={header.key}>
                                    {row[header.key]}
                                </td>
                            )
                    } else 
                        return (
                            <td key={header.key}>
                                {row[header.key]}
                            </td>
                        )
                })
                let ret = []
                ret.push((
                    <tr 
                        className={classnames({"clickable": (this.props.onClick), "invalid": (this.props.valid && typeof row[this.props.valid] !== 'undefined' && !row[this.props.valid])})} 
                        key={"data-" + row[this.props.id]} 
                        onClick={(e) => this.props.onClick ? this.props.onClick(row[this.props.id]):null}>
                            {cols}
                    </tr>
                ))
                if (typeof this.props.collapsed !== 'undefined' && row[this.props.collapsed]) {
                    ret.push((
                        <Collapse tag="tr" className="collapsed" isOpen={this.state.opened.hasOwnProperty(row[this.props.id])}>
                            <td colSpan={cols.length}>
                                {row[this.props.collapsed]}
                            </td>
                        </Collapse>
                    ))
                }
                return ret
            })
        } else {
            return (
                <tr className="empty">
                    <td style={{"textAlign": "center"}} colSpan={(this.state.headers) ? this.state.headers.length:1}>{this.state.labels.emptyTable}</td>
                </tr>
            )
        }
    }

    toggleCollapsed(id) {
        let opened = {...this.state.opened}
        if (opened.hasOwnProperty(id))
            delete opened[id]
        else
            opened[id] = true
        this.setState({opened: opened})
    }

    render() {
        
        return (
            <Table className="smart-table">
                <thead>
                    {this.tableHeader()}
                    {this.tableFilters()}
                </thead>
                <tbody>
                    {this.tableData()}
                </tbody>            
            </Table>
        );
    }
}

SmartTable.propTypes = {
  id: PropTypes.string,
  valid: PropTypes.string,
  collapsed: PropTypes.string,
  headers: PropTypes.array,
  data: PropTypes.array,
  labels: PropTypes.object,
  onClick: PropTypes.func,
  onFilter: PropTypes.func,
  isLoading: PropTypes.bool
};

export default SmartTable;