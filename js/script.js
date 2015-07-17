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

// check if date 
function isDate(date) {
    return!!(function(d){return(d!=='Invalid Date'&&!isNaN(d))})(new Date(date));
}
function isDateObject(date) {
	return Object.prototype.toString.call(date) === '[object Date]'
}

// check if function
function isFunction(f) {
  return Object.prototype.toString.call(f) == '[object Function]';
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
// /get object by ptoperty value

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
	if ( log[1] == 1 ) {
		alert("Error: " + log[0]);
		throw new Error(log[0]);
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
			/*return isDate(value)*/
			return isDateObject(value);
			return 
			break;
		case 'datetime': 
			/*return isDate(value)*/
			return isDateObject(value);
			break;
		case 'time': 
			/*return isDate(value)*/
			return isDateObject(value);
			break;
		case 'bool': 
			return typeof value === 'boolean'
			break;
	}
}
/*var datedate = new Date();
console.log(Object.prototype.toString.call(datedate) == '[object Date]');
console.log(datedate.constructor.toString());*/



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


// Validation
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
		for (var j = 0; j < requiredFields.length; j++) {
			if ( !data[i].hasOwnProperty(requiredFields[j]) ) {
				itemController.add([ requiredFields[i] + " is Required. Check element: " + i + " of data array", 1]);
			}
		}

		
		for ( var prop in data[i] ) {
			o = getByValue(dataFormats, prop);
			console.log(o);
			if ( !checkType(o.DataType, data[i][prop]) ) {
				itemController.add(["DataType is not correct in element: " + i + " of data array, it should be " + o.DataType + "!", 1]);
			}
		}	

	}
}

function addCalculatedProperty(dataFormats, data) {
	/*var calculatedProperties = [];*/
	for (var i = 0; i < dataFormats.length; i++) {
		if ( dataFormats[i].CalculateFrom && dataFormats[i].Calculate ) {
			/*calculatedProperties.push(dataFormats[i].Name);*/
			for (var j = 0; j < data.length; j++) {
				for (var k = 0; k < dataFormats[i].CalculateFrom.length; k++) {
					if ( !data[j].hasOwnProperty(dataFormats[i].CalculateFrom[k]) ) {
						itemController.add(["There are no field to calculate in element: " + j + " of data array", 2]);
						break;
					}
				}
				console.log(dataFormats[i].Name);
				var arguments = [];
				for (var k = 0; k < dataFormats[i].CalculateFrom.length; k++) {
					arguments.push(data[j][dataFormats[i].CalculateFrom[k]]);
					console.log(data[j][dataFormats[i].CalculateFrom[k]]);
				}
				data[j][dataFormats[i].Name] = dataFormats[i].Calculate.apply(this, arguments); // not finished
			}
		}
		/*for ( var prop in dataFormats[i] ) {
			console.log(prop);
		}*/
		/*isFunction(f);*/
	}
	for (var j = 0; j < data.length; j++) {
		console.log(data[j]);
	}
}

function grid(dataFormats, data) {
	dataFormatsValidation(dataFormats, data);
	addCalculatedProperty(dataFormats, data);
}



$(document).ready(function(){
	grid(dataFormats, data);
});

