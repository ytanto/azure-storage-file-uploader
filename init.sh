# /bin/sh

echo 'start'
git clone https://github.com/Azure/azure-storage-node.git
cd azure-storage-node
npm install
npm run genjs
npm install uglify-js
./node_modules/.bin/uglifyjs --compress --mangle -- ./browser/bundle/azure-storage.common.js > azure-storage.common.min.js
./node_modules/.bin/uglifyjs --compress --mangle -- ./browser/bundle/azure-storage.blob.js > azure-storage.blob.min.js
mv azure-storage.common.min.js ..
mv azure-storage.blob.min.js ..
cd ..
rm -rf azure-storage-node
echo 'complate'
