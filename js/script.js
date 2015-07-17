// check if int or float
/*function isInt(n) {
	return Math.ceil(parseFloat(n)) === n;
}*/
function isFloat(n) {
    return n === +n && n !== (n|0);
}
function isInteger(n) {
    return n === +n && n === (n|0);
}

// get object by ptoperty value
function getByValue(arr, value) {
  var o;

  for (var i=0, iLen=arr.length; i<iLen; i++) {
    o = arr[i];

    for (var p in o) {
      if (o.hasOwnProperty(p) && o[p] == value) {
        return o;
      }
    }
  }
}

// Dependency Injection 
var Injector = {
	dependencies: {},
	add : function(qualifier, obj){
		this.dependencies[qualifier] = obj; 
	},
	get : function(func){
		var obj = new func;
		var dependencies = this.resolveDependencies(func);
		func.apply(obj, dependencies);
		return obj;
	},
	resolveDependencies : function(func) {
		var args = this.getArguments(func);
		var dependencies = [];
		for ( var i = 0; i < args.length; i++) {
			dependencies.push(this.dependencies[args[i]]);
		}
		return dependencies;
	},
	getArguments : function(func) {
		//This regex is from require.js
		var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
		var args = func.toString().match(FN_ARGS)[1].split(',');
		return args;
  	}
};
// /Dependency Injection 

// Message Logger
var Logger = {
	log : function(log) {}
};
var SimpleLogger = function() {};

SimpleLogger.prototype = Object.create(Logger);

SimpleLogger.prototype.log = function(log){
	/*console.log(log);*/
	if ( log[1] == 1 ) {
		alert("Error: " + log[0]);
		throw new Error(log[0]);
		/*try {
			throw new Error(log[0])
		}
		catch(e) {
			console.error(e.name + " " + e.message);
			alert(e.name + " " + e.message);
		}*/
	} else if ( log[1] == 2 ) {
		console.warn(log[0]);
		alert("Warning: " + log[0]);
	} else {
		console.log ("Info: " + log[0])
		alert("Info: " + log[0]);
	}
	
}

var ItemController = function(logger){
	this.logger = logger;
};
ItemController.prototype.add = function(item) {
	this.logger.log(item);
};
Injector.add("logger", new SimpleLogger());
var itemController = Injector.get(ItemController);
/*itemController.add(["Message", 1]);
itemController.add(["Message2222", 2]);
itemController.add(["Message333333", 3]);*/
//  /Message Logger

// Indexof array method if it is not suported
var indexOf = function(needle) {
	if(typeof Array.prototype.indexOf === 'function') {
		indexOf = Array.prototype.indexOf;
	} else {
		indexOf = function(needle) {
			var i = -1, index = -1;
			for(i = 0; i < this.length; i++) {
				if(this[i] === needle) {
					index = i;
					break;
				}
			}
			return index;
		};
	}
	return indexOf.call(this, needle);
};
// /Indexof array method if it is not suported

// array of allowed DataTypes
var DataTypes = {
	String: 'string',
	Int: 'int', 
	Double: 'double', 
	Date: 'date', 
	Datetime: 'datetime',
	Time: 'time', 
	Bool: 'bool', 
	Enum: 'enum'
}

function checkType(type, value) {
	switch (type) {
		case 'string':
			return typeof value === 'string'
			break;
		case 'int': 
			return isInteger(value);
			break;
		case 'double': 
			return isFloat(value);
			break;
		case 'date': 
			return isDate(value)
			break;
		case 'datetime': 
			return isDate(value)
			break;
		case 'time': 
			return isDate(value)
			break;
	}
}
/*var datedate = new Date();
console.log(Object.prototype.toString.call(datedate) == '[object Date]');
console.log(datedate.constructor.toString());*/
function isDate(date) {
    return!!(function(d){return(d!=='Invalid Date'&&!isNaN(d))})(new Date(date));
}


// array of allowed Propeties in dataFormats
var allowedPropeties = ["Name", "DataType", "IsRequired", "CalculateFrom", "Calculate"];

// dataFormats
var dataFormats =
[
{
	Name: "Login",
	DataType: DataTypes.String,
	IsRequired: true
},
{
	Name: "BirthDate",
	DataType: DataTypes.Date,
	IsRequired: false
},
{
	Name: "Age",
	DataType: DataTypes.Int,
	IsRequired: false,
	CalculateFrom: ["BirthDate"],
	Calculate: function (birthDate)
	{
		// Calculates age in years
		(Date.now() - birthDate) / (1000 * 60 * 60 * 24 * 365)
	}
}
];

var data =
[
	{
		Login: "User",
		BirthDate: new Date("01/01/2000") // Age calculates automatically
	}
];


// Validation of dataFormats
function dataFormatsValidation(dataFormats, data) {
	// dataFormats validation
	for (var i = 0; i < dataFormats.length; i++) {
		if ( dataFormats[i].Name == undefined ) {
			/*console.log("name in element: " + i + " of dataFormats should be specified");*/
			itemController.add(["name in element: " + i + " of dataFormats should be specified", 1]);
		} 
		if ( dataFormats[i].DataType == undefined ) {
			/*console.log("DataType should be specified");*/
			itemController.add(["in element: " + i + " of dataFormats DataType should be specified", 1]);
		} /*else if ( !(dataFormats[i].DataType === true) ) {
			itemController.add(["element: " + i + " have not allowed DataType", 1]);
		}*/
		if ( dataFormats[i].IsRequired == undefined ) {
			/*console.log("IsRequired should be specified");*/
			itemController.add(["in element: " + i + " of dataFormats IsRequired should be specified", 1]);
		}
		if ( dataFormats[i].CalculateFrom && !dataFormats[i].Calculate ) {
			/*console.log("CalculateFrom cant be present if Calculate - not");*/
			itemController.add(["in element: " + i + " of dataFormats CalculateFrom cant be present if Calculate - not", 1]);
		} else if ( dataFormats[i].CalculateFrom && dataFormats[i].CalculateFrom.length != dataFormats[i].Calculate.length ) {
			/*console.log("CalculateFrom length in element: " + i + " does not equal quantity of Calculate arguments ");*/
			itemController.add(["CalculateFrom length in element: " + i + " does not equal quantity of Calculate arguments ", 1]);
		}

		for ( var prop in dataFormats[i] ) {
			if ( indexOf.call(allowedPropeties, prop) == -1 ) {
				/*console.log("Not allowed " + prop + " property in DataFormat");*/
				itemController.add(["Not allowed " + prop + " property in DataFormat", 2]);
			}
		}		
	}

	// data validation
	var requiredFields = [];
	for (var i = 0; i < dataFormats.length; i++) {
		if ( dataFormats[i].IsRequired === true ) {
			requiredFields.push(dataFormats[i].Name);
		}
	}
	console.log(requiredFields);

	/*var propertyName = dataFormats[0].Name;*/
	for (var i = 0; i < data.length; i++) {
		/*if ( !data[i].hasOwnProperty(propertyName) ) {
			itemController.add([ propertyName + " is Required. Check element: " + i + " of data array", 1]);
		} 
		if ( typeof data[i][] != string )
		console.log(typeof data[i][propertyName])*/
		/*for ( var prop in data[i] ) {
			var relatedDataFormat = getByValue(dataFormats, prop)
			console.log(relatedDataFormat);

		}*/

		for (var j = 0; j < requiredFields.length; j++) {
			if ( !data[i].hasOwnProperty(requiredFields[j]) ) {
				itemController.add([ requiredFields[i] + " is Required. Check element: " + i + " of data array", 1]);
			}
		}
	}
}



$(document).ready(function(){
	dataFormatsValidation(dataFormats, data);
});

