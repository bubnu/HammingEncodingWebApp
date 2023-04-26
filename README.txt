Open server in cmd and type following commands:
npm install
node index.js

Open client in another cmd and type following commands:
npm install http-server -g
http-server

Open index.html from client file.


The app simulates a corrupted data transmition between the client and the server,
the 4/8/n bit sequence is encoded using Hanning algorithm,
then the encoded sequence is hard coded inside server/index.js to have a corrupted bit
bits = distortBit(bits, 5); <--- change this