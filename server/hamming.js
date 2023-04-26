function decode(bits) {
  //console.log("received V= " + bits);
  let numberOfDataBits = JSON.parse(JSON.stringify(bits.length));
  let lengthEncodedMessage = JSON.parse(JSON.stringify(bits.length));
  for(var i=0; i<lengthEncodedMessage; i++){
    if(isPowerOfTwo(i+1))numberOfDataBits--;
  }
  //console.log(numberOfDataBits + " " + lengthEncodedMessage);
  //cream matricea hanning
  let hanningTranspus = [[]];

  for(var i = 0 ; i < lengthEncodedMessage - numberOfDataBits - 1; i++){
    hanningTranspus[0].push(0);
  }
  hanningTranspus[0].push(1);

  for(var i = 1 ; i < lengthEncodedMessage ; i++){
    let hanningAux = JSON.parse(JSON.stringify(hanningTranspus[i-1])); //deep vs shallow copy, trag in ele
    hanningAux[hanningAux.length-1]++;
    for(var j = lengthEncodedMessage - numberOfDataBits - 1 ; j > 0 ; j--){
      if(hanningAux[j] > 1){
        hanningAux[j] = 0;
        hanningAux[j-1]++;
      }
    }
    hanningTranspus.push(hanningAux);
    //console.log(hanningTranspus[i]);
  }
  let hanning = [];
  for(var i = 0; i<lengthEncodedMessage - numberOfDataBits;i++){
    hanning.push([]);
    for(var j=0 ; j<lengthEncodedMessage;j++){
      hanning[i].push(hanningTranspus[j][i]);
    }
    //console.log(hanning[i]);
  }

  let errorPosition = 0;
  let errorDetected;

  for(var i = 0, pwrOfTwo=1; i < lengthEncodedMessage - numberOfDataBits ; i++){
    let j=0;
    let ecHanning = 0;
    for(j;j<lengthEncodedMessage;j++){
      if(hanning[i][j]==1) ecHanning = ecHanning ^ bits[j];
    }
    errorPosition = errorPosition + ecHanning*pwrOfTwo;
    pwrOfTwo = pwrOfTwo*2;
  }
  
  if (errorPosition != 0) errorDetected = true;
  if (errorDetected) {
    bits[errorPosition - 1] = parity(bits[errorPosition - 1] + 1);
  }
  
  return {
    errorCorrected: errorDetected,
    errorPosition: errorPosition - 1,
    bits: bits
  };
};

isPowerOfTwo =  function(x){
  while(x!=1){
    if(x%2==1) return false;
    x=x/2;
  }
  return true;
};

parity = function (number) {
  return number % 2;
};

exports.decode = decode;
