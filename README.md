# react-smart-table - a React component to enrich table functionality with filters

![npm](https://img.shields.io/npm/v/@mikhailfarberov/react-smart-table)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/@mikhailfarberov/react-smart-table/peer/react)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/@mikhailfarberov/react-smart-table/peer/react-dom)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/@mikhailfarberov/react-smart-table/peer/prop-types)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/@mikhailfarberov/react-smart-table/peer/reactstrap)

react-smart provides a simple and stylish organizational chart React component. It supports different chart node attributes (see #configuration) and multi-root tree (see #demo).

## Table of Contents

1. [Installation](#installation)
2. [Demo](#usage)
3. [Configuration](#configuration)
4. [License](#license)

## Installation

Install via Npm:
```npm install @mikhailfarberov/react-smart-table```

## Demo

See [demo](https://itworks.pw/demo/react-smart-table/) or https://github.com/mikhailfarberov/react-smart-table/blob/master/demo/

```
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
  }
];

var data = [
  {"id": 1, "firstname": "Mike", "lastname": "F", "title": {"id": 1, "name": "Engineer"}, "age": 31,  "date": moment("11/10/2019")},
  {"id": 2, "firstname": "John", "lastname": "L", "title": {"id": 1, "name": "Engineer"}, "age": 23,  "date": moment("06/10/2020")},
  {"id": 3, "firstname": "David", "lastname": "V", "title": {"id": 1, "name": "Engineer"}, "age": 27,  "date": moment("10/10/2019")},
  {"id": 4, "firstname": "Paul", "lastname": "H", "title": {"id": 3, "name": "Accountant"}, "age": 45,  "date": moment("07/10/2020")},
  {"id": 5, "firstname": "Andrew", "lastname": "D", "title": {"id": 1, "name": "Engineer"}, "age": 28,  "date": moment("12/10/2019")},
  {"id": 6, "firstname": "James", "lastname": "K", "title": {"id": 1, "name": "Engineer"}, "age": 47,  "date": moment("10/10/2019")},
  {"id": 7, "firstname": "Mary", "lastname": "E", "title": {"id": 2, "name": "Sales Manager"}, "age": 39,  "date": moment("11/10/2019")},
  {"id": 8, "firstname": "Don", "lastname": "M", "title": {"id": 1, "name": "Engineer"}, "age": 28,  "date": moment("07/07/2020")},
  {"id": 9, "firstname": "Julia", "lastname": "O", "title": {"id": 2, "name": "Sales Manager"}, "age": 53,  "date": moment("03/10/2020")},
  {"id": 10, "firstname": "Sam", "lastname": "E", "title": {"id": 3, "name": "Accountant"}, "age": 34,  "date": moment("06/10/2020")}
];

<SmartTable id="id" headers={headers} data={data} />
```

## Configuration

The SmartTable component accepts the following properties:
* id - a key of indexed column 
* headers - an array of headers description (see above)
* labels - localized strings (see above). Optional
* data - an array of rows (see above)
* valid - a key of a column with boolean values. Allows highlighting rows with errors. Optional 
* collapsed = a key of a column with additional info that is collapsed until the external method toggleCollapsed is called. Optional
* isLoading - show loading spinner. Optional. Default false.
* onClick - an event fired when a row is clicked. Optional
* onFilter - ane event fired when filter values were changes. Optional


## License
react-smart-table is released under the [MIT](https://github.com/mikhailfarberov/react-smart-table/blob/master/LICENSE) license.