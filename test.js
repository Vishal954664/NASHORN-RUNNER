function greet(params) {
    return "Hello, " + params.name;
  }
  
  function addNumbers(params) {
    return params.a + params.b;
  }
  
  function getFullName(params) {
    return params.firstName + " " + params.lastName;
  }
  
  function sumArray(params) {
    var sum = 0;
    for (var i = 0; i < params.numbers.length; i++) {
      sum += params.numbers[i];
    }
    return sum;
  }
  
  function nestedExample(params) {
    return "User: " + params.user.name + ", Age: " + params.user.age;
  }
  
  // ✅ Function that calls other functions
  function complexGreeting(params) {
    var fullName = getFullName({
      firstName: params.firstName,
      lastName: params.lastName
    });
  
    var message = greet({
      name: fullName
    });
  
    return message;
  }
  var c = 5;
  function add  (a,b){
    return a + b+c;
  }
  