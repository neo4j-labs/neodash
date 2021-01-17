PWD=~/IdeaProjects/neodash/ui
APPNAME=NeoDash

cd $PWD

npm run-script build
npm pack
rm -rf ../target
mkdir ../target
mv *.tgz ../target/
cd ../target
tar -xvf ${APPNAME}*.tgz
rm -f ${APPNAME}*.tgz
cp -r package/build package/dist
cp package/dist/favicon.ico package/favicon.ico
GRAPH_APP_PASSPHRASE=$( cat ../desktop.passphrase )

# sign the code & verify
npx @neo4j/code-signer --app ./package   --private-key ../neo4j-labs-app.pem   --cert ../neo4j-labs-app.cert   --passphrase $GRAPH_APP_PASSPHRASE
npx @neo4j/code-signer --verify  --app ./package --root-cert ../neo4j_desktop.cert

# pack it back up again
cd package
npm pack
mv ${APPNAME}*.tgz ../

# remove the package folder
cd ../
rm -rf package

# verify it again
tar xvf ${APPNAME}*.tgz package

npx @neo4j/code-signer --verify \
  --app ./package \
  --root-cert ../neo4j_desktop.cert

rm -rf package
