import React from "react";
import ReactDOM from "react-dom";
import moment from "moment";
import SmartTable from "@mikhailfarberov/react-smart-table";

var labels = {
  "emptyTable": "no data", 
  "emptyList": "empty",
  "format": "MM/DD/YYYY",
  "applyLabel": "Apply",
  "cancelLabel": "Cancel",
  "fromLabel": "From",
  "toLabel": "To",
  "weekLabel": "W",
  "daysOfWeek": [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
  ],
  "monthNames": [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ],
  "firstDay": 1
};

var headers = [
  {
      "key": "id", 
      "title": "#", 
      "width": "10%", 
      "pattern": "^[0-9]+$", 
      "filter": {"type": "text", "placeholder": "#", "default": ""}
  },
  {
      "key": "firstname", 
      "title": "First Name", 
      "width": "20%", 
      "filter": {"type": "text", "placeholder": "First name", "default": ""}
  },
  {
      "key": "lastname", 
      "title": "Last Name", 
      "width": "20%", 
      "filter": {"type": "text", "placeholder": "Last name", "default": ""}
  },
  {
      "key": "title", 
      "title": "Job Title", 
      "width": "20%", 
      "filter": {
        "type": "multi", 
        "placeholder": "Title", 
        "data": [{"id": 1, "name": "Engineer"}, {"id": 2, "name": "Sales Manager"}, {"id": 3, "name": "Accountant"}],
        "default": []
      }
  },
  {
      "key": "age", 
      "title": "Age", 
      "width": "10%"
  },
  {
      "key": "date", 
      "title": "Date of Hire", 
      "width": "10%",
      "filter": {
        "type": "daterange",
        "default": [moment().subtract(1, "year"), moment()]
      },
  },
  {
      "key": "actions",
      "title": "",
      "width": "10%" 
  },
  {
      "key": "record", 
      "title": "Projects record",
      "collapsed": true
  }
];

var data = [
  {"id": 1, "firstname": "Mike", "lastname": "F", "title": {"id": 1, "name": "Engineer"}, "age": 31,  "date": moment("11/10/2019"), "valid": true, "record": ["detailed", "info"]},
  {"id": 2, "firstname": "John", "lastname": "L", "title": {"id": 1, "name": "Engineer"}, "age": 23,  "date": moment("06/10/2020"), "valid": false, "record": ["detailed", "info"]},
  {"id": 3, "firstname": "David", "lastname": "V", "title": {"id": 1, "name": "Engineer"}, "age": 27,  "date": moment("10/10/2019"), "valid": true, "record": ["detailed", "info"]},
  {"id": 4, "firstname": "Paul", "lastname": "H", "title": {"id": 3, "name": "Accountant"}, "age": 45,  "date": moment("07/10/2020"), "valid": true, "record": ["detailed", "info"]},
  {"id": 5, "firstname": "Andrew", "lastname": "D", "title": {"id": 1, "name": "Engineer"}, "age": 28,  "date": moment("12/10/2019"), "valid": true, "record": ["detailed", "info"]},
  {"id": 6, "firstname": "James", "lastname": "K", "title": {"id": 1, "name": "Engineer"}, "age": 47,  "date": moment("10/10/2019"), "valid": true, "record": ["detailed", "info"]},
  {"id": 7, "firstname": "Mary", "lastname": "E", "title": {"id": 2, "name": "Sales Manager"}, "age": 39,  "date": moment("11/10/2019"), "valid": true, "record": ["detailed", "info"]},
  {"id": 8, "firstname": "Don", "lastname": "M", "title": {"id": 1, "name": "Engineer"}, "age": 28,  "date": moment("07/07/2020"), "valid": true, "record": ["detailed", "info"]},
  {"id": 9, "firstname": "Julia", "lastname": "O", "title": {"id": 2, "name": "Sales Manager"}, "age": 53,  "date": moment("03/10/2020"), "valid": true, "record": ["detailed", "info"]},
  {"id": 10, "firstname": "Sam", "lastname": "E", "title": {"id": 3, "name": "Accountant"}, "age": 34,  "date": moment("06/10/2020"), "valid": true, "record": ["detailed", "info"]}
];

var demoTableRef = React.createRef();

var emps = data.map((item) => {
  let recList = item.record.map((rec) => { return (<li>{rec}</li>) })
  return {...item, "record": (item.record) ? (<ul>{recList}</ul>):null, "actions": (
    <a 
        href="#"
        onClick={e => { e.preventDefault(); demoTableRef.current.toggleCollapsed(item.id); }}>
        see details
    </a>
  )}
})

// Fired on click event on a row
function onClick(id) {
  alert(`Row #${id} has been selected`)
}

// Fired when rows filter was changed
function onFilter(filters) {
  emps = data.filter((item) => {
    if (filters.id != '' && filters.id != item.id) return false;
    if (filters.firstname != '' && item.firstname.toLowerCase().indexOf(filters.firstname.toLowerCase()) < 0) return false;
    if (filters.lastname != '' && item.lastname.toLowerCase().indexOf(filters.lastname.toLowerCase()) < 0) return false;
    if (filters.title.length && filters.title.indexOf(item.title.id) < 0) return false;
    if (filters.date.length && (moment(filters.date[0]).unix() > moment(item.date).unix() || moment(filters.date[1]).unix() < moment(item.date).unix())) return false;
    
    return true;
  }).map((item) => {
    let recList = item.record.map((rec) => { return (<li>{rec}</li>) })
    return {...item, "record": (item.record) ? (<ul>{recList}</ul>):null, "actions": (
      <a 
          href="#"
          onClick={e => { e.preventDefault(); demoTableRef.current.toggleCollapsed(item.id); }}>
          see details
      </a>
    )}
  })

  renderSmartTable();
}

function renderSmartTable() {
  ReactDOM.render(
    <SmartTable ref={demoTableRef} id="id" headers={headers} labels={labels} data={emps} valid="valid" collapsed="record" isLoading={false} onClick={onClick} onFilter={onFilter} />,
    document.getElementById("root")
  );
}

renderSmartTable();