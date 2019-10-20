## css3-h5-api
# test http2

1. Generate a private key
```
openssl genrsa -out server.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
```

2. Create a CSR
```
openssl req -new -key server.key -out server.csr
```

3. Get a certificate
```
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
```
then you can run 'node ./scripts/server-http2-express.js' in the terminal