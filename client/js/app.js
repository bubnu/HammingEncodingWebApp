let app = new Vue({
  el: '#hamming-encoder',
  data: {
    dataBits: [],
    status: '',
    numberOfDataBits: 4
  },
  created: function () {
    this.initDataBits(4);
  },
  methods: {
    updateNumberOfDataBits: function(){
        this.numberOfDataBits = parseInt(document.getElementById('inputNoBits').value);
        this.initDataBits();
    },

    initDataBits: function () {
      this.dataBits = [];

      for (let i = 0; i < this.numberOfDataBits; i++) {
        let bit = { data: null };
        this.dataBits.push(bit);
      }
    },
    send: function () {
      if (this.validate(this.dataBits) === true) {
        var encodedMessage = this.encode(this.dataBits);
        // this.status = encodedMessage + ' encoded sent to server';

        return axios
          .put('http://localhost:3000/message', { bits: encodedMessage })
          .then(response => (this.status = response.data));
      } else {
        this.status =
          'Input is not valid. Please use 0 or 1 as data bit values';
      }
    },
    encode: function (bits) {
      // This function must be changed to allow any number of data bits
      // Right now it only works for 4 data bits
      //console.log(this.numberOfDataBits);

      //
      let encodedMessage = [];
      let lengthEncodedMessage = this.numberOfDataBits;
      for(var i = 0, j = 0; i < lengthEncodedMessage; i++){
        if(this.isPowerOfTwo(i+1)){
          encodedMessage[i] = 0;
          lengthEncodedMessage++;
        }else {
          encodedMessage[i] = parseInt(bits[j++].data);
        }
      }
      
      //cream matricea hanning
      let hanningTranspus = [[]];
      for(var i = 0 ; i < lengthEncodedMessage -this.numberOfDataBits - 1; i++){
        hanningTranspus[0].push(0);
      }
      hanningTranspus[0].push(1);

      for(var i = 1 ; i < lengthEncodedMessage ; i++){
        let hanningAux = JSON.parse(JSON.stringify(hanningTranspus[i-1])); //deep vs shallow copy, trag in ele
        hanningAux[hanningAux.length-1]++;
        for(var j = lengthEncodedMessage - this.numberOfDataBits - 1 ; j > 0 ; j--){
          if(hanningAux[j] > 1){
            hanningAux[j] = 0;
            hanningAux[j-1]++;
          }
        }
        hanningTranspus.push(hanningAux);
        //console.log(hanningTranspus[i]);
      }

      let hanning = [];
      for(var i = 0; i<lengthEncodedMessage - this.numberOfDataBits;i++){
        hanning.push([]);
        for(var j=0 ; j<lengthEncodedMessage;j++){
          hanning[i].push(hanningTranspus[j][i]);
        }
        //console.log(hanning[i]);
      }
      
      //aflam bitii de control
      for(var i = 0 ; i < lengthEncodedMessage - this.numberOfDataBits ; i++){
        var j=0;
        for(j;j<lengthEncodedMessage;j++){
          if(hanning[i][j]==1) break;
        }
        for(var k=j+1;k<lengthEncodedMessage;k++){
          if(hanning[i][k]==1)
            encodedMessage[j] = encodedMessage[k] ^ encodedMessage[j];
        }
      }
      //console.log("V= " + encodedMessage);
      return encodedMessage;

    },
    isPowerOfTwo: function(x){
      while(x!=1){
        if(x%2==1) return false;
        x=x/2;
      }
      return true;
    },
    parity: function (number) {
      return number % 2;
    },
    validate: function (bits) {
      for (var i = 0; i < bits.length; i++) {
        if (this.validateBit(bits[i].data) === false) return false;
      }
      return true;
    },
    validateBit: function (character) {
      if (character === null) return false;
      return parseInt(character) === 0 || parseInt(character) === 1;
    }
  }
});
