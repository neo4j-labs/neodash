npm run build
aws s3 rm s3://neodash.graphapp.io/ --recursive
aws s3 sync dist s3://neodash.graphapp.io/ --acl public-read