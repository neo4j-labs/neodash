
# Hive docker build
The Hive extension of NeoDash requires access to a private solutions npm repository. This article has been helpful in troubleshooting the issues with creating a Docker build using a private repo: https://docs.npmjs.com/docker-and-private-modules. 

## .npmrc setup
Access to private npm repos need an auth token to be defined in the user's .npmrc file. This file is typically stored in the user's home directory. The first entry should be:

```
//registry.npmjs.org/:_authToken=<the auth token>
```
Where `<the auth token>` is a token you have received to access the private repo.

## Docker file setup
To take advantage of this during a docker build, you need to use Docker secrets to pass in the .npmrc file. This line in the Docker file shows how this is done:

```
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm install --legacy-peer-deps
```

## Building the Docker image
Once the previous items are setup, you can use the following command to build the docker image:

```
docker build . -t neodash-hive:1.0 --secret id=npmrc,src=$HOME/.npmrc
```

During initial testing, the $HOME environment variable was replaced with the actual fully qualified directory path of my home directory. I presume if $HOME is defined to point to the directory that contains your .npmrc file, it should work fine, but it has not been tested.