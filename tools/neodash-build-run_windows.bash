#!/bin/bash

args=$(getopt -l "port:" -o "p:h" -- "$@")

eval set -- "$args"

while [ $# -ge 1 ]; do
        case "$1" in
                --)
                    # No more options left.
                    shift
                    break
                   ;;
                -p|--port|port)
                        port="$2"
                        shift
                        ;;
                -h)
                        echo "Display some help"
                        exit 0
                        ;;
        esac

        shift
done

docker build . -t neodash && winpty docker run -it --rm -p $port:80 neodash